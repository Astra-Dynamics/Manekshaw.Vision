import { createServerClient, serializeCookieHeader } from '@supabase/ssr';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, token_hash, type, next = '/Dashboard', error, error_code, error_description } = req.query;

  // Handle incoming errors
  if (error || error_code) {
    const errorParams = new URLSearchParams();
    if (error) errorParams.set('error', String(error));
    if (error_code) errorParams.set('error_code', String(error_code));
    if (error_description) errorParams.set('error_description', String(error_description));
    return res.redirect(`/auth/error?${errorParams.toString()}`);
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

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return Object.keys(req.cookies || {}).map((name) => ({
          name,
          value: req.cookies[name] || '',
        }));
      },
      setAll(cookiesToSet) {
        res.setHeader(
          'Set-Cookie',
          cookiesToSet.map(({ name, value, options }) =>
            serializeCookieHeader(name, value, options)
          )
        );
      },
    },
  });

  // 1. PKCE Code Exchange
  if (code && typeof code === 'string') {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (!exchangeError) {
      return res.redirect(String(next));
    }

    console.error('[Pages Callback] Exchange failed:', exchangeError);
    return res.redirect(`/auth/error?error=${encodeURIComponent(exchangeError.message)}&error_code=${encodeURIComponent((exchangeError as any).code || 'exchange_failed')}`);
  }

  // 2. Token Hash Verification
  if (token_hash && type && typeof token_hash === 'string' && typeof type === 'string') {
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any,
    });

    if (!verifyError) {
      return res.redirect(String(next));
    }

    console.error('[Pages Callback] Token verify failed:', verifyError);
    return res.redirect(`/auth/error?error=${encodeURIComponent(verifyError.message)}&error_code=${encodeURIComponent((verifyError as any).code || 'token_invalid')}`);
  }

  return res.redirect('/auth/error?error=missing_code&error_code=missing_code');
}
