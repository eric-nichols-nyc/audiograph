"use client";

import { ArtistMetricsGraphQL } from "./ArtistMetricsGraphQL";

interface ArtistMetricsGraphQLWrapperProps {
  artistId: string;
}

export function ArtistMetricsGraphQLWrapper({
  artistId,
}: ArtistMetricsGraphQLWrapperProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Metrics (GraphQL Version)</h2>
      <ArtistMetricsGraphQL artistId={artistId} />
    </div>
  );
}
