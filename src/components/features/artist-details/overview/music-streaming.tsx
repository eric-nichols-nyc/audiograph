"use client"

import { useState } from "react"
import Image from "next/image"
import { Bookmark } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollableGallery } from "@/components/features/scrollable-gallery/scrollablegallery"
import { useArtistStore } from "@/stores/artist-slug-store"
import { useQuery } from "@tanstack/react-query"
import { getArtistTopTracks } from "@/actions/spotify"
import { Skeleton } from "@/components/ui/skeleton"

export function MusicStreaming() {
  const [saved, setSaved] = useState(false)
  const artist = useArtistStore((state) => state.artist)

  const spotifyId = artist?.artist_platform_ids?.find(
    (platform) => platform.platform === 'spotify'
  )?.platform_id

  const { data: tracks, isLoading, error } = useQuery({
    queryKey: ['artistTopTracks', spotifyId],
    queryFn: async () => {
      if (!spotifyId) return null;
      console.log('Fetching tracks for spotifyId:', spotifyId);
      const result = await getArtistTopTracks(spotifyId);
      console.log('Received tracks:', result);
      return result;
    },
    enabled: !!spotifyId,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 2,
  })

  console.log('Component state:', { spotifyId, isLoading, error, tracksLength: tracks?.length })

  return (
    <div className="w-full">
      <Card className="bg-[#0a1929] text-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-medium text-gray-300">Top Tracks And Video</CardTitle>
          <button
            onClick={() => setSaved(!saved)}
            className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
          >
            Save
            <Bookmark className={`h-4 w-4 ${saved ? "fill-blue-400" : ""}`} />
          </button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-[275px] w-full bg-secondary/10" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-400 py-4">
              Failed to load tracks. Please try again later.
            </div>
          ) : tracks && tracks.length > 0 ? (
            <ScrollableGallery>
              {tracks.map((track) => (
                <Card key={track.id} className="bg-[#0f2942] max-w-[275px] overflow-hidden shadow-lg hover:shadow-xl transition-all hover:scale-105 duration-200">
                  <CardHeader>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="text-xs font-semibold">{track.streams}</div>
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
                      <div className="text-sm font-bold truncate">{track.title}</div>
                      <div className="text-xs text-gray-400">{track.artist}</div>
                    </div>


                  </CardContent>
                </Card>
              ))}
            </ScrollableGallery>
          ) : (
            <div className="text-center text-gray-400 py-4">
              No tracks available.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

