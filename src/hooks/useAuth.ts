import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const redirectUrl = `${window.location.origin}/auth`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            email_confirmed: false,
          }
        }
      });
      
      if (error) {
        console.error('SignUp error:', error);
      }
      
      return { error };
    } catch (err) {
      console.error('SignUp exception:', err);
      return { error: err instanceof Error ? err : new Error('Sign up failed') };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      if (!email || !password) {
        return { error: new Error('Email and password are required') };
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      
      if (error) {
        console.error('SignIn error:', error);
      }
      
      return { error };
    } catch (err) {
      console.error('SignIn exception:', err);
      return { error: err instanceof Error ? err : new Error('Sign in failed') };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('SignOut error:', error);
      }
      return { error };
    } catch (err) {
      console.error('SignOut exception:', err);
      return { error: err instanceof Error ? err : new Error('Sign out failed') };
    }
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };
}
