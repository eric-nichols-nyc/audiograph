"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ArtistSelect } from "./artist-select";
//import { FanbaseChart } from "./fanbase-charts";
import { useEffect, useRef, useState } from "react";
import { VideoContainer } from "./video-container";
import { SpotifyPerformance } from "./spotify-performance";
import { cn } from "@/lib/utils";
import { TopConnections } from "./top-connections";
import { HorizontalStackedChartGraphQL } from "./horizontal-stacked-chart-graphql";

export function CompareContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const stickyRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [firstArtistId, setFirstArtistId] = useState<string>();
  const [secondArtistId, setSecondArtistId] = useState<string>();
  const [isSticky, setIsSticky] = useState(false);

  // Initialize artist IDs from URL params
  useEffect(() => {
    const entity1 = searchParams.get("entity1");
    const entity2 = searchParams.get("entity2");
    console.log("URL Params Read:", { entity1, entity2 });
    if (entity1) setFirstArtistId(entity1);
    if (entity2) setSecondArtistId(entity2);
  }, [searchParams]);

  // Update URL when artist IDs change
  useEffect(() => {
    console.log("State Changed:", { firstArtistId, secondArtistId });
    const params = new URLSearchParams();
    if (firstArtistId) params.set("entity1", firstArtistId);
    if (secondArtistId) params.set("entity2", secondArtistId);
    const newUrl = `${pathname}?${params.toString()}`;
    console.log("Updating URL to:", newUrl);
    router.replace(newUrl);
  }, [firstArtistId, secondArtistId, pathname, router]);

  // Log when artist is selected
  const handleFirstArtistSelect = (artistSlug: string) => {
    console.log("First Artist Selected:", artistSlug);
    setFirstArtistId(artistSlug);
  };

  const handleSecondArtistSelect = (artistSlug: string) => {
    console.log("Second Artist Selected:", artistSlug);
    setSecondArtistId(artistSlug);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      { threshold: [1] }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative flex flex-col gap-6 border border-white/10 rounded-lg p-6 bg-card">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-lg pointer-events-none" />

      {/* Sentinel div to detect when sticky div hits the top */}
      <div ref={sentinelRef} className="absolute top-0 left-0 h-px w-full" />

      <div
        ref={stickyRef}
        className={cn(
          "flex gap-4 sticky top-[24px] z-10 transition-all duration-300",
          isSticky &&
            "bg-background/80 backdrop-blur-sm shadow-lg rounded-lg p-4"
        )}
      >
        <div className="flex-1">
          <ArtistSelect
            position={1}
            selectedId={firstArtistId}
            otherSelectedId={secondArtistId}
            onSelect={handleFirstArtistSelect}
            onClear={() => setFirstArtistId(undefined)}
            sticky={isSticky}
          />
        </div>
        <div className="flex-1">
          <ArtistSelect
            position={2}
            selectedId={secondArtistId}
            otherSelectedId={firstArtistId}
            onSelect={handleSecondArtistSelect}
            onClear={() => setSecondArtistId(undefined)}
            sticky={isSticky}
          />
        </div>
      </div>

      {firstArtistId && secondArtistId ? (
        <div className="relative space-y-8">
          <div className="rounded-lg overflow-hidden">
            <HorizontalStackedChartGraphQL />

            {/* <FanbaseChart /> */}
          </div>

          <section className="space-y-8">
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-1 bg-blue-500/30 rounded-full" />
                <h2 className="text-2xl font-semibold">
                  Most Viewed YouTube Video Alltime
                </h2>
              </div>
              <VideoContainer />
            </section>

            {/* Fanbase section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-1 bg-blue-500/30 rounded-full" />
                <h2 className="text-2xl font-semibold">Top Connections</h2>
              </div>
              <TopConnections />
            </section>

            {/* Size & Distribution section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-1 bg-blue-500/30 rounded-full" />
                <h2 className="text-2xl font-semibold">Spotify Performance</h2>
              </div>
              <div className="rounded-lg overflow-hidden">
                <SpotifyPerformance />
              </div>
            </section>
          </section>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[200px] rounded-lg bg-blue-500/5 border border-blue-500/10">
          <p className="text-lg text-muted-foreground">
            Select two artists to compare their metrics
          </p>
        </div>
      )}
    </div>
  );
}
