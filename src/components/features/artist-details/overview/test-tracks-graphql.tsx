"use client";

import { gql, useQuery } from "@apollo/client";

const GET_ARTIST_TRACKS = gql`
  query GetArtistTracks($id: ID!) {
    artist(id: $id) {
      id
      name
      topTracks {
        id
        title
        thumbnail_url
        stream_count_total
        platform
        track_id
      }
    }
  }
`;

export function TestTracksGraphQL() {
  const { data, loading, error } = useQuery(GET_ARTIST_TRACKS, {
    variables: { id: "eb550160-d4bc-4ad7-b0c5-444e420e3ad7" }, // Taylor Swift ID
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  console.log("GraphQL Response:", data);

  return (
    <div>
      <h2>Artist: {data?.artist?.name}</h2>
      <h3>Top Tracks:</h3>
      <pre>{JSON.stringify(data?.artist?.topTracks, null, 2)}</pre>
    </div>
  );
}
