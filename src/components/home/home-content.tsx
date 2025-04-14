import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function HomeContent() {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <main className="flex-1 w-full">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32 relative overflow-hidden w-full">
          {/* Background Video - Bleeding left and right */}
          <div className="absolute inset-0 w-screen h-full z-0 left-1/2 -translate-x-1/2">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-30"
            >
              <source
                src="/mp3/650353c69dde89c0fd6869c9_Nxt wav loop video 3-transcode.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Content overlay */}
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center relative z-10 mx-auto">
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
        <section className="space-y-6 py-8 md:py-12 lg:py-24 w-full">
          <div className="mx-auto grid max-w-[58rem] gap-4 md:grid-cols-3 place-items-center w-full">
            <div className="flex flex-col justify-between rounded-lg border p-6 hover:border-primary/50 transition-colors w-full">
              <div className="space-y-2">
                <div className="flex justify-center mb-4">
                  <Image
                    src="/images/svgs/loose-side-react.svg"
                    alt="Loose Side React"
                    width={120}
                    height={120}
                    className="text-primary"
                  />
                </div>
                <h3 className="font-bold">Artist Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Comprehensive performance metrics for artists across all major
                  platforms
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-between rounded-lg border p-6 hover:border-primary/50 transition-colors w-full">
              <div className="space-y-2">
                <div className="flex justify-center mb-4">
                  <Image
                    src="/images/svgs/trend-discovery.svg"
                    alt="Trend Discovery"
                    width={120}
                    height={120}
                    className="text-primary"
                  />
                </div>
                <h3 className="font-bold">Trend Discovery</h3>
                <p className="text-sm text-muted-foreground">
                  Identify emerging trends and patterns in the music industry
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-between rounded-lg border p-6 hover:border-primary/50 transition-colors w-full">
              <div className="space-y-2">
                <div className="flex justify-center mb-4">
                  <Image
                    src="/images/svgs/audience-insights.svg"
                    alt="Audience Insights"
                    width={120}
                    height={120}
                    className="text-primary"
                  />
                </div>
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
