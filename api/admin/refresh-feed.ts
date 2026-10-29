export interface VercelRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  query: Record<string, string | string[] | undefined>;
  body?: any;
}

export interface VercelResponse {
  status(code: number): VercelResponse;
  json(body: any): VercelResponse;
  setHeader(name: string, value: string | number | readonly string[]): VercelResponse;
  end(chunk?: any): VercelResponse;
}

const GITHUB_OWNER = 'anantjain1109';
const GITHUB_REPO = 'Manekshaw.Vision';
const WORKFLOW_ID = 'ingest-intel.yml';
const COOLDOWN_SECONDS = 300; // 5-minute abuse protection window

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS & Security headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://fahbbsdgurtwmfjhtxkh.supabase.co';
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
    const dispatchToken = process.env.GITHUB_DISPATCH_TOKEN || process.env.GH_TOKEN || process.env.GITHUB_TOKEN || '';

    // 1. Verify caller's Supabase JWT
    const authHeader = req.headers?.authorization || req.headers?.Authorization;
    const token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
      ? authHeader.slice(7).trim()
      : '';

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Missing or invalid Authorization Bearer token.'
      });
    }

    // Call Supabase /auth/v1/user to verify signature & retrieve identity
    const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: supabaseAnonKey
      }
    });

    if (!userRes.ok) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Supabase session is invalid or expired.'
      });
    }

    const userData = await userRes.json();
    const userId = userData?.id;

    // 2. Check Admin role: check app_metadata first, then check profiles table
    let isAdmin = userData?.app_metadata?.role === 'admin';

    if (!isAdmin && userId) {
      try {
        const profileRes = await fetch(
          `${supabaseUrl}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}&select=role`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              apikey: supabaseAnonKey,
              Accept: 'application/json'
            }
          }
        );
        if (profileRes.ok) {
          const profileRows = await profileRes.json();
          if (Array.isArray(profileRows) && profileRows.length > 0) {
            isAdmin = profileRows[0]?.role === 'admin';
          }
        }
      } catch (err) {
        console.warn('[Admin API] Profile check warning:', err);
      }
    }

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: Administrator privileges required to dispatch manual feed ingestion.'
      });
    }

    if (!dispatchToken) {
      return res.status(500).json({
        success: false,
        error: 'Server configuration error: GITHUB_DISPATCH_TOKEN is not set in environment variables.'
      });
    }

    // 3. Abuse Protection: check recent workflow runs for queued/in-progress or <5min cooldown
    const runsUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/workflows/${WORKFLOW_ID}/runs?per_page=5`;
    const runsRes = await fetch(runsUrl, {
      headers: {
        Authorization: `Bearer ${dispatchToken}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'ManekshawVision-Admin/1.0'
      }
    });

    if (runsRes.ok) {
      const runsData = await runsRes.json();
      const workflowRuns = runsData?.workflow_runs || [];

      // Check if any run is currently running or queued
      const activeRun = workflowRuns.find((r: any) =>
        ['queued', 'in_progress', 'waiting', 'requested', 'pending'].includes(r.status)
      );

      if (activeRun) {
        return res.status(429).json({
          success: false,
          error: `An intel ingestion workflow is already active (status: ${activeRun.status}). Please wait for it to complete.`,
          status: activeRun.status,
          runId: activeRun.id,
          htmlUrl: activeRun.html_url
        });
      }

      // Check time since latest run
      if (workflowRuns.length > 0) {
        const latestRun = workflowRuns[0];
        const runStartedAt = new Date(latestRun.run_started_at || latestRun.created_at).getTime();
        const now = Date.now();
        const elapsedSec = Math.floor((now - runStartedAt) / 1000);

        if (elapsedSec < COOLDOWN_SECONDS) {
          const remainingSec = COOLDOWN_SECONDS - elapsedSec;
          return res.status(429).json({
            success: false,
            error: `Ingestion ran ${elapsedSec}s ago. Rate limit cooldown active: please wait ${remainingSec}s before dispatching again.`,
            cooldownSeconds: remainingSec,
            runId: latestRun.id,
            conclusion: latestRun.conclusion
          });
        }
      }
    }

    // 4. Dispatch GitHub Actions workflow
    const dispatchUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/workflows/${WORKFLOW_ID}/dispatches`;
    const dispatchRes = await fetch(dispatchUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${dispatchToken}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'User-Agent': 'ManekshawVision-Admin/1.0'
      },
      body: JSON.stringify({ ref: 'main' })
    });

    if (dispatchRes.status === 204 || dispatchRes.ok) {
      return res.status(200).json({
        success: true,
        message: 'Headless intel ingestion pipeline triggered successfully.',
        dispatchedAt: new Date().toISOString()
      });
    }

    const errBody = await dispatchRes.text();
    return res.status(dispatchRes.status).json({
      success: false,
      error: `GitHub Actions dispatch returned HTTP ${dispatchRes.status}: ${errBody}`
    });

  } catch (err: any) {
    console.error('[Admin Refresh Feed] Handler error:', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Internal server error'
    });
  }
}
