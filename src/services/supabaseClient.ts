import { createClient } from '@supabase/supabase-js';

// Resolve Supabase URL from Vite or Next.js public variables
const supabaseUrl =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  (typeof process !== 'undefined' && (process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL)) ||
  'https://fahbbsdgurtwmfjhtxkh.supabase.co';

// Resolve Supabase Anon Key from Vite or Next.js public variables
const supabaseAnonKey =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && (process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY)) ||
  '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseAnonKey !== 'your_supabase_anon_public_key_here' &&
  !supabaseAnonKey.includes('placeholder')
);

// Export robust client configured with PKCE flow and URL session detection
export const supabase = createClient(
  supabaseUrl,
  isSupabaseConfigured ? supabaseAnonKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  }
);

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'individual' | 'admin';
  created_at?: string;
  updated_at?: string;
}
