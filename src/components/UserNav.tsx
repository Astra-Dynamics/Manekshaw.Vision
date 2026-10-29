import React, { useState, useRef, useEffect } from 'react';
import {
  Shield,
  ShieldCheck,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface UserNavProps {
  onOpenAuthModal?: () => void;
  onNavigateLogin?: () => void;
  compact?: boolean;
  theme?: string;
}

export const UserNav: React.FC<UserNavProps> = ({
  onOpenAuthModal,
  onNavigateLogin,
  theme
}) => {
  const isLight = theme === 'light' || (typeof document !== 'undefined' && document.body.classList.contains('light-theme'));
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

  // 1. Logged Out: Hover-expandable micro-pill (Rest: shield icon -> Hover: "Sign In / Sign Up")
  if (!user) {
    return (
      <button
        onClick={handleLoginClick}
        className={`group relative inline-flex items-center h-[30px] px-2 rounded-md transition-all duration-200 cursor-pointer overflow-hidden whitespace-nowrap select-none font-mono text-[11px] shrink-0 ${
          isLight
            ? 'text-amber-700 hover:text-amber-800 hover:bg-[var(--bg-sunken)]'
            : 'text-amber-400 hover:text-amber-300 hover:bg-[var(--bg-surface-hover)]'
        }`}
        title="Sign In / Sign Up to Manekshaw.Vision"
      >
        <span className="shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
          <Shield size={13} className={isLight ? 'text-amber-600' : 'text-amber-400'} />
        </span>
        <span className={`max-w-0 opacity-0 ml-0 overflow-hidden transition-[max-width,opacity,margin] duration-250 ease-out delay-0 group-hover:delay-200 group-hover:max-w-[180px] group-hover:opacity-100 group-hover:ml-1.5 flex items-center gap-1 font-medium ${isLight ? 'text-amber-800' : 'text-amber-300'}`}>
          Sign In / Sign Up
        </span>
      </button>
    );
  }

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'Operator';
  const roleLabel = isAdmin ? 'ADMIN' : 'ANALYST';

  return (
    <div className="relative font-mono z-50 shrink-0" ref={menuRef}>
      {/* 2. Logged In: Hover-expandable micro-pill with user callsign / name */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className={`group relative inline-flex items-center h-[30px] px-2 rounded-md transition-all duration-200 cursor-pointer overflow-hidden whitespace-nowrap select-none font-mono text-[11px] shrink-0 ${
          menuOpen
            ? isAdmin
              ? (isLight ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.25)]')
              : (isLight ? 'bg-[var(--accent-soft)] text-[var(--accent-text)] border border-[var(--accent)]/30' : 'bg-sky-500/20 text-sky-300 border border-sky-500/50 shadow-[0_0_10px_rgba(56,189,248,0.25)]')
            : isAdmin
            ? (isLight ? 'text-amber-700 hover:text-amber-800 hover:bg-[var(--bg-sunken)]' : 'text-amber-400 hover:text-amber-300 hover:bg-[var(--bg-surface-hover)]')
            : (isLight ? 'text-[var(--text-primary)] hover:text-[var(--accent-text)] hover:bg-[var(--bg-sunken)]' : 'text-sky-400 hover:text-sky-300 hover:bg-[var(--bg-surface-hover)]')
        }`}
        title={`${displayName} (${roleLabel}) - Click to view dossier`}
      >
        <span className="shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
          <ShieldCheck size={14} className={isAdmin ? (isLight ? 'text-amber-600' : 'text-amber-400') : (isLight ? 'text-[var(--accent-text)]' : 'text-sky-400')} />
        </span>
        <span className="max-w-0 opacity-0 ml-0 overflow-hidden transition-[max-width,opacity,margin] duration-250 ease-out delay-0 group-hover:delay-200 group-hover:max-w-[180px] group-hover:opacity-100 group-hover:ml-1.5 flex items-center gap-1 font-medium truncate">
          {displayName} // {roleLabel}
        </span>
      </button>

      {/* Profile Overview Card (Solid, Modern, Floating Above All Tickers) */}
      {menuOpen && (
        <div
          className={`absolute right-0 top-full mt-2 w-72 overflow-hidden animate-fade-in z-[9999] ${
            isLight
              ? 'rounded-[12px] border border-[var(--border-subtle)] shadow-xl'
              : 'rounded-xl border shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.06)]'
          }`}
          style={{
            backgroundColor: isLight ? 'var(--surface)' : '#0A0F1D',
            borderColor: isLight ? 'var(--border-subtle)' : (isAdmin ? 'rgba(245, 158, 11, 0.35)' : 'rgba(56, 189, 248, 0.3)')
          }}
        >
          {/* Top glowing accent strip */}
          <div
            className={`h-[2px] w-full ${
              isLight
                ? 'bg-gradient-to-r from-[var(--accent)] via-[var(--accent-hover)] to-[var(--accent)]'
                : isAdmin
                ? 'bg-gradient-to-r from-amber-500 via-amber-300 to-yellow-500'
                : 'bg-gradient-to-r from-sky-500 via-cyan-400 to-indigo-500'
            }`}
          />

          {/* Profile Header Details */}
          <div className={`p-3.5 pb-3 border-b ${isLight ? 'bg-[var(--bg-sunken)] border-[var(--border-subtle)]' : 'bg-[#0c1324] border-slate-800/80'}`}>
            <div className="flex items-start gap-3">
              {/* Avatar Icon */}
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                  isLight
                    ? (isAdmin ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-[var(--accent-soft)] border-[var(--accent)]/30 text-[var(--accent-text)]')
                    : isAdmin
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                    : 'bg-sky-500/15 border-sky-500/30 text-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.2)]'
                }`}
              >
                <ShieldCheck size={18} />
              </div>

              {/* Identity & Email */}
              <div className="flex-1 min-w-0">
                <div className={`text-xs font-bold tracking-wide truncate ${isLight ? 'text-[var(--text-primary)] font-serif' : 'text-white'}`}>
                  {displayName}
                </div>
                <div className={`text-[10.5px] font-mono truncate mt-0.5 ${isLight ? 'text-[var(--text-tertiary)]' : 'text-slate-400'}`}>
                  {user.email}
                </div>

                {/* Status Dot + Clearance */}
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_#34d399] animate-pulse" />
                  <span className={`text-[9.5px] uppercase font-bold tracking-wider ${isLight ? 'text-[var(--text-tertiary)]' : 'text-slate-400'}`}>
                    STATUS:
                  </span>
                  <span
                    className={`text-[9.5px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                      isLight
                        ? (isAdmin ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-[var(--accent-soft)] text-[var(--accent-text)] border border-[var(--accent)]/30')
                        : isAdmin
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
            <div className={`mx-3 my-2.5 px-2.5 py-1.5 rounded-md border flex items-center justify-between text-[10.5px] ${
              isLight ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-amber-500/10 border-amber-500/25'
            }`}>
              <span className={`${isLight ? 'text-amber-800' : 'text-amber-300'} font-semibold flex items-center gap-1.5`}>
                <Sparkles size={12} className={isLight ? 'text-amber-600' : 'text-amber-400'} />
                ADMINISTRATIVE PRIVILEGES
              </span>
              <span className={`text-[9px] px-1 py-0.2 rounded font-mono font-bold ${
                isLight ? 'bg-amber-200/60 text-amber-900 border border-amber-300' : 'bg-amber-400/20 text-amber-200 border border-amber-400/30'
              }`}>
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
              className={`w-full px-3 py-2 rounded-md text-left text-xs flex items-center justify-between transition-colors cursor-pointer group ${
                isLight ? 'text-[var(--text-secondary)] hover:text-rose-600 hover:bg-rose-50' : 'text-slate-300 hover:text-rose-400 hover:bg-rose-500/10'
              }`}
            >
              <span className="font-semibold tracking-wider text-[11px]">
                SIGN OUT
              </span>
              <LogOut size={13} className={`transition-colors ${isLight ? 'text-stone-400 group-hover:text-rose-600' : 'text-slate-500 group-hover:text-rose-400'}`} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
