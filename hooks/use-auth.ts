// lib/hooks/use-auth.ts
'use client';

import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    // Get the current session
    const getSession = async () => {
      setLoading(true);
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error fetching session:', error);
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Optionally refresh the page data when auth state changes
        if (event === 'SIGNED_IN') {
          router.refresh();
        }
      }
    );

    // Cleanup function to remove the subscription when the component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  // Sign out function
  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.push('/auth/signin');
  };

  return {
    user,
    session,
    signOut,
    isLoading: loading,
    isAuthenticated: !!user,
  };
}

export default useAuth;