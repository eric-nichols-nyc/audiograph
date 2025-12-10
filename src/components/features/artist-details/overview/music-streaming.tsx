"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollableGallery } from "@/components/features/scrollable-gallery/scrollablegallery";
import { useArtistStore } from "@/stores/artist-slug-store";
import { HeadphonesLoader } from "@/components/headphones-loader";
import { useQuery } from "@apollo/client";
import { SectionHeader } from "@/components/ui/section-header";
import { GET_ARTIST_DETAILS } from "@/graphql/queries/artist";
import { ExternalLink } from "lucide-react";

export function MusicStreaming() {
  const artist = useArtistStore((state) => state.artist);
  console.log("artist from music streaming is", artist);

  const {
    data,
    loading: isLoading,
    error,
  } = useQuery(GET_ARTIST_DETAILS, {
    variables: { id: artist?.id || "" },
    skip: !artist?.id,
  });

  // Transform tracks data to match the expected format
  const tracks =
    data?.artist?.topTracks.map((track) => ({
      id: track.id,
      title: track.title,
      artist: data.artist.name,
      streams: track.stream_count_total,
      image: track.thumbnail_url,
      track_id: track.track_id,
      platform: track.platform,
    })) || [];

  const getSpotifyUrl = (trackId: string) => {
    return `https://open.spotify.com/track/${trackId}`;
  };

  return (
    <div className="w-full h-[600px]">
      <SectionHeader title="Top Tracks" />
      <Card className="bg-[#0a1929] text-white mt-4">
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center h-[400px]">
              <HeadphonesLoader size={120} color="#3b82f6" />
            </div>
          )}

          {!isLoading && error && (
            <div className="text-center text-red-400 py-4">
              Failed to load tracks. Please try again later.
            </div>
          )}

          {!isLoading && !error && tracks && tracks.length > 0 && (
            <ScrollableGallery>
              {tracks.map((track) => (
                <Card
                  key={track.id}
                  className="bg-[#0f2942] max-w-[275px] overflow-hidden shadow-lg hover:shadow-xl transition-all hover:scale-105 duration-200"
                >
                  <CardHeader>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="text-xs font-semibold">
                        {track.streams}
                      </div>
                      <div className="flex items-center text-[10px] text-gray-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1"></span>
                        streams
                      </div>
                    </div>
                  </CardHeader>
                  <div className="relative">
                    <div className="aspect-square relative h-[275px]">
                      <Image
                        src={track.image}
                        alt={`${track.title} by ${track.artist}`}
                        fill
                        className="object-cover rounded-t-md"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
                    </div>
                  </div>
                  <CardContent className="p-3 pb-12 relative">
                    <div>
                      <div className="text-sm font-bold truncate">
                        {track.title}
                      </div>
                      <div className="text-xs text-gray-400">
                        {track.artist}
                      </div>
                    </div>
                    {track.platform === "spotify" && (
                      <a
                        href={getSpotifyUrl(track.track_id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-3 right-3 text-xs text-[#1DB954] hover:text-[#1ed760] font-medium flex items-center gap-1 transition-colors"
                      >
                        Spotify
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </ScrollableGallery>
          )}

          {!isLoading && !error && (!tracks || tracks.length === 0) && (
            <div className="text-center text-gray-400 py-4">
              No tracks available.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
