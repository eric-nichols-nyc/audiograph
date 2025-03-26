import { Suspense } from "react";
import { MusicStreaming } from "@/components/features/artist-details/overview/music-streaming";
import { VideosStreaming } from "@/components/features/artist-details/overview/videos-streaming";
import { HeadphonesLoader } from "@/components/headphones-loader";
import { ArtistMetricsGraphQLWrapper } from "@/components/features/artist-details/ArtistMetricsGraphQLWrapper";
import { SimilarArtists } from "@/components/features/artist-details/overview/similar-artists";

// This is a Server Component
export default async function ArtistOverviewPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<HeadphonesLoader />}>
        <ArtistMetricsGraphQLWrapper />
      </Suspense>

      <Suspense fallback={<HeadphonesLoader />}>
        <MusicStreaming />
      </Suspense>

      <Suspense fallback={<HeadphonesLoader />}>
        <VideosStreaming />
      </Suspense>

      <Suspense fallback={<HeadphonesLoader />}>
        <SimilarArtists />
      </Suspense>
    </div>
  );
}
