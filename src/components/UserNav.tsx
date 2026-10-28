import React, { useState, useRef, useEffect } from 'react';
import {
  Shield,
  LogOut,
  ChevronDown,
  Sparkles,
  ShieldAlert,
  ShieldCheck
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
    <div className="relative font-mono z-50" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono transition-all cursor-pointer shadow-xs border ${
          menuOpen
            ? 'bg-slate-800 border-sky-400/60 shadow-[0_0_12px_rgba(56,189,248,0.2)]'
            : isAdmin
            ? 'bg-[#0e1626] hover:bg-[#121c32] border-amber-500/40 text-amber-300 hover:border-amber-400'
            : 'bg-[var(--bg-surface-elevated)]/90 hover:bg-[var(--bg-surface-hover)] border-[var(--hud-border)] hover:border-sky-500/50 text-slate-200'
        }`}
      >
        {/* Role Icon */}
        {isAdmin ? (
          <ShieldAlert size={12} className="text-amber-400 shrink-0" />
        ) : (
          <ShieldCheck size={12} className="text-sky-400 shrink-0" />
        )}

        {/* Operator Call Sign */}
        <span className="font-bold truncate max-w-[120px] text-white">
          {displayName}
        </span>

        {/* Role Badge */}
        <span
          className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider ${
            isAdmin
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
          }`}
        >
          {role || 'INDIVIDUAL'}
        </span>

        <ChevronDown
          size={11}
          className={`text-slate-400 transition-transform duration-200 ${
            menuOpen ? 'rotate-180 text-sky-400' : ''
          }`}
        />
      </button>

      {/* Profile Overview Card (Solid, Modern, Floating Above All Tickers) */}
      {menuOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-72 rounded-xl border overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.06)] animate-fade-in z-[9999]"
          style={{
            backgroundColor: '#0A0F1D',
            borderColor: isAdmin ? 'rgba(245, 158, 11, 0.35)' : 'rgba(56, 189, 248, 0.3)'
          }}
        >
          {/* Top glowing accent strip */}
          <div
            className={`h-[2px] w-full ${
              isAdmin
                ? 'bg-gradient-to-r from-amber-500 via-amber-300 to-yellow-500'
                : 'bg-gradient-to-r from-sky-500 via-cyan-400 to-indigo-500'
            }`}
          />

          {/* Profile Header Details */}
          <div className="p-3.5 pb-3 bg-[#0c1324] border-b border-slate-800/80">
            <div className="flex items-start gap-3">
              {/* Avatar Icon */}
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                  isAdmin
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                    : 'bg-sky-500/15 border-sky-500/30 text-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.2)]'
                }`}
              >
                {isAdmin ? <ShieldAlert size={18} /> : <ShieldCheck size={18} />}
              </div>

              {/* Identity & Email */}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white tracking-wide truncate">
                  {displayName}
                </div>
                <div className="text-[10.5px] text-slate-400 font-mono truncate mt-0.5">
                  {user.email}
                </div>

                {/* Status Dot + Clearance */}
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_#34d399] animate-pulse" />
                  <span className="text-[9.5px] uppercase font-bold tracking-wider text-slate-400">
                    STATUS:
                  </span>
                  <span
                    className={`text-[9.5px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                      isAdmin
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    }`}
                  >
                    {isAdmin ? 'COMMAND STAFF (ADMIN)' : 'INDIVIDUAL OPERATOR'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Clearance Banner */}
          {isAdmin && (
            <div className="mx-3 my-2.5 px-2.5 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/25 flex items-center justify-between text-[10.5px]">
              <span className="text-amber-300 font-semibold flex items-center gap-1.5">
                <Sparkles size={12} className="text-amber-400" />
                ADMIN ACCESS
              </span>
              <span className="text-[9px] px-1 py-0.2 rounded font-mono font-bold bg-amber-400/20 text-amber-200 border border-amber-400/30">
                ACTIVE
              </span>
            </div>
          )}

          {/* Action Row */}
          <div className="p-1.5 pt-1">
            <button
              onClick={async () => {
                setMenuOpen(false);
                await signOut();
              }}
              className="w-full px-3 py-2 rounded-md text-left text-xs text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 flex items-center justify-between transition-colors cursor-pointer group"
            >
              <span className="font-semibold tracking-wider text-[11px]">
                SIGN OUT
              </span>
              <LogOut size={13} className="text-slate-500 group-hover:text-rose-400 transition-colors" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
