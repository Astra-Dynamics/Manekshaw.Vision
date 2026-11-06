import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../services/supabaseClient';

export const GOOGLE_CLIENT_ID =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GOOGLE_CLIENT_ID) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.NEXT_PUBLIC_GOOGLE_CLIENT_ID) ||
  (typeof process !== 'undefined' && (process.env.VITE_GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)) ||
  '827222688967-v4l1pf6hv89fts7hgp3bdck7hnhcn3a2.apps.googleusercontent.com';

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  onError?: (message: string) => void;
  className?: string;
  fallbackSignIn?: () => Promise<{ error: Error | null }>;
}

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: any) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
          prompt: (notification?: (notification: any) => void) => void;
        };
      };
    };
  }
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onSuccess,
  onError,
  className = '',
  fallbackSignIn
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gsiLoaded, setGsiLoaded] = useState(false);
  const [fallbackLoading, setFallbackLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initGsi = () => {
      if (!window.google?.accounts?.id || !containerRef.current) return;

      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response: { credential?: string }) => {
            if (!response?.credential) {
              onError?.('No credential returned by Google.');
              return;
            }

            try {
              const { error } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: response.credential,
              });

              if (error) {
                onError?.(error.message || 'Authentication with Supabase failed.');
              } else {
                onSuccess?.();
              }
            } catch (err: any) {
              onError?.(err?.message || 'Authentication error.');
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Clear existing children
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(containerRef.current, {
            type: 'standard',
            theme: 'filled_black',
            size: 'large',
            text: 'continue_with',
            shape: 'rectangular',
            logo_alignment: 'left',
            width: containerRef.current.clientWidth || 360,
          });
        }

        if (isMounted) {
          setGsiLoaded(true);
        }
      } catch (e) {
        console.warn('[Google GSI] initialization fallback:', e);
      }
    };

    if (window.google?.accounts?.id) {
      initGsi();
      return;
    }

    // Check if script already exists
    const existingScript = document.getElementById('google-gsi-client');
    if (existingScript) {
      existingScript.addEventListener('load', initGsi);
      return () => {
        isMounted = false;
        existingScript.removeEventListener('load', initGsi);
      };
    }

    // Inject Google Identity Services script
    const script = document.createElement('script');
    script.id = 'google-gsi-client';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (isMounted) initGsi();
    };
    script.onerror = () => {
      console.warn('[Google GSI] Failed to load GSI script, using fallback button.');
    };
    document.head.appendChild(script);

    return () => {
      isMounted = false;
    };
  }, [onSuccess, onError]);

  const handleCustomFallback = async () => {
    if (!fallbackSignIn) return;
    setFallbackLoading(true);
    try {
      const { error } = await fallbackSignIn();
      if (error) onError?.(error.message);
    } catch (e: any) {
      onError?.(e.message || 'Google sign in failed');
    } finally {
      setFallbackLoading(false);
    }
  };

  return (
    <div className={`w-full flex flex-col items-center justify-center ${className}`}>
      {/* Container for native Google Identity Services button (runs on manvis.tech) */}
      <div
        ref={containerRef}
        className="w-full flex justify-center min-h-[44px]"
        style={{ display: gsiLoaded ? 'flex' : 'none' }}
      />

      {/* Fallback branded button if GSI is still loading or blocked */}
      {!gsiLoaded && (
        <button
          type="button"
          onClick={handleCustomFallback}
          disabled={fallbackLoading}
          className="w-full py-2.5 px-4 bg-[#080d16] hover:bg-[#121927] border border-slate-700/80 hover:border-slate-600 rounded text-slate-200 hover:text-white font-medium text-xs flex items-center justify-center gap-2.5 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
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
          <span>{fallbackLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
        </button>
      )}
    </div>
  );
};
