'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AuthHeader() {
    const pathname = usePathname();
    const isSignIn = pathname.includes('/sign-in');
    const isSignUp = pathname.includes('/sign-up');

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">Authentication</h1>
            <div className="flex space-x-4">
                <Link 
                    href="/sign-in" 
                    className={`px-4 py-2 rounded-md ${
                        isSignIn 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                >
                    Sign In
                </Link>
                <Link 
                    href="/sign-up" 
                    className={`px-4 py-2 rounded-md ${
                        isSignUp 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                >
                    Sign Up
                </Link>
            </div>
        </div>
    );
}
