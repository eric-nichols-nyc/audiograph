"use client";

import { useState } from "react";
import Image from "next/image";
import { Bookmark } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollableGallery } from "@/components/features/scrollable-gallery/scrollablegallery";
import { useArtistStore } from "@/stores/artist-slug-store";
import { HeadphonesLoader } from "@/components/headphones-loader";
import { useQuery } from "@apollo/client";
import {
  GET_ARTIST_TRACKS,
  GetArtistTracksData,
  GetArtistTracksVars,
} from "@/graphql/queries/tracks";

export function MusicStreaming() {
  const [saved, setSaved] = useState(false);
  const artist = useArtistStore((state) => state.artist);

  const {
    data,
    loading: isLoading,
    error,
  } = useQuery<GetArtistTracksData, GetArtistTracksVars>(GET_ARTIST_TRACKS, {
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
    })) || [];

  return (
    <div className="w-full h-[600px]">
      <Card className="bg-[#0a1929] text-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-medium text-gray-300">
            Top Tracks And Video
          </CardTitle>
          <button
            onClick={() => setSaved(!saved)}
            className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
          >
            Save
            <Bookmark className={`h-4 w-4 ${saved ? "fill-blue-400" : ""}`} />
          </button>
        </CardHeader>
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
                  <CardContent className="p-3">
                    <div>
                      <div className="text-sm font-bold truncate">
                        {track.title}
                      </div>
                      <div className="text-xs text-gray-400">
                        {track.artist}
                      </div>
                    </div>
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
