import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Loader2, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';
import { invalidateFeedCache } from '../services/liveFeedAdapter';

interface AdminRefreshButtonProps {
  onRefreshSuccess?: () => void;
  className?: string;
}

type RefreshState = 'idle' | 'dispatching' | 'queued' | 'running' | 'success' | 'error';

export const AdminRefreshButton: React.FC<AdminRefreshButtonProps> = ({
  onRefreshSuccess,
  className = ''
}) => {
  const { user, isAdmin } = useAuth();
  const [state, setState] = useState<RefreshState>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<number | null>(null);
  const pollTimerRef = useRef<any>(null);
  const cooldownTimerRef = useRef<any>(null);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    };
  }, []);

  // Cooldown countdown tick
  useEffect(() => {
    if (cooldownRemaining <= 0) return;
    cooldownTimerRef.current = setInterval(() => {
      setCooldownRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(cooldownTimerRef.current);
  }, [cooldownRemaining]);

  // If user is not authenticated as admin, strictly do not render anything
  if (!isAdmin || !user) {
    return null;
  }

  const pollRunStatus = async (token: string, startTime: number) => {
    const MAX_POLL_MS = 10 * 60 * 1000; // 10 minutes max polling window

    const checkStatus = async () => {
      if (Date.now() - startTime > MAX_POLL_MS) {
        clearInterval(pollTimerRef.current);
        setState('error');
        setStatusMessage('Ingestion timeout (>10 min). Check GitHub Actions.');
        return;
      }

      try {
        const res = await fetch('/api/admin/refresh-status', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          }
        });

        if (!res.ok) return;

        const data = await res.json();
        const run = data?.run;

        if (!run) return;

        if (run.status === 'queued') {
          setState('queued');
          setStatusMessage('Queued on GitHub runner...');
        } else if (run.status === 'in_progress') {
          setState('running');
          setStatusMessage('Ingesting & clustering OSINT...');
        } else if (run.status === 'completed') {
          clearInterval(pollTimerRef.current);

          if (run.conclusion === 'success') {
            setState('success');
            setStatusMessage('Feed updated from Supabase!');
            setLastRefreshedAt(Date.now());
            setCooldownRemaining(300); // 5-minute cooldown

            // Addendum b: refetch /api/feed immediately and show new items
            invalidateFeedCache();
            if (onRefreshSuccess) {
              onRefreshSuccess();
            }

            setTimeout(() => {
              setState('idle');
              setStatusMessage('');
            }, 6000);
          } else {
            setState('error');
            setStatusMessage(`Workflow ended: ${run.conclusion || 'failed'}`);
            setTimeout(() => {
              setState('idle');
              setStatusMessage('');
            }, 8000);
          }
        }
      } catch (err) {
        console.warn('[AdminRefresh] Status poll warning:', err);
      }
    };

    // First check after 3 seconds, then every 15 seconds
    setTimeout(checkStatus, 3000);
    pollTimerRef.current = setInterval(checkStatus, 15000);
  };

  const handleTriggerRefresh = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (state !== 'idle' && state !== 'error') return;
    if (cooldownRemaining > 0) return;

    try {
      setState('dispatching');
      setStatusMessage('Requesting workflow dispatch...');

      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        setState('error');
        setStatusMessage('Error: No active auth session');
        return;
      }

      const res = await fetch('/api/admin/refresh-feed', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      });

      const data = await res.json();

      if (res.status === 429) {
        setState('idle');
        const remaining = data.cooldownSeconds || 60;
        setCooldownRemaining(remaining);
        setStatusMessage(data.error || `Cooldown: wait ${remaining}s`);
        setTimeout(() => setStatusMessage(''), 5000);
        return;
      }

      if (!res.ok) {
        setState('error');
        setStatusMessage(data.error || 'Failed to dispatch ingestion');
        setTimeout(() => {
          setState('idle');
          setStatusMessage('');
        }, 6000);
        return;
      }

      // Dispatched successfully! Begin 15-second polling
      setState('queued');
      setStatusMessage('Ingestion started: queued on runner...');
      pollRunStatus(token, Date.now());

    } catch (err: any) {
      setState('error');
      setStatusMessage(err?.message || 'Network error');
      setTimeout(() => {
        setState('idle');
        setStatusMessage('');
      }, 5000);
    }
  };

  const isBusy = state === 'dispatching' || state === 'queued' || state === 'running';

  const timeSinceLastRefresh = () => {
    if (!lastRefreshedAt) return null;
    const diffMin = Math.floor((Date.now() - lastRefreshedAt) / 60000);
    if (diffMin < 1) return 'just now';
    return `${diffMin}m ago`;
  };

  return (
    <div className={`inline-flex items-center gap-1.5 font-mono text-xs ${className}`}>
      <button
        type="button"
        onClick={handleTriggerRefresh}
        disabled={isBusy || cooldownRemaining > 0}
        title={
          cooldownRemaining > 0
            ? `Ingestion cooldown active: ${cooldownRemaining}s remaining`
            : "Admin Only: Trigger Headless Ingest Pipeline & Refresh Supabase Feed"
        }
        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-[3px] border font-bold text-[10.5px] transition-all cursor-pointer shadow-xs ${
          isBusy
            ? 'bg-sky-500/15 border-sky-500/40 text-sky-400 cursor-wait'
            : cooldownRemaining > 0
            ? 'bg-slate-800/40 border-slate-700 text-slate-500 cursor-not-allowed'
            : 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:border-emerald-400'
        }`}
      >
        {isBusy ? (
          <Loader2 size={11} className="animate-spin text-sky-400" />
        ) : (
          <RefreshCw size={11} className={cooldownRemaining > 0 ? 'text-slate-500' : 'text-emerald-400'} />
        )}

        <span>
          {isBusy
            ? 'INGESTING...'
            : cooldownRemaining > 0
            ? `COOLDOWN (${cooldownRemaining}s)`
            : 'REFRESH FEED'}
        </span>
      </button>

      {/* Real-Time Live Status Feedback */}
      {statusMessage ? (
        <span
          className={`text-[9.5px] truncate max-w-[170px] ${
            state === 'success'
              ? 'text-emerald-400 font-bold'
              : state === 'error'
              ? 'text-rose-400'
              : 'text-sky-400 animate-pulse'
          }`}
          title={statusMessage}
        >
          {statusMessage}
        </span>
      ) : timeSinceLastRefresh() ? (
        <span className="text-[9.5px] text-slate-500">
          Updated {timeSinceLastRefresh()}
        </span>
      ) : null}
    </div>
  );
};
