import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fahbbsdgurtwmfjhtxkh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseAnonKey !== 'your_supabase_anon_public_key_here' &&
  !supabaseAnonKey.includes('placeholder')
);

// Always export a valid client instance with a placeholder fallback if keys are not set yet
export const supabase = createClient(
  supabaseUrl,
  isSupabaseConfigured ? supabaseAnonKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder'
);

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'individual' | 'admin';
  created_at?: string;
  updated_at?: string;
}
