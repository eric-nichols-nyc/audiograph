import { Suspense } from "react";
import { notFound } from "next/navigation";
import { MusicStreaming } from "@/components/features/artist-details/overview/music-streaming";
import { VideosStreaming } from "@/components/features/artist-details/overview/videos-streaming";
import { HeadphonesLoader } from "@/components/headphones-loader";
import { ArtistMetricsGraphQLWrapper } from "@/components/features/artist-details/ArtistMetricsGraphQLWrapper";
import { getArtists } from "@/actions/artists/artist";
import { SimilarArtists } from "@/components/features/artist-details/overview/similar-artists";

// This is a Server Component
export default async function ArtistOverviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch data server-side
  const { data } = await getArtists({ slug });
  const artist = data?.[0];

  if (!artist) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Suspense fallback={<HeadphonesLoader />}>
        <ArtistMetricsGraphQLWrapper artistId={artist.id} />
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
