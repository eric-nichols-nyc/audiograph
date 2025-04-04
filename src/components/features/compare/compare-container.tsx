"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ArtistSelect } from "./artist-select";
//import { FanbaseChart } from "./fanbase-charts";
import { useEffect, useRef, useState } from "react";
import { SpotifyPerformance } from "./spotify-performance";
import { cn } from "@/lib/utils";
import { TopConnections } from "./top-connections";
import { HorizontalStackedChartGraphQL } from "./horizontal-stacked-chart-graphql";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import { useMediaQuery } from "react-responsive";
import { MostViewedVideos } from "./most-viewed-videos";
import { SectionHeader } from "@/components/ui/section-header";

export function CompareContainer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [firstArtistId, setFirstArtistId] = useState<string>();
  const [secondArtistId, setSecondArtistId] = useState<string>();
  const [isSticky, setIsSticky] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  const isMobileDevice = useMediaQuery({
    query: "(max-width: 500px) and (hover: none) and (pointer: coarse)",
  });

  // Initialize artist IDs from URL params and reset when params are empty
  useEffect(() => {
    const entity1 = searchParams.get("entity1");
    const entity2 = searchParams.get("entity2");

    // Reset both artists if URL has no search params
    if (!searchParams.has("entity1") && !searchParams.has("entity2")) {
      setFirstArtistId(undefined);
      setSecondArtistId(undefined);
      return;
    }

    // Update artists based on URL params
    setFirstArtistId(entity1 || undefined);
    setSecondArtistId(entity2 || undefined);
  }, [searchParams]);

  // Update URL when artist IDs change
  useEffect(() => {
    const params = new URLSearchParams();
    if (firstArtistId) params.set("entity1", firstArtistId);
    if (secondArtistId) params.set("entity2", secondArtistId);

    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
    router.replace(newUrl);
  }, [firstArtistId, secondArtistId, pathname, router]);

  const handleFirstArtistSelect = (artistId: string) => {
    setFirstArtistId(artistId);
  };

  const handleSecondArtistSelect = (artistId: string) => {
    setSecondArtistId(artistId);
  };

  // Setup intersection observer for sticky header
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
          "flex gap-4 sticky top-0 z-10 transition-all duration-300",
          isSticky &&
            "bg-background/80 backdrop-blur-sm shadow-lg rounded-lg p-4"
        )}
      >
        {isMobileDevice ? (
          <MultipleSelector
            options={[
              ...(firstArtistId
                ? [{ label: firstArtistId, value: firstArtistId }]
                : []),
              ...(secondArtistId
                ? [{ label: secondArtistId, value: secondArtistId }]
                : []),
            ]}
            value={[
              ...(firstArtistId
                ? [{ label: firstArtistId, value: firstArtistId }]
                : []),
              ...(secondArtistId
                ? [{ label: secondArtistId, value: secondArtistId }]
                : []),
            ]}
            onChange={(selected) => {
              const values = selected as Option[];
              setFirstArtistId(values[0]?.value);
              setSecondArtistId(values[1]?.value);
            }}
            placeholder="Select artists to compare..."
            maxSelected={2}
          />
        ) : (
          <div className="grid grid-cols-2 gap-8 w-full">
            <ArtistSelect
              position={1}
              selectedId={firstArtistId}
              otherSelectedId={secondArtistId}
              onSelect={handleFirstArtistSelect}
              onClear={() => setFirstArtistId(undefined)}
            />
            <ArtistSelect
              position={2}
              selectedId={secondArtistId}
              otherSelectedId={firstArtistId}
              onSelect={handleSecondArtistSelect}
              onClear={() => setSecondArtistId(undefined)}
            />
          </div>
        )}
      </div>

      {firstArtistId && secondArtistId ? (
        <div className="relative space-y-8">
          <section className="space-y-8">
            <section className="space-y-4">
              <SectionHeader title="Metrics Comparison" />
              <HorizontalStackedChartGraphQL />
            </section>
            <section className="space-y-4">
              <SectionHeader title="Most Viewed YouTube Video Alltime" />
              <MostViewedVideos />
            </section>

            {/* Fanbase section */}
            <section className="space-y-4">
              <SectionHeader title="Top Connections" />
              <TopConnections />
            </section>

            {/* Size & Distribution section */}
            <section className="space-y-4">
              <SectionHeader title="Spotify Performance" />
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
