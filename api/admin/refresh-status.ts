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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://fahbbsdgurtwmfjhtxkh.supabase.co';
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
    const dispatchToken = process.env.GITHUB_DISPATCH_TOKEN || process.env.GH_TOKEN || process.env.GITHUB_TOKEN || '';

    // Verify caller's Supabase JWT
    const authHeader = req.headers?.authorization || req.headers?.Authorization;
    const token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
      ? authHeader.slice(7).trim()
      : '';

    if (!token) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Missing Authorization Bearer token.' });
    }

    const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${token}`, apikey: supabaseAnonKey }
    });

    if (!userRes.ok) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Invalid Supabase session.' });
    }

    const userData = await userRes.json();
    let isAdmin = userData?.app_metadata?.role === 'admin';

    if (!isAdmin && userData?.id) {
      try {
        const profileRes = await fetch(
          `${supabaseUrl}/rest/v1/profiles?id=eq.${encodeURIComponent(userData.id)}&select=role`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              apikey: supabaseAnonKey,
              Accept: 'application/json'
            }
          }
        );
        if (profileRes.ok) {
          const rows = await profileRes.json();
          if (Array.isArray(rows) && rows.length > 0) {
            isAdmin = rows[0]?.role === 'admin';
          }
        }
      } catch (err) {
        console.warn('[Admin Status API] Profile check warning:', err);
      }
    }

    if (!isAdmin) {
      return res.status(403).json({ success: false, error: 'Forbidden: Admin privileges required.' });
    }

    if (!dispatchToken) {
      return res.status(500).json({ success: false, error: 'GITHUB_DISPATCH_TOKEN is not set.' });
    }

    const runsUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/workflows/${WORKFLOW_ID}/runs?per_page=1`;
    const runsRes = await fetch(runsUrl, {
      headers: {
        Authorization: `Bearer ${dispatchToken}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'ManekshawVision-Admin/1.0'
      }
    });

    if (!runsRes.ok) {
      return res.status(runsRes.status).json({ success: false, error: 'Failed to fetch workflow status from GitHub.' });
    }

    const runsData = await runsRes.json();
    const latest = runsData?.workflow_runs?.[0] || null;

    return res.status(200).json({
      success: true,
      run: latest ? {
        id: latest.id,
        status: latest.status,          // 'queued' | 'in_progress' | 'completed'
        conclusion: latest.conclusion,  // 'success' | 'failure' | 'cancelled' | null
        created_at: latest.created_at,
        updated_at: latest.updated_at,
        html_url: latest.html_url
      } : null
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || 'Internal server error' });
  }
}
