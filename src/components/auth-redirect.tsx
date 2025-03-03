'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../hooks/use-auth';

export function AuthRedirect() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only redirect after authentication state is loaded and user is authenticated
    // Don't redirect if already on an admin page or auth page
    if (!isLoading && isAuthenticated && 
        !pathname.startsWith('/dashboard') && 
        !pathname.includes('/profile') && 
        !pathname.includes('/account') &&
        !pathname.startsWith('/sign-in') &&
        !pathname.startsWith('/sign-up') &&
        !pathname.startsWith('/callback')) {
      router.push('/dashboard');
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  // This component doesn't render anything visible
  return null;
}
