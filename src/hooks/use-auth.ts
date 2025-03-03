// lib/hooks/use-auth.ts
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createBrowserSupabase } from '@/lib/supabase/client';
import { getUser } from '@/lib/supabase/auth/client';
import {User} from '@/types/user'
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createBrowserSupabase();

  useEffect(() => {
    // Get the current session
   const fetchUser = async () => {
    const user = await getUser(); 
    setUser(user);
    setLoading(false);
   }

   fetchUser()
  }, []);

  // Sign out function
  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.push('/sign-in');
  };

  return {
    user,
    signOut,
    isLoading: loading,
    isAuthenticated: !!user,
  };
}

export default useAuth;