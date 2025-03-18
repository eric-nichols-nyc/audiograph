"use client";

import { use } from "react";
import Image from "next/image";
import { getSimilarArtists } from "@/actions/artist";
import { useArtistStore } from "@/stores/artist-slug-store";

interface SimilarArtist {
  id: string;
  name: string;
  image_url: string;
  genres: string[];
  similarity_score: number;
}

// Create a cache outside the component
const similarArtistsCache = new Map<string, Promise<SimilarArtist[]>>();

export function SimilarArtists() {
  const artist = useArtistStore((state) => state.artist);
  const artistId = artist?.id;

  // Get or create the promise
  const similarArtistsPromise =
    similarArtistsCache.get(artistId || "") ||
    new Promise<SimilarArtist[]>((resolve) => {
      setTimeout(async () => {
        const artists = await getSimilarArtists(artistId, 5);
        console.log("similar artists = ", artists);
        resolve(artists as SimilarArtist[]);
      }, 2000);
    });

  // Cache the promise
  if (artistId) {
    similarArtistsCache.set(artistId, similarArtistsPromise);
  }

  // Use the promise with the use hook
  const similarArtists = use(similarArtistsPromise);

  return (
    <div className="w-full bg-[#141e3c] text-white p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-1">Compare Artist</h1>
      <p className="text-sm text-gray-300 mb-8">
        Performance against similar artists in the last 28 days
      </p>

      <div className="flex flex-wrap justify-between gap-4">
        {similarArtists.map((artist) => (
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
        ))}
      </div>
    </div>
  );
}
