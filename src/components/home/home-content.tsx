import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HomeContent() {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32 bg-gradient-to-b from-background to-secondary/20">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <div className="flex flex-col items-center gap-2">
              <span className="text-6xl md:text-7xl lg:text-8xl animate-pulse">
                🎧
              </span>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent p-3">
                Music Analytics Reimagined
              </h1>
            </div>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Track artist performance, discover trends, and gain insights with
              our powerful music analytics platform
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/artists">
                <Button variant="outline" size="lg">
                  Explore Artists
                </Button>
              </Link>
            </div>
          </div>
        </section>
        <section className="container space-y-6 py-8 md:py-12 lg:py-24">
          <div className="mx-auto grid max-w-[58rem] gap-4 md:grid-cols-3">
            <div className="flex flex-col justify-between rounded-lg border p-6 hover:border-primary/50 transition-colors">
              <div className="space-y-2">
                <h3 className="font-bold">Artist Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Comprehensive performance metrics for artists across all major
                  platforms
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-between rounded-lg border p-6 hover:border-primary/50 transition-colors">
              <div className="space-y-2">
                <h3 className="font-bold">Trend Discovery</h3>
                <p className="text-sm text-muted-foreground">
                  Identify emerging trends and patterns in the music industry
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-between rounded-lg border p-6 hover:border-primary/50 transition-colors">
              <div className="space-y-2">
                <h3 className="font-bold">Audience Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Understand audience demographics and engagement across
                  platforms
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} AudioGPraph. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
