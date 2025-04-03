"use client";

import { ArtistMetricsGraphQL } from "./ArtistMetricsGraphQL";
import { useArtistStore } from "@/stores/artist-slug-store";

export function ArtistMetricsGraphQLWrapper() {
  const artist = useArtistStore((state) => state.artist);
  console.log(artist);

  if (!artist) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Metrics</h2>
      <ArtistMetricsGraphQL artistId={artist.id} />
    </div>
  );
}
