import React, { useEffect, useState, useMemo } from 'react';
import {
  Radar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Mail,
  KeyRound,
  RefreshCw,
  Lock,
  Eye,
  EyeOff,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';

interface AuthCallbackProps {
  onNavigateHome: () => void;
  onNavigateDashboard: () => void;
  onNavigateLogin: () => void;
}

interface ParsedAuthParams {
  code: string | null;
  tokenHash: string | null;
  type: string | null;
  next: string;
  error: string | null;
  errorCode: string | null;
  errorDescription: string | null;
}

export const AuthCallback: React.FC<AuthCallbackProps> = ({
  onNavigateHome,
  onNavigateDashboard,
  onNavigateLogin
}) => {
  const { verifyOtp, resendVerification, updatePassword } = useAuth();

  const [status, setStatus] = useState<'processing' | 'success' | 'error' | 'recovery'>('processing');
  const [statusMessage, setStatusMessage] = useState<string>('Verifying authentication credentials...');
  const [errorDetails, setErrorDetails] = useState<{
    code: string;
    title: string;
    description: string;
  }>({
    code: 'UNKNOWN',
    title: 'Verification Failed',
    description: 'An unexpected authentication error occurred.'
  });

  // Resend Verification State
  const [resendEmail, setResendEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendFeedback, setResendFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Manual OTP input fallback
  const [showManualOtp, setShowManualOtp] = useState(false);
  const [manualOtp, setManualOtp] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpFeedback, setOtpFeedback] = useState<string | null>(null);

  // Password Recovery State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 1. Extract params from search query and hash fragments
  const parsedParams = useMemo<ParsedAuthParams>(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const hash = window.location.hash.startsWith('#')
      ? window.location.hash.substring(1)
      : window.location.hash;
    const hashParams = new URLSearchParams(hash);

    const code = searchParams.get('code') || hashParams.get('code');
    const tokenHash = searchParams.get('token_hash') || hashParams.get('token_hash');
    const type = searchParams.get('type') || hashParams.get('type');
    const next = searchParams.get('next') || hashParams.get('next') || '/Dashboard';

    // Errors can be in search (?error=...) or hash (#error=...)
    const error = hashParams.get('error') || searchParams.get('error');
    const errorCode = hashParams.get('error_code') || searchParams.get('error_code');
    const rawErrorDesc = hashParams.get('error_description') || searchParams.get('error_description');
    const errorDescription = rawErrorDesc ? decodeURIComponent(rawErrorDesc.replace(/\+/g, ' ')) : null;

    return {
      code,
      tokenHash,
      type,
      next,
      error,
      errorCode,
      errorDescription
    };
  }, []);

  // 2. Main Authentication Flow
  useEffect(() => {
    let isCancelled = false;

    const handleCallback = async () => {
      // A. Check for error parameters first
      if (parsedParams.error || parsedParams.errorCode) {
        const code = (parsedParams.errorCode || parsedParams.error || 'auth_error').toLowerCase();
        let title = 'Authentication Link Error';
        let desc = parsedParams.errorDescription || 'The authentication request could not be processed.';

        if (code === 'otp_expired') {
          title = 'Verification Link Expired';
          desc = 'This verification or confirmation link has expired. Verification links are single-use and time-sensitive for security.';
        } else if (code === 'access_denied') {
          title = 'Access Denied';
          desc = 'Access was denied. The verification token may have already been used, or the authorization session expired.';
        } else if (code === 'bad_code_verifier' || code === 'invalid_grant') {
          title = 'Invalid Verification Session';
          desc = 'The verification session code verifier does not match or was opened in an alternative browser. Please request a new confirmation email or enter your 6-digit code directly.';
        }

        setErrorDetails({ code: code.toUpperCase(), title, description: desc });
        setStatus('error');
        return;
      }

      // B. Password Recovery Flow
      if (parsedParams.type === 'recovery') {
        // If code present, exchange it first
        if (parsedParams.code) {
          try {
            const { error: exchangeErr } = await supabase.auth.exchangeCodeForSession(parsedParams.code);
            if (exchangeErr) {
              console.warn('[AuthCallback] Exchange code error during recovery:', exchangeErr);
            }
          } catch (e) {
            console.error('[AuthCallback] Error in recovery exchange:', e);
          }
        }
        setStatus('recovery');
        return;
      }

      // C. PKCE Flow: exchange code for active session
      if (parsedParams.code) {
        setStatusMessage('Exchanging clearance authorization code...');
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(parsedParams.code);
          if (isCancelled) return;

          if (error) {
            console.error('[AuthCallback] exchangeCodeForSession failed:', error);
            const errCode = (error as any).code || 'EXCHANGE_FAILED';
            setErrorDetails({
              code: errCode.toUpperCase(),
              title: 'Verification Exchange Failed',
              description: error.message || 'Could not exchange the verification code for an active session.'
            });
            setStatus('error');
            return;
          }

          if (data?.session) {
            setStatus('success');
            setStatusMessage('Authorization verified. Launching operational command console...');
            setTimeout(() => {
              if (parsedParams.next.toLowerCase() === '/dashboard' || parsedParams.next === '/') {
                onNavigateDashboard();
              } else {
                window.location.href = parsedParams.next;
              }
            }, 1000);
            return;
          }
        } catch (err: any) {
          if (isCancelled) return;
          console.error('[AuthCallback] Unexpected error in code exchange:', err);
          setErrorDetails({
            code: 'EXCHANGE_EXCEPTION',
            title: 'Authorization Exchange Error',
            description: err.message || 'An unexpected error occurred while communicating with the authentication authority.'
          });
          setStatus('error');
          return;
        }
      }

      // D. Token Hash Verification (Email Confirmation Link)
      if (parsedParams.tokenHash) {
        setStatusMessage('Validating sovereign verification token...');
        try {
          const otpType = (parsedParams.type as any) || 'signup';
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: parsedParams.tokenHash,
            type: otpType
          });
          if (isCancelled) return;

          if (error) {
            setErrorDetails({
              code: (error as any).code || 'TOKEN_INVALID',
              title: 'Verification Token Invalid',
              description: error.message || 'The token hash could not be verified or has already expired.'
            });
            setStatus('error');
            return;
          }

          if (data?.session || data?.user) {
            setStatus('success');
            setStatusMessage('Email confirmation verified. Clearance confirmed.');
            setTimeout(() => {
              onNavigateDashboard();
            }, 1000);
            return;
          }
        } catch (err: any) {
          if (isCancelled) return;
          setErrorDetails({
            code: 'TOKEN_EXCEPTION',
            title: 'Token Verification Failed',
            description: err.message || 'Failed to process email token verification.'
          });
          setStatus('error');
          return;
        }
      }

      // E. Check for existing active session (Implicit Hash or already logged in)
      const { data: { session } } = await supabase.auth.getSession();
      if (isCancelled) return;

      if (session) {
        setStatus('success');
        setStatusMessage('Active sovereign clearance detected. Redirecting to dashboard...');
        setTimeout(() => {
          onNavigateDashboard();
        }, 800);
        return;
      }

      // F. No parameters and no active session -> Redirect to Sign In
      setTimeout(() => {
        if (!isCancelled) {
          onNavigateLogin();
        }
      }, 1200);
    };

    handleCallback();

    return () => {
      isCancelled = true;
    };
  }, [parsedParams, onNavigateDashboard, onNavigateLogin]);

  // Handle Resend Verification Email
  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail.trim()) {
      setResendFeedback({ type: 'error', text: 'Enter your account email address.' });
      return;
    }

    setIsResending(true);
    setResendFeedback(null);

    try {
      const { error } = await resendVerification(resendEmail.trim(), 'signup');
      if (error) {
        setResendFeedback({
          type: 'error',
          text: error.message || 'Could not resend confirmation. Please verify email address or try again shortly.'
        });
      } else {
        setResendFeedback({
          type: 'success',
          text: `A fresh confirmation link and 6-digit code has been dispatched to ${resendEmail.trim()}. Check your inbox.`
        });
      }
    } catch (err: any) {
      setResendFeedback({
        type: 'error',
        text: err.message || 'Failed to request confirmation email.'
      });
    } finally {
      setIsResending(false);
    }
  };

  // Handle Manual 6-Digit OTP Verification
  const handleVerifyManualOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail.trim()) {
      setOtpFeedback('Please enter your account email address above.');
      return;
    }
    if (!manualOtp.trim() || manualOtp.trim().length < 6) {
      setOtpFeedback('Enter the full 6-digit verification code.');
      return;
    }

    setIsVerifyingOtp(true);
    setOtpFeedback(null);

    try {
      const { error, session } = await verifyOtp(resendEmail.trim(), manualOtp.trim(), 'signup');
      if (error) {
        // Try magiclink type as fallback
        const retry = await verifyOtp(resendEmail.trim(), manualOtp.trim(), 'magiclink');
        if (retry.error) {
          setOtpFeedback(retry.error.message || 'Invalid or expired 6-digit clearance code.');
          return;
        }
      }

      setStatus('success');
      setStatusMessage('Clearance code verified! Initializing command console...');
      setTimeout(() => {
        onNavigateDashboard();
      }, 900);
    } catch (err: any) {
      setOtpFeedback(err.message || 'Verification failed. Try again.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Handle Password Update (Recovery Mode)
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPasswordFeedback({ type: 'error', text: 'Passphrase must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ type: 'error', text: 'Passphrases do not match.' });
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordFeedback(null);

    try {
      const { error } = await updatePassword(newPassword);
      if (error) {
        setPasswordFeedback({ type: 'error', text: error.message || 'Failed to update passphrase.' });
      } else {
        setPasswordFeedback({
          type: 'success',
          text: 'Passphrase updated successfully! Access granted.'
        });
        setTimeout(() => {
          onNavigateDashboard();
        }, 1200);
      }
    } catch (err: any) {
      setPasswordFeedback({ type: 'error', text: err.message || 'An unexpected error occurred.' });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#06090e] text-slate-100 flex flex-col justify-between selection:bg-sky-500 selection:text-slate-950 font-sans">
      {/* Top Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-white/[0.06]">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>HOME</span>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Radar size={15} />
          </div>
          <span className="font-mono font-bold text-xs tracking-wider text-white">
            MANEKSHAW.VISION // AUTH
          </span>
        </div>

        <button
          onClick={onNavigateLogin}
          className="text-xs font-mono text-slate-400 hover:text-sky-400 transition-colors"
        >
          SIGN IN
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[480px] bg-[#0c121e] border border-slate-800/90 rounded-2xl p-8 sm:p-10 shadow-[0_16px_40px_rgba(0,0,0,0.6)]">
          {/* 1. PROCESSING STATE */}
          {status === 'processing' && (
            <div className="text-center py-8 space-y-5 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.2)]">
                <Radar size={32} className="animate-spin text-sky-400" style={{ animationDuration: '4s' }} />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold tracking-tight text-white font-mono">
                  AUTHENTICATING
                </h2>
                <p className="text-sm text-slate-400 font-mono">
                  {statusMessage}
                </p>
              </div>
              <div className="w-48 h-1 bg-slate-800 mx-auto rounded-full overflow-hidden">
                <div className="w-full h-full bg-sky-500 animate-pulse" />
              </div>
            </div>
          )}

          {/* 2. SUCCESS STATE */}
          {status === 'success' && (
            <div className="text-center py-8 space-y-5 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.25)]">
                <ShieldCheck size={36} />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold tracking-tight text-white font-mono">
                  CLEARANCE VERIFIED
                </h2>
                <p className="text-sm text-slate-300 font-mono">
                  {statusMessage}
                </p>
              </div>
              <button
                onClick={onNavigateDashboard}
                className="w-full py-3 px-4 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(56,189,248,0.3)] cursor-pointer"
              >
                <span>ENTER DASHBOARD</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* 3. PASSWORD RECOVERY STATE */}
          {status === 'recovery' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-semibold mb-2">
                  <KeyRound size={15} />
                  <span>CREDENTIAL RESET RECOVERY</span>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Set New Passphrase
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Enter your updated security clearance credentials below.
                </p>
              </div>

              {passwordFeedback && (
                <div
                  className={`p-3 rounded-lg text-xs font-mono leading-relaxed border ${
                    passwordFeedback.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  }`}
                >
                  {passwordFeedback.text}
                </div>
              )}

              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                    New Passphrase
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      required
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#080d16] border border-slate-700/80 text-white font-mono text-sm placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                    Confirm Passphrase
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat passphrase"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#080d16] border border-slate-700/80 text-white font-mono text-sm placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="w-full py-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(56,189,248,0.3)] disabled:opacity-60 cursor-pointer"
                >
                  {isUpdatingPassword ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <Lock size={14} />
                  )}
                  <span>{isUpdatingPassword ? 'UPDATING...' : 'UPDATE PASSPHRASE'}</span>
                </button>
              </form>
            </div>
          )}

          {/* 4. ERROR STATE */}
          {status === 'error' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-start gap-3.5 pb-4 border-b border-slate-800">
                <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                  <ShieldAlert size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase">
                      {errorDetails.code}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white tracking-tight mt-1">
                    {errorDetails.title}
                  </h2>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1 font-mono">
                    {errorDetails.description}
                  </p>
                </div>
              </div>

              {/* Resend Verification Form */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-semibold text-slate-300 uppercase tracking-wider">
                    REQUEST FRESH VERIFICATION DISPATCH
                  </span>
                </div>

                {resendFeedback && (
                  <div
                    className={`p-3 rounded-lg text-xs font-mono leading-relaxed border ${
                      resendFeedback.type === 'success'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    }`}
                  >
                    {resendFeedback.text}
                  </div>
                )}

                <form onSubmit={handleResend} className="space-y-2.5">
                  <div className="relative">
                    <input
                      type="email"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      placeholder="operator@manvis.tech"
                      required
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#080d16] border border-slate-700/80 text-white font-mono text-sm placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isResending}
                    className="w-full py-2.5 px-4 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(56,189,248,0.25)] disabled:opacity-60 cursor-pointer"
                  >
                    {isResending ? (
                      <RefreshCw size={13} className="animate-spin" />
                    ) : (
                      <Mail size={13} />
                    )}
                    <span>{isResending ? 'DISPATCHING...' : 'RESEND VERIFICATION EMAIL'}</span>
                  </button>
                </form>
              </div>

              {/* Direct 6-digit OTP code fallback */}
              <div className="pt-2 border-t border-slate-800/80">
                {!showManualOtp ? (
                  <button
                    type="button"
                    onClick={() => setShowManualOtp(true)}
                    className="w-full py-2 text-xs font-mono text-sky-400 hover:text-sky-300 text-center transition-colors flex items-center justify-center gap-1.5"
                  >
                    <KeyRound size={13} />
                    <span>Have a 6-digit code? Enter code manually</span>
                  </button>
                ) : (
                  <form onSubmit={handleVerifyManualOtp} className="space-y-2.5 pt-2">
                    <span className="text-[11px] font-mono font-semibold text-slate-300 uppercase tracking-wider block">
                      ENTER 6-DIGIT VERIFICATION TOKEN
                    </span>

                    {otpFeedback && (
                      <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
                        {otpFeedback}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        value={manualOtp}
                        onChange={(e) => setManualOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="123456"
                        className="flex-1 px-3 py-2 text-center tracking-[0.3em] rounded-lg bg-[#080d16] border border-slate-700 text-white font-mono text-base font-bold focus:outline-none focus:border-sky-400"
                      />
                      <button
                        type="submit"
                        disabled={isVerifyingOtp}
                        className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-60"
                      >
                        {isVerifyingOtp ? '...' : 'VERIFY'}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Navigation Back links */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={onNavigateLogin}
                  className="text-xs font-mono text-slate-400 hover:text-white transition-colors"
                >
                  ← BACK TO SIGN IN
                </button>
                <button
                  type="button"
                  onClick={onNavigateHome}
                  className="text-xs font-mono text-slate-400 hover:text-sky-400 transition-colors"
                >
                  RETURN HOME →
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 py-4 text-center border-t border-white/[0.04]">
        <p className="text-[11px] font-mono text-slate-500">
          MANEKSHAW.VISION // SOVEREIGN CARTOGRAPHY & GEOINT // SURVEY OF INDIA COMPLIANT
        </p>
      </footer>
    </div>
  );
};
