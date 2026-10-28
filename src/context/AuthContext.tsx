import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, UserProfile } from '../services/supabaseClient';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: 'individual' | 'admin' | null;
  isAdmin: boolean;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null; user: User | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  role: null,
  isAdmin: false,
  loading: true,
  isConfigured: false,
  signIn: async () => ({ error: new Error('Auth not configured') }),
  signUp: async () => ({ error: new Error('Auth not configured'), user: null }),
  resetPassword: async () => ({ error: new Error('Auth not configured') }),
  signOut: async () => {},
  refreshProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = useCallback(async (userId: string, email: string) => {
    if (!isSupabaseConfigured) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('[Auth] Failed to load profile:', error.message);
        // Fallback default profile if trigger hasn't completed or table is new
        setProfile({
          id: userId,
          email,
          full_name: '',
          role: 'individual'
        });
        return;
      }

      if (data) {
        setProfile(data as UserProfile);
      } else {
        // If not found yet, create default representation
        setProfile({
          id: userId,
          email,
          full_name: '',
          role: 'individual'
        });
      }
    } catch (err) {
      console.error('[Auth] Error fetching profile:', err);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id, user.email || '');
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // 1. Check initial active session
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser.id, currentUser.email || '').finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // 2. Listen to Auth State Changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (_event: string, session: Session | null) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser.id, currentUser.email || '');
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase is not configured yet. Please add your credentials to .env.local') };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase is not configured yet. Please add your credentials to .env.local'), user: null };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });
    return { error, user: data?.user ?? null };
  };

  const resetPassword = async (email: string) => {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase is not configured yet. Please add your credentials to .env.local') };
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`
    });
    return { error };
  };

  const signOut = async () => {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const role = profile?.role ?? null;
  const isAdmin = role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        isAdmin,
        loading,
        isConfigured: isSupabaseConfigured,
        signIn,
        signUp,
        resetPassword,
        signOut,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
