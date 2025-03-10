import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { QueryProvider } from "@/providers/query-provider";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AudioGPraph | Music Analytics Platform",
  description: "Discover music trends and artist analytics with AudioGPraph",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // Prefetch the user data on the server side (SSR) to avoid loading delays.
  const queryClient = new QueryClient();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider dehydratedState={dehydrate(queryClient)}>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
              {children}
              <Toaster />
            </ThemeProvider>
          </HydrationBoundary>
        </QueryProvider>
      </body>
    </html>
  );
}
