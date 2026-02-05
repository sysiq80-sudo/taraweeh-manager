import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type CityType = 'ramadi' | 'fallujah' | 'hit' | 'haditha' | 'ana' | 'rawa' | 'qaim' | 'rutba';
export type AppRole = 'admin' | 'reciter';

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

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setRole(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (profileData) {
        setProfile(profileData as Profile);
      }

      // Fetch role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (roleData) {
        setRole(roleData.role as AppRole);
      }

      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const createProfile = async (data: {
    full_name: string;
    mosque_name?: string;
    city: CityType;
    phone?: string;
    role: AppRole;
  }) => {
    if (!user) return { error: new Error('Not authenticated') };

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: user.id,
        full_name: data.full_name,
        mosque_name: data.mosque_name || null,
        city: data.city,
        phone: data.phone || null,
      });

    if (profileError) return { error: profileError };

    // Create role
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: user.id,
        role: data.role,
      });

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
    createProfile,
  };
}
