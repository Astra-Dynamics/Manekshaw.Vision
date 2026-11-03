import React, { useState, useEffect } from 'react';
import {
  Radar,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  KeyRound,
  Mail,
  RefreshCw,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthPageProps {
  onNavigateHome: () => void;
  onNavigateDashboard: () => void;
  initialMode?: 'signin' | 'signup' | 'forgot' | 'verify_otp';
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onNavigateHome,
  onNavigateDashboard,
  initialMode = 'signin'
}) => {
  const { signIn, signUp, resetPassword, verifyOtp, resendVerification, isConfigured } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot' | 'verify_otp'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Resend cooldown timer
  const [resendCooldown, setResendCooldown] = useState<number>(0);

  // Check URL hash for auth errors on mount
  useEffect(() => {
    const hash = window.location.hash.startsWith('#')
      ? window.location.hash.substring(1)
      : window.location.hash;
    const hashParams = new URLSearchParams(hash);
    const searchParams = new URLSearchParams(window.location.search);

    const err = hashParams.get('error') || searchParams.get('error');
    const errCode = hashParams.get('error_code') || searchParams.get('error_code');
    const rawDesc = hashParams.get('error_description') || searchParams.get('error_description');

    if (err || errCode) {
      const codeStr = (errCode || err || '').toLowerCase();
      if (codeStr === 'otp_expired') {
        setErrorMsg('The email verification link has expired. Verification links are single-use and time-sensitive. You can request a fresh link below or enter a 6-digit code.');
      } else if (codeStr === 'access_denied') {
        setErrorMsg('Access denied. The verification token may have already been used or expired.');
      } else if (rawDesc) {
        setErrorMsg(decodeURIComponent(rawDesc.replace(/\+/g, ' ')));
      } else {
        setErrorMsg('An authentication error occurred. Please verify your credentials or request a new link.');
      }
    }
  }, []);

  // Cooldown countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setErrorMsg('Enter an email address');
      return;
    }

    // 1. FORGOT PASSWORD MODE
    if (mode === 'forgot') {
      setLoading(true);
      try {
        const { error } = await resetPassword(email.trim());
        if (error) {
          setErrorMsg(error.message || 'Could not send reset link. Try again.');
        } else {
          setSuccessMsg('A password reset link has been dispatched to your email.');
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'An error occurred.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // 2. VERIFY 6-DIGIT OTP MODE
    if (mode === 'verify_otp') {
      if (!otpCode.trim() || otpCode.trim().length < 6) {
        setErrorMsg('Enter the 6-digit verification code sent to your email.');
        return;
      }

      setLoading(true);
      try {
        // Try signup confirmation first
        const { error, session } = await verifyOtp(email.trim(), otpCode.trim(), 'signup');
        if (error) {
          // Fallback to magiclink / recovery
          const retry = await verifyOtp(email.trim(), otpCode.trim(), 'magiclink');
          if (retry.error) {
            setErrorMsg(retry.error.message || 'Invalid or expired clearance code.');
            setLoading(false);
            return;
          }
        }

        setSuccessMsg('Clearance authorized! Launching tactical dashboard...');
        setTimeout(() => {
          onNavigateDashboard();
        }, 800);
      } catch (err: any) {
        setErrorMsg(err.message || 'Verification failed. Try again.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // 3. SIGN IN & SIGN UP MODES
    if (!password.trim()) {
      setErrorMsg('Enter a password');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email.trim(), password);
        if (error) {
          setErrorMsg(error.message || 'Incorrect email or password');
        } else {
          setSuccessMsg('Signed in successfully. Initializing console...');
          setTimeout(() => {
            onNavigateDashboard();
          }, 600);
        }
      } else {
        if (!fullName.trim()) {
          setErrorMsg('Enter your name');
          setLoading(false);
          return;
        }

        const { error, user } = await signUp(email.trim(), password, fullName.trim());
        if (error) {
          setErrorMsg(error.message || 'Could not create account');
        } else {
          if (user && !user.confirmed_at && user.identities?.length) {
            setSuccessMsg('Account registered! We sent a confirmation link & 6-digit code to your email.');
            // Smoothly offer 6-digit OTP entry immediately
            setMode('verify_otp');
            setResendCooldown(60);
          } else {
            setSuccessMsg('Account created successfully');
            setTimeout(() => {
              onNavigateDashboard();
            }, 800);
          }
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email.trim() || resendCooldown > 0) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const { error } = await resendVerification(email.trim(), 'signup');
      if (error) {
        setErrorMsg(error.message || 'Could not resend confirmation email.');
      } else {
        setSuccessMsg(`Fresh verification link and code sent to ${email.trim()}.`);
        setResendCooldown(60);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to dispatch verification email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#06090e] text-slate-100 flex flex-col justify-between selection:bg-sky-500 selection:text-slate-950 font-sans">
      {/* Top Bar with back link */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-white/[0.04]">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>BACK TO HOME</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateDashboard}
            className="text-xs font-mono text-slate-400 hover:text-sky-400 transition-colors"
          >
            VIEW DASHBOARD
          </button>
        </div>
      </header>

      {/* Main Centered Sign-in Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[440px] bg-[#0c121e] border border-slate-800/90 rounded-2xl p-8 sm:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          {/* Logo & Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shadow-xs">
                <Radar size={20} />
              </div>
              <div>
                <span className="font-mono font-bold text-sm tracking-wider text-white">
                  MANEKSHAW.VISION
                </span>
              </div>
            </div>

            {mode === 'signin' && (
              <>
                <h1 className="text-2xl font-semibold text-white tracking-tight mb-2">
                  Sign in
                </h1>
                <p className="text-sm text-slate-400">
                  to continue to Manekshaw.Vision command center
                </p>
              </>
            )}

            {mode === 'signup' && (
              <>
                <h1 className="text-2xl font-semibold text-white tracking-tight mb-2">
                  Create an account
                </h1>
                <p className="text-sm text-slate-400">
                  Enter your details to obtain sovereign access
                </p>
              </>
            )}

            {mode === 'forgot' && (
              <>
                <h1 className="text-2xl font-semibold text-white tracking-tight mb-2">
                  Account recovery
                </h1>
                <p className="text-sm text-slate-400">
                  Enter your email to receive a password reset link
                </p>
              </>
            )}

            {mode === 'verify_otp' && (
              <>
                <h1 className="text-2xl font-semibold text-white tracking-tight mb-2">
                  Verify Clearance Code
                </h1>
                <p className="text-sm text-slate-400">
                  Enter the 6-digit confirmation code dispatched to your email
                </p>
              </>
            )}
          </div>

          {/* Alert Messages */}
          {errorMsg && (
            <div className="mb-5 flex flex-col gap-2 p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs leading-relaxed animate-fade-in font-mono">
              <div className="flex items-start gap-2">
                <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
              {email.trim() && (
                <div className="pt-2 border-t border-rose-500/20 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleResendConfirmation}
                    disabled={loading || resendCooldown > 0}
                    className="text-[11px] text-sky-400 hover:text-sky-300 font-bold underline cursor-pointer disabled:opacity-50"
                  >
                    {resendCooldown > 0
                      ? `Resend available in ${resendCooldown}s`
                      : 'Resend confirmation email now'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('verify_otp');
                      setErrorMsg(null);
                    }}
                    className="text-[11px] text-slate-400 hover:text-white"
                  >
                    Use 6-digit code →
                  </button>
                </div>
              )}
            </div>
          )}

          {successMsg && (
            <div className="mb-5 flex items-start gap-2.5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs leading-relaxed animate-fade-in font-mono">
              <CheckCircle2 size={15} className="shrink-0 mt-0.5 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                  NAME
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Commander Rao"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#080d16] border border-slate-700/80 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-lg outline-none text-slate-100 placeholder-slate-500 font-mono transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                EMAIL
              </label>
              <input
                type="email"
                required
                autoFocus={mode !== 'signup' && mode !== 'verify_otp'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@manvis.tech"
                className="w-full px-3.5 py-2.5 text-sm bg-[#080d16] border border-slate-700/80 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-lg outline-none text-slate-100 placeholder-slate-500 font-mono transition-colors"
              />
            </div>

            {/* Standard Passphrase input */}
            {mode !== 'forgot' && mode !== 'verify_otp' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                  PASSWORD
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your passphrase"
                    className="w-full pl-3.5 pr-10 py-2.5 text-sm bg-[#080d16] border border-slate-700/80 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-lg outline-none text-slate-100 placeholder-slate-500 font-mono transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer p-1"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {mode === 'signin' && (
                  <div className="mt-2 flex items-center justify-between text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('verify_otp');
                        setErrorMsg(null);
                        setSuccessMsg(null);
                      }}
                      className="text-slate-400 hover:text-sky-300 transition-colors"
                    >
                      Have an OTP code?
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setErrorMsg(null);
                        setSuccessMsg(null);
                      }}
                      className="text-sky-400 hover:text-sky-300 transition-colors font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 6-Digit OTP verification mode input */}
            {mode === 'verify_otp' && (
              <div className="space-y-3 pt-1">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-mono font-medium text-slate-300">
                      6-DIGIT CODE
                    </label>
                    <button
                      type="button"
                      onClick={handleResendConfirmation}
                      disabled={loading || resendCooldown > 0}
                      className="text-[11px] font-mono text-sky-400 hover:text-sky-300 disabled:opacity-50"
                    >
                      {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : 'Resend Code'}
                    </button>
                  </div>

                  <input
                    type="text"
                    required
                    autoFocus
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full px-3.5 py-3 text-center tracking-[0.35em] text-lg bg-[#080d16] border border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-lg outline-none text-white font-mono font-bold transition-colors"
                  />
                </div>
                <p className="text-[11px] text-slate-500 font-mono">
                  You can also click the direct confirmation link inside the email.
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 flex items-center justify-between">
              {mode === 'signin' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-sm font-medium text-sky-400 hover:text-sky-300 transition-colors cursor-pointer font-mono"
                  >
                    Create account
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider rounded-lg transition-all shadow-md cursor-pointer flex items-center gap-2"
                  >
                    {loading ? <Radar size={15} className="animate-spin text-slate-950" /> : 'Sign in'}
                  </button>
                </>
              )}

              {mode === 'signup' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-sm font-medium text-sky-400 hover:text-sky-300 transition-colors cursor-pointer font-mono"
                  >
                    Sign in instead
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider rounded-lg transition-all shadow-md cursor-pointer flex items-center gap-2"
                  >
                    {loading ? <Radar size={15} className="animate-spin text-slate-950" /> : 'Register'}
                  </button>
                </>
              )}

              {mode === 'forgot' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer font-mono"
                  >
                    Back to sign in
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider rounded-lg transition-all shadow-md cursor-pointer flex items-center gap-2"
                  >
                    {loading ? <Radar size={15} className="animate-spin text-slate-950" /> : 'Send link'}
                  </button>
                </>
              )}

              {mode === 'verify_otp' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer font-mono"
                  >
                    Back to sign in
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider rounded-lg transition-all shadow-md cursor-pointer flex items-center gap-2"
                  >
                    {loading ? <Radar size={15} className="animate-spin text-slate-950" /> : 'Verify code'}
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-8 py-5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-3 border-t border-white/[0.04]">
        <div>
          <span>MANEKSHAW.VISION</span> • <span>ASTRA DYNAMICS</span>
        </div>
        <div className="flex items-center gap-6 text-slate-400">
          <button onClick={onNavigateHome} className="hover:text-slate-200 transition-colors cursor-pointer">
            Home
          </button>
          <button onClick={onNavigateDashboard} className="hover:text-slate-200 transition-colors cursor-pointer">
            Dashboard
          </button>
          <span className="text-slate-600">•</span>
          <span className="text-slate-500">Survey of India Compliant</span>
        </div>
      </footer>
    </div>
  );
};
