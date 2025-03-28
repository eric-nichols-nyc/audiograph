// app/auth/callback/page.tsx
"use client";

import { Suspense } from "react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { handleAuthCallback } from "@/actions/auth/actions";

// Main page component that doesn't directly use useSearchParams
export default function AuthCallbackPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Suspense fallback={<LoadingSpinner />}>
        <CallbackHandler />
      </Suspense>
    </div>
  );
}

// Loading fallback component
function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="h-8 w-8 rounded-full border-4 border-t-blue-500 animate-spin"></div>
      <h2 className="text-xl font-semibold">Loading...</h2>
      <p className="text-gray-500">Please wait a moment.</p>
    </div>
  );
}

// Component that uses useSearchParams wrapped in Suspense
function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");

      if (code) {
        try {
          // Use the server action to exchange the code for a session
          await handleAuthCallback(code);

          // Get redirect path or default to dashboard
          const redirectTo = searchParams.get("redirectTo") || "/dashboard";
          router.push(redirectTo);
        } catch (error) {
          console.error("Error exchanging code for session:", error);
          router.push("/auth/signin?error=Authentication%20failed");
        }
      } else {
        // If no code is present, redirect to sign in
        router.push("/auth/signin");
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="h-8 w-8 rounded-full border-4 border-t-blue-500 animate-spin"></div>
      <h2 className="text-xl font-semibold">Authenticating...</h2>
      <p className="text-gray-500">Please wait while we sign you in.</p>
    </div>
  );
}
