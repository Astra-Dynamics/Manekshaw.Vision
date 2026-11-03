export interface VercelRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  query: Record<string, string | string[] | undefined>;
  body?: any;
  cookies?: Record<string, string>;
}

export interface VercelResponse {
  status(code: number): VercelResponse;
  json(body: any): VercelResponse;
  setHeader(name: string, value: string | number | readonly string[]): VercelResponse;
  redirect(statusCode: number, url: string): VercelResponse;
  redirect(url: string): VercelResponse;
  end(chunk?: any): VercelResponse;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const query = req.query || {};
  const code = typeof query.code === 'string' ? query.code : undefined;
  const tokenHash = typeof query.token_hash === 'string' ? query.token_hash : undefined;
  const type = typeof query.type === 'string' ? query.type : undefined;
  const next = typeof query.next === 'string' ? query.next : '/Dashboard';

  const error = typeof query.error === 'string' ? query.error : undefined;
  const errorCode = typeof query.error_code === 'string' ? query.error_code : undefined;
  const errorDescription = typeof query.error_description === 'string' ? query.error_description : undefined;

  // If error passed from Supabase, redirect to client error handler
  if (error || errorCode) {
    const errorParams = new URLSearchParams();
    if (error) errorParams.set('error', error);
    if (errorCode) errorParams.set('error_code', errorCode);
    if (errorDescription) errorParams.set('error_description', errorDescription);
    return res.redirect(302, `/auth/error?${errorParams.toString()}`);
  }

  // Redirect to client-side callback with parameters preserved so browser PKCE storage can complete exchange
  const clientParams = new URLSearchParams();
  if (code) clientParams.set('code', code);
  if (tokenHash) clientParams.set('token_hash', tokenHash);
  if (type) clientParams.set('type', type);
  if (next) clientParams.set('next', next);

  return res.redirect(302, `/auth/callback?${clientParams.toString()}`);
}
