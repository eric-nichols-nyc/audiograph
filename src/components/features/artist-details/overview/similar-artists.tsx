"use client";

import Image from "next/image";
import { useArtistStore } from "@/stores/artist-slug-store";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";

const GET_SIMILAR_ARTISTS = gql`
  query GetSimilarArtists($id: ID!) {
    artist(id: $id) {
      similarArtists {
        id
        name
        similarity_score
        image_url
      }
    }
  }
`;

interface SimilarArtist {
  id: string;
  name: string;
  similarity_score: number;
  image_url?: string;
}

export function SimilarArtists() {
  const artist = useArtistStore((state) => state.artist);
  const artistId = artist?.id;

  const { data, loading, error } = useQuery(GET_SIMILAR_ARTISTS, {
    variables: { id: artistId },
    skip: !artistId,
  });

  console.log("Artist ID:", artistId);
  console.log("GraphQL response:", data);
  console.log("GraphQL error:", error);

  if (!artistId || loading) {
    return (
      <div className="w-full bg-[#141e3c] text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-1">Compare Artist</h1>
        <p className="text-sm text-gray-300 mb-8">Loading similar artists...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-[#141e3c] text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-1">Compare Artist</h1>
        <p className="text-sm text-red-300 mb-8">
          Error loading similar artists
        </p>
      </div>
    );
  }

  const similarArtists = data?.artist?.similarArtists || [];
  console.log("Similar artists in component:", similarArtists);

  return (
    <div className="w-full bg-[#141e3c] text-white p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-1">Compare Artist</h1>
      <p className="text-sm text-gray-300 mb-8">
        Performance against similar artists in the last 28 days
      </p>

      <div className="flex flex-wrap justify-between gap-4">
        {similarArtists.map((artist: SimilarArtist) => {
          console.log("Rendering artist:", artist);
          return (
            <div key={artist.id} className="flex flex-col items-center">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-white mb-3">
                <Image
                  src={artist.image_url || "/placeholder.svg"}
                  alt={artist.name}
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm md:text-base text-center">
                {artist.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
