import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type CityType = 'ramadi' | 'fallujah' | 'hit' | 'haditha' | 'ana' | 'rawa' | 'qaim' | 'rutba';
export type AppRole = 'super_admin' | 'mosque_admin' | 'reciter';

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  mosque_name: string | null;
  city: CityType;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setRole(null);
      setError(null);
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchProfile = async () => {
      try {
        setError(null);
        setLoading(true);
        
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (profileError) {
          console.error('Profile fetch error:', profileError);
          throw profileError;
        }
        
        if (profileData && isMounted) {
          setProfile(profileData as Profile);
        }

        // Fetch role
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (roleError) {
          console.error('Role fetch error:', roleError);
          // Don't throw, role is optional
        }
        
        if (roleData && isMounted) {
          setRole(roleData.role as AppRole);
        }

        if (isMounted) {
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch profile'));
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const createProfile = async (data: {
    full_name: string;
    mosque_name?: string;
    city: CityType;
    phone?: string;
    role: AppRole;
  }) => {
    if (!user) return { error: new Error('Not authenticated') };

    // Upsert profile (update if exists, insert if not) - use id as the unique key
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        user_id: user.id,
        full_name: data.full_name,
        mosque_name: data.mosque_name || null,
        city: data.city,
        phone: data.phone || null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

    if (profileError) return { error: profileError };

    // Upsert role without relying on a unique constraint
    const { data: existingRole, error: existingRoleError } = await supabase
      .from('user_roles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingRoleError) return { error: existingRoleError };

    const { error: roleError } = existingRole
      ? await supabase
          .from('user_roles')
          .update({ role: data.role })
          .eq('user_id', user.id)
      : await supabase
          .from('user_roles')
          .insert({ user_id: user.id, role: data.role });

    if (roleError) return { error: roleError };

    // Refetch profile
    const { data: newProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (newProfile) {
      setProfile(newProfile as Profile);
      setRole(data.role);
    }

    return { error: null };
  };

  return {
    profile,
    role,
    loading,
    error,
    createProfile,
  };
}
