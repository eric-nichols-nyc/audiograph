'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export function AuthRedirect() {
  const { isAuthenticated, isLoading, user } = useAuth();


  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log('user auth ', user, isAuthenticated, isLoading)
    // Only redirect after authentication state is loaded and user is authenticated
    // Don't redirect if already on an admin page or auth page
    if (!isLoading && isAuthenticated && 
        !pathname.includes('/admin') &&
        !pathname.includes('/account') &&
        !pathname.startsWith('/sign-in') &&
        !pathname.startsWith('/sign-up') &&
        !pathname.startsWith('/callback')) {
      router.push('/admin/dashboard');
    }else if(!user || !isAuthenticated && !pathname.startsWith('/sign-in')){
        router.push('/sign-in');
    }
  }, [isLoading, isAuthenticated, router, pathname, user]);

  // This component doesn't render anything visible
  return null;
}
