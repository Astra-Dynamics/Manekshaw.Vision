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
  ChevronRight,
  RefreshCw
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
  const { signIn, signUp, verifyOtp, resendVerification, isConfigured } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup' | 'verify_otp'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState<number>(0);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setErrorMsg('Operator email identifier is required.');
      return;
    }

    if (mode === 'verify_otp') {
      if (!otpCode.trim() || otpCode.trim().length < 6) {
        setErrorMsg('Enter the 6-digit verification code sent to your email.');
        return;
      }

      setLoading(true);
      try {
        const { error } = await verifyOtp(email.trim(), otpCode.trim(), 'signup');
        if (error) {
          const retry = await verifyOtp(email.trim(), otpCode.trim(), 'magiclink');
          if (retry.error) {
            setErrorMsg(retry.error.message || 'Invalid or expired clearance code.');
            setLoading(false);
            return;
          }
        }
        setSuccessMsg('Clearance authorized. Welcome, Operator.');
        setTimeout(() => {
          onClose();
        }, 900);
      } catch (err: any) {
        setErrorMsg(err.message || 'Verification failed.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!password.trim()) {
      setErrorMsg('Clearance passphrase is required.');
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
              'Registration received! Verification link & 6-digit code dispatched to your email.'
            );
            setMode('verify_otp');
            setResendCooldown(60);
          } else {
            setSuccessMsg('Operator dossier established. Clearance active.');
            setTimeout(() => {
              onClose();
            }, 1200);
          }
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected telemetry error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email.trim() || resendCooldown > 0) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const { error } = await resendVerification(email.trim(), 'signup');
      if (error) {
        setErrorMsg(error.message || 'Could not resend confirmation email.');
      } else {
        setSuccessMsg(`Fresh verification link & code dispatched to ${email.trim()}.`);
        setResendCooldown(60);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to dispatch confirmation email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-mono">
      {/* Tactical Container */}
      <div className="relative w-full max-w-md bg-[#080d16] border border-sky-500/30 rounded shadow-[0_0_50px_rgba(56,189,248,0.15)] overflow-hidden">
        {/* Top Header Strip */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-sky-500/20 text-xs">
          <div className="flex items-center gap-2 text-sky-400">
            <Shield size={14} className="animate-pulse" />
            <span className="font-bold tracking-widest uppercase">
              {mode === 'verify_otp'
                ? 'CLEARANCE TOKEN VERIFICATION'
                : mode === 'signin'
                ? 'OPERATOR CLEARANCE AUTHENTICATION'
                : 'NEW OPERATOR ENLISTMENT'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {/* Status Banners */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2.5">
              <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-400" />
              <div className="flex-1">
                <span className="leading-tight">{errorMsg}</span>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('verify_otp');
                      setErrorMsg(null);
                    }}
                    className="block mt-1.5 text-[11px] text-sky-400 hover:text-sky-300 font-bold underline"
                  >
                    Have a 6-digit confirmation code? Verify here →
                  </button>
                )}
              </div>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-start gap-2.5">
              <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
              <span className="leading-tight">{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {mode === 'signup' && (
              <div>
                <label className="block text-slate-400 mb-1 tracking-wider uppercase text-[10px]">
                  OPERATOR CODENAME / FULL NAME
                </label>
                <div className="relative">
                  <UserIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Lead Analyst Rao"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-800 rounded text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-slate-400 mb-1 tracking-wider uppercase text-[10px]">
                SECURE EMAIL ADDRESS
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@manvis.tech"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-800 rounded text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>
            </div>

            {mode !== 'verify_otp' && (
              <div>
                <label className="block text-slate-400 mb-1 tracking-wider uppercase text-[10px]">
                  CLEARANCE PASSPHRASE
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-9 pr-9 py-2 bg-slate-950/80 border border-slate-800 rounded text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'verify_otp' && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-400 tracking-wider uppercase text-[10px]">
                    6-DIGIT CLEARANCE CODE
                  </label>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={loading || resendCooldown > 0}
                    className="text-[10px] text-sky-400 hover:text-sky-300 disabled:opacity-50"
                  >
                    {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : 'Resend Code'}
                  </button>
                </div>

                <div className="relative">
                  <KeyRound size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    required
                    autoFocus
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full pl-9 pr-3 py-2.5 text-center tracking-[0.3em] font-bold text-base bg-slate-950/80 border border-slate-800 rounded text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Submit Action */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded flex items-center justify-center gap-2 tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)] disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <Radar size={14} className="animate-spin text-slate-950" />
              ) : (
                <ShieldCheck size={14} />
              )}
              <span>
                {loading
                  ? 'TRANSMITTING...'
                  : mode === 'signin'
                  ? 'AUTHENTICATE ACCESS'
                  : mode === 'signup'
                  ? 'REGISTER DOSSIER'
                  : 'VERIFY CLEARANCE CODE'}
              </span>
            </button>
          </form>

          {/* Toggle between Sign In, Sign Up, and OTP */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            {mode === 'signin' ? (
              <>
                <span>Unenlisted Operator?</span>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="text-sky-400 hover:text-sky-300 font-bold transition-colors cursor-pointer"
                >
                  Request Enlistment
                </button>
              </>
            ) : mode === 'signup' ? (
              <>
                <span>Already credentialed?</span>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="text-sky-400 hover:text-sky-300 font-bold transition-colors cursor-pointer"
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  ← Back to Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
                >
                  Create Account
                </button>
              </>
            )}
          </div>
        </div>

        {/* Bottom Decorative Status Line */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 text-[9px] text-slate-500 flex items-center justify-between uppercase tracking-widest">
          <span>SOI CARTOGRAPHIC BOUNDARIES ENFORCED</span>
          <span className="text-emerald-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> ONLINE
          </span>
        </div>
      </div>
    </div>
  );
};
