import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Mail,
  User as UserIcon,
  X,
  AlertCircle,
  CheckCircle2,
  Radar,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'signin'
}) => {
  const { signIn, signUp, isConfigured } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg('All authentication parameters are required.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Clearance passphrase must be at least 6 characters.');
      return;
    }

    if (!isConfigured) {
      setErrorMsg(
        'Supabase credentials pending configuration in .env.local. Please provide your Supabase anon API key.'
      );
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email.trim(), password);
        if (error) {
          setErrorMsg(error.message || 'Authentication failed. Check credentials.');
        } else {
          setSuccessMsg('Clearance authorized. Welcome, Operator.');
          setTimeout(() => {
            onClose();
          }, 900);
        }
      } else {
        if (!fullName.trim()) {
          setErrorMsg('Operator designation / full name is required for registration.');
          setLoading(false);
          return;
        }

        const { error, user } = await signUp(email.trim(), password, fullName.trim());
        if (error) {
          setErrorMsg(error.message || 'Registration rejected.');
        } else {
          if (user && !user.confirmed_at && user.identities?.length) {
            setSuccessMsg(
              'Operator registration received! If email confirmation is enabled, please verify your email.'
            );
          } else {
            setSuccessMsg('Operator dossier established. Clearance active.');
          }
          setTimeout(() => {
            onClose();
          }, 1400);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected telemetry error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-mono">
      {/* Tactical Container */}
      <div
        className="relative w-full max-w-md bg-[#0B101B] border border-sky-500/30 rounded-lg shadow-[0_0_35px_rgba(56,189,248,0.15)] overflow-hidden text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Strip */}
        <div className="h-1 bg-gradient-to-r from-sky-500 via-cyan-400 to-indigo-600 w-full" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-sky-500/20 bg-[#070b14]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-sky-500/10 border border-sky-500/30 text-sky-400">
              <Shield size={16} />
            </div>
            <div>
              <div className="text-xs font-bold tracking-wider text-sky-400 flex items-center gap-1.5">
                <span>MANEKSHAW.VISION</span>
                <span className="text-[10px] px-1 py-0.2 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40">
                  SECURE GATEWAY
                </span>
              </div>
              <div className="text-[10px] text-slate-400 tracking-tight">
                OPERATOR ACCESS & CLEARANCE MATRIX
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Mode Switch Tabs */}
        <div className="grid grid-cols-2 p-1.5 mx-5 mt-4 bg-slate-900/80 rounded border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`py-1.5 rounded transition-all font-bold tracking-wider flex items-center justify-center gap-1.5 ${
              mode === 'signin'
                ? 'bg-sky-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound size={13} />
            <span>SIGN IN</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`py-1.5 rounded transition-all font-bold tracking-wider flex items-center justify-center gap-1.5 ${
              mode === 'signup'
                ? 'bg-sky-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck size={13} />
            <span>REGISTER OPERATOR</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {errorMsg && (
            <div className="flex items-start gap-2 p-2.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] leading-relaxed animate-fade-in">
              <AlertCircle size={14} className="shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-start gap-2 p-2.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] leading-relaxed animate-fade-in">
              <CheckCircle2 size={14} className="shrink-0 mt-0.5 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {!isConfigured && (
            <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10.5px] leading-relaxed">
              <span className="font-bold">INITIALIZATION NOTICE:</span> Supabase API key is being linked. Paste your public anon key into <code className="text-amber-200 bg-amber-950/60 px-1 py-0.5 rounded">.env.local</code> to activate live authentication.
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-[10px] tracking-wider uppercase text-slate-400 mb-1">
                Operator Call Sign / Full Name
              </label>
              <div className="relative">
                <UserIcon
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Operator"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900/90 border border-slate-700 focus:border-sky-400 focus:ring-1 focus:ring-sky-400/50 rounded outline-none text-slate-100 placeholder-slate-500 transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] tracking-wider uppercase text-slate-400 mb-1">
              Classified Terminal Email
            </label>
            <div className="relative">
              <Mail
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@manvis.tech"
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900/90 border border-slate-700 focus:border-sky-400 focus:ring-1 focus:ring-sky-400/50 rounded outline-none text-slate-100 placeholder-slate-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] tracking-wider uppercase text-slate-400 mb-1">
              Clearance Passphrase
            </label>
            <div className="relative">
              <Lock
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-9 py-2 text-xs bg-slate-900/90 border border-slate-700 focus:border-sky-400 focus:ring-1 focus:ring-sky-400/50 rounded outline-none text-slate-100 placeholder-slate-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Role Access Information Box */}
          <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 text-[10px] space-y-1 text-slate-400">
            <div className="font-bold text-slate-300 flex items-center justify-between">
              <span>CLEARANCE PROTOCOL:</span>
              <span className="text-sky-400">ROLE-BASED ACCESS CONTROL</span>
            </div>
            <p>
              • <strong className="text-slate-300">Individual:</strong> Full access to live satellite feeds, hot zones, OSINT telemetry & dossiers.
            </p>
            <p>
              • <strong className="text-amber-400">Command Staff (Admin):</strong> System configuration & operator roster management. Admin role is granted via Command Staff authorization in database.
            </p>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)] flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            {loading ? (
              <>
                <Radar size={14} className="animate-spin text-slate-950" />
                <span>AUTHENTICATING TELEMETRY...</span>
              </>
            ) : mode === 'signin' ? (
              <>
                <span>VERIFY & ENTER TERMINAL</span>
                <ChevronRight size={14} />
              </>
            ) : (
              <>
                <span>ESTABLISH OPERATOR CLEARANCE</span>
                <ChevronRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="px-5 py-3 border-t border-slate-800/80 bg-[#070b14] flex items-center justify-between text-[9.5px] text-slate-500">
          <span>ENCRYPTION: AES-256 / SHA-256</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            RLS SHIELD ACTIVE
          </span>
        </div>
      </div>
    </div>
  );
};
