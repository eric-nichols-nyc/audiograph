"use client";

import { ArtistMetricsGraphQL } from "./artist-metrics-graphql";
import { useArtistStore } from "@/stores/artist-slug-store";
import { SectionHeader } from "@/components/ui/section-header";
export function ArtistMetricsGraphQLWrapper() {
  const artist = useArtistStore((state) => state.artist);

  if (!artist) return null;

  return (
    <div className="space-y-4">
      <SectionHeader title="Metrics" />

      <ArtistMetricsGraphQL artistId={artist.id} />
    </div>
  );
}
