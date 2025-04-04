"use client";

import Image from "next/image";
import Link from "next/link";
import { useArtistStore } from "@/stores/artist-slug-store";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import type { SwiperOptions } from "swiper/types";
import { SectionHeader } from "@/components/ui/section-header";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const swiperOptions: SwiperOptions = {
  modules: [Pagination, Navigation],
  spaceBetween: 20,
  slidesPerView: 2.2,
  breakpoints: {
    640: { slidesPerView: 3.2 },
    768: { slidesPerView: 4 },
    1024: { slidesPerView: 5 },
  },
  pagination: { clickable: true },
  navigation: true,
  watchSlidesProgress: true,
};

const GET_SIMILAR_ARTISTS = gql`
  query GetSimilarArtists($id: ID!) {
    artist(id: $id) {
      similarArtists {
        id
        slug
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
  slug: string;
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

  // console.log("Artist ID:", artistId);
  // console.log("GraphQL response:", data);
  // console.log("GraphQL error:", error);

  if (!artistId || loading) {
    return (
      <div className="w-full bg-[#141e3c] text-white p-6 rounded-lg">
        <SectionHeader title="Compare Artist" />
        <p className="text-sm text-gray-300 mb-8">Loading similar artists...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-[#141e3c] text-white p-6 rounded-lg">
        <SectionHeader title="Compare Artist" />
        <p className="text-sm text-red-300 mb-8">
          Error loading similar artists
        </p>
      </div>
    );
  }

  const similarArtists = data?.artist?.similarArtists || [];
  // console.log("Similar artists in component:", similarArtists);

  return (
    <div className="w-full">
      <SectionHeader title="Similar Artists" />
      <div className="w-full bg-[#141e3c] text-white p-6 rounded-lg">
        <Swiper {...swiperOptions} className="w-full">
          {similarArtists.map((artist: SimilarArtist) => (
            <SwiperSlide key={artist.id}>
              <Link
                href={`/artist/${artist.slug}/overview`}
                className="flex flex-col items-center hover:opacity-80 transition-opacity"
              >
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-white mb-3">
                  <Image
                    src={artist.image_url || "/placeholder.svg"}
                    alt={artist.name}
                    width={112}
                    height={112}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm md:text-base text-center whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                  {artist.name}
                </span>
                <span className="text-xs text-gray-400">
                  {Math.round(artist.similarity_score * 100)}% match
                </span>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
