import React, { useState, useRef, useEffect } from 'react';
import {
  Shield,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Sparkles,
  KeyRound,
  ShieldAlert,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface UserNavProps {
  onOpenAuthModal?: () => void;
  onNavigateLogin?: () => void;
  compact?: boolean;
}

export const UserNav: React.FC<UserNavProps> = ({
  onOpenAuthModal,
  onNavigateLogin,
  compact = false
}) => {
  const { user, profile, role, isAdmin, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLoginClick = () => {
    if (onNavigateLogin) {
      onNavigateLogin();
    } else if (onOpenAuthModal) {
      onOpenAuthModal();
    }
  };

  if (!user) {
    return (
      <button
        onClick={handleLoginClick}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--bg-surface-elevated)]/80 hover:bg-[var(--bg-surface-hover)] border border-[var(--hud-border)] hover:border-sky-500/50 text-[11px] font-mono text-sky-400 hover:text-sky-300 transition-all shadow-xs cursor-pointer active:scale-95 group"
        title="Sign in to your account"
      >
        <Shield size={12} className="group-hover:scale-110 transition-transform text-sky-400" />
        <span className="font-semibold tracking-wider">
          {compact ? 'SIGN IN' : 'SIGN IN'}
        </span>
      </button>
    );
  }

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'Operator';

  return (
    <div className="relative font-mono" ref={menuRef}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[var(--bg-surface-elevated)]/90 hover:bg-[var(--bg-surface-hover)] border border-[var(--hud-border)] hover:border-sky-500/50 text-[11px] transition-all cursor-pointer shadow-xs"
      >
        {/* Role Icon */}
        {isAdmin ? (
          <ShieldAlert size={12} className="text-amber-400" />
        ) : (
          <ShieldCheck size={12} className="text-sky-400" />
        )}

        {/* Operator Call Sign */}
        <span className="text-[var(--text-primary)] font-bold truncate max-w-[110px]">
          {displayName}
        </span>

        {/* Role Badge */}
        <span
          className={`px-1 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider ${
            isAdmin
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
          }`}
        >
          {role || 'INDIVIDUAL'}
        </span>

        <ChevronDown size={11} className="text-[var(--text-muted)]" />
      </button>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="absolute right-0 mt-1.5 w-60 bg-[#0B101B] border border-sky-500/30 rounded-md shadow-xl py-2 z-50 animate-fade-in text-slate-200">
          <div className="px-3 py-2 border-b border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">
              AUTHENTICATED DOSSIER
            </div>
            <div className="text-xs font-bold text-white truncate mt-0.5">
              {displayName}
            </div>
            <div className="text-[10px] text-slate-400 truncate font-mono">
              {user.email}
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">CLEARANCE:</span>
              <span
                className={`text-[9.5px] px-1.5 py-0.2 rounded font-bold uppercase ${
                  isAdmin
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                }`}
              >
                {isAdmin ? 'COMMAND STAFF (ADMIN)' : 'INDIVIDUAL OPERATOR'}
              </span>
            </div>
          </div>

          {isAdmin && (
            <div className="px-3 py-2 bg-amber-500/5 border-b border-slate-800 text-[10px] text-amber-300">
              <div className="font-bold flex items-center gap-1">
                <Sparkles size={11} />
                ADMINISTRATIVE PRIVILEGES ACTIVE
              </div>
              <div className="text-[9px] text-slate-400 mt-0.5">
                Elevated RLS clearance enabled for all platform telemetry.
              </div>
            </div>
          )}

          <div className="pt-1">
            <button
              onClick={async () => {
                setMenuOpen(false);
                await signOut();
              }}
              className="w-full px-3 py-1.5 text-left text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut size={13} />
              <span>TERMINATE SESSION</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
