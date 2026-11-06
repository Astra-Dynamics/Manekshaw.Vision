import React, { useState, useMemo, useEffect } from 'react';
import {
  Radar,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  ChevronRight,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  PasswordRequirements,
  getPasswordConditions
} from './PasswordRequirements';

interface AuthPageProps {
  onNavigateHome: () => void;
  onNavigateDashboard: () => void;
  initialMode?: 'signin' | 'signup' | 'forgot';
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onNavigateHome,
  onNavigateDashboard,
  initialMode = 'signin'
}) => {
  const { signIn, signUp, signInWithGoogle, resetPassword, isConfigured } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isSignUp = mode === 'signup';
  const conditions = useMemo(
    () => getPasswordConditions(password, fullName, isSignUp),
    [password, fullName, isSignUp]
  );
  const allConditionsMet = conditions.every((c) => c.satisfied);
  const [shakeActive, setShakeActive] = useState(false);

  const triggerShake = () => {
    setShakeActive(false);
    requestAnimationFrame(() => {
      setShakeActive(true);
    });
  };

  useEffect(() => {
    if (shakeActive) {
      const timer = setTimeout(() => setShakeActive(false), 400);
      return () => clearTimeout(timer);
    }
  }, [shakeActive]);

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setGoogleLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setErrorMsg(error.message || 'Google authentication could not be initiated.');
        setGoogleLoading(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Google authentication failed.');
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setErrorMsg('Enter an email address');
      return;
    }

    if (mode === 'forgot') {
      setLoading(true);
      try {
        const { error } = await resetPassword(email.trim());
        if (error) {
          setErrorMsg(error.message || 'Could not send reset link. Try again.');
        } else {
          setSuccessMsg('A password reset link has been sent to your email.');
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'An error occurred.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!password.trim()) {
      setErrorMsg('Enter a password');
      triggerShake();
      return;
    }

    // Password guidelines only enforced on signup
    if (mode === 'signup' && !allConditionsMet) {
      setErrorMsg('Please satisfy all password conditions before proceeding.');
      triggerShake();
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email.trim(), password);
        if (error) {
          setErrorMsg(error.message || 'Incorrect email or password');
        } else {
          setSuccessMsg('Signed in successfully');
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
            setSuccessMsg('Account created. Check your email to confirm your account.');
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

  return (
    <div className="min-h-screen w-full bg-[#06090e] text-slate-100 flex flex-col justify-between selection:bg-sky-500 selection:text-slate-950 font-sans">
      {/* Top Bar with back link */}
      <header className="w-full px-6 py-4 flex items-center justify-between">
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

      {/* Main Centered Sign-in Card (Google style layout) */}
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
                  to continue to Manekshaw.Vision
                </p>
              </>
            )}

            {mode === 'signup' && (
              <>
                <h1 className="text-2xl font-semibold text-white tracking-tight mb-2">
                  Create an account
                </h1>
                <p className="text-sm text-slate-400">
                  Enter your details to get started
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
          </div>

          {/* Alert Messages */}
          {errorMsg && (
            <div className="mb-5 flex items-start gap-2.5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs leading-relaxed animate-fade-in">
              <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 flex items-start gap-2.5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs leading-relaxed animate-fade-in">
              <CheckCircle2 size={15} className="shrink-0 mt-0.5 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Google Sign-in */}
          {mode !== 'forgot' && (
            <div className="mb-6">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading || googleLoading}
                className="w-full py-2.5 px-4 bg-[#080d16] hover:bg-[#121927] border border-slate-700/80 hover:border-slate-600 rounded-lg text-slate-200 hover:text-white font-medium text-sm flex items-center justify-center gap-3 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
              </button>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase font-mono tracking-wider">
                  <span className="bg-[#0c121e] px-3 text-slate-500">Or continue with email</span>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Operator"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#080d16] border border-slate-700/80 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-lg outline-none text-slate-100 placeholder-slate-500 transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                autoFocus={mode !== 'signup'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 text-sm bg-[#080d16] border border-slate-700/80 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-lg outline-none text-slate-100 placeholder-slate-500 transition-colors"
              />
            </div>

            {mode !== 'forgot' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-3.5 pr-10 py-2.5 text-sm bg-[#080d16] border border-slate-700/80 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-lg outline-none text-slate-100 placeholder-slate-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer p-1"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Password guidelines ONLY visible during sign up */}
                {mode === 'signup' && (
                  <PasswordRequirements
                    conditions={conditions}
                    shakeActive={shakeActive}
                  />
                )}

                {mode === 'signin' && (
                  <div className="mt-2 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setErrorMsg(null);
                        setSuccessMsg(null);
                      }}
                      className="text-xs text-sky-400 hover:text-sky-300 transition-colors cursor-pointer font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Action Row */}
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
                    className="text-sm font-medium text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
                  >
                    Create account
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-semibold text-sm rounded-lg transition-all shadow-md cursor-pointer flex items-center gap-2"
                  >
                    {loading ? (
                      <Radar size={16} className="animate-spin text-slate-950" />
                    ) : (
                      'Sign in'
                    )}
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
                    className="text-sm font-medium text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
                  >
                    Sign in instead
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-semibold text-sm rounded-lg transition-all shadow-md cursor-pointer flex items-center gap-2"
                  >
                    {loading ? (
                      <Radar size={16} className="animate-spin text-slate-950" />
                    ) : (
                      'Next'
                    )}
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
                    className="text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    Back to sign in
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-semibold text-sm rounded-lg transition-all shadow-md cursor-pointer flex items-center gap-2"
                  >
                    {loading ? (
                      <Radar size={16} className="animate-spin text-slate-950" />
                    ) : (
                      'Send link'
                    )}
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-8 py-5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-3">
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
          <span className="text-slate-500">Secure Authentication</span>
        </div>
      </footer>
    </div>
  );
};
