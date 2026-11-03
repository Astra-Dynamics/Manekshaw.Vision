import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const tokenHash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type');
  const next = requestUrl.searchParams.get('next') || '/Dashboard';

  const error = requestUrl.searchParams.get('error');
  const errorCode = requestUrl.searchParams.get('error_code');
  const errorDescription = requestUrl.searchParams.get('error_description');

  // Handle incoming errors from Supabase
  if (error || errorCode) {
    const errorUrl = new URL('/auth/error', requestUrl.origin);
    if (error) errorUrl.searchParams.set('error', error);
    if (errorCode) errorUrl.searchParams.set('error_code', errorCode);
    if (errorDescription) errorUrl.searchParams.set('error_description', errorDescription);
    return NextResponse.redirect(errorUrl);
  }

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    'https://fahbbsdgurtwmfjhtxkh.supabase.co';

  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    '';

  const response = NextResponse.redirect(new URL(next, requestUrl.origin));

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({ name, value, ...options });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.delete({ name, ...options });
        response.cookies.delete({ name, ...options });
      },
    },
  });

  // 1. PKCE Code Exchange
  if (code) {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (!exchangeError) {
      return response;
    }

    console.error('[Auth Callback] Code exchange failed:', exchangeError);
    const errorUrl = new URL('/auth/error', requestUrl.origin);
    errorUrl.searchParams.set('error', exchangeError.message);
    errorUrl.searchParams.set('error_code', (exchangeError as any).code || 'exchange_failed');
    return NextResponse.redirect(errorUrl);
  }

  // 2. Token Hash Email Verification
  if (tokenHash && type) {
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as any,
    });

    if (!verifyError) {
      return response;
    }

    console.error('[Auth Callback] Token hash verification failed:', verifyError);
    const errorUrl = new URL('/auth/error', requestUrl.origin);
    errorUrl.searchParams.set('error', verifyError.message);
    errorUrl.searchParams.set('error_code', (verifyError as any).code || 'token_invalid');
    return NextResponse.redirect(errorUrl);
  }

  // 3. Missing code or token
  const errorUrl = new URL('/auth/error', requestUrl.origin);
  errorUrl.searchParams.set('error', 'No verification code or token was provided in the callback URL.');
  errorUrl.searchParams.set('error_code', 'missing_code');
  return NextResponse.redirect(errorUrl);
}
