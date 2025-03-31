import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { QueryProvider } from "@/providers/query-provider";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import { YouTubePlayer } from "@/components/features/youtube/youtube-player";
import { Providers } from "./providers";
import { ResponsiveProvider } from "@/components/providers/responsive-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AudioGPraph | Music Analytics Platform",
  description: "Discover music trends and artist analytics with AudioGPraph",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          geistSans.variable,
          geistMono.variable,
          inter.className
        )}
      >
        <Providers>
          <QueryProvider dehydratedState={dehydrate(queryClient)}>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <ResponsiveProvider>
                {children}
                <Toaster />
                <YouTubePlayer />
              </ResponsiveProvider>
            </ThemeProvider>
          </QueryProvider>
        </Providers>
      </body>
    </html>
  );
}
