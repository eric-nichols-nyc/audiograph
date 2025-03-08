"use client"

import { useState } from "react"
import Image from "next/image"
import { Play, Bookmark } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function MusicStreaming() {
  const [saved, setSaved] = useState(false)

  const tracks = [
    {
      id: 1,
      title: "DtMF",
      artist: "Bad Bunny",
      streams: "40.8M",
      image: "/images/tracks/track.jpeg",
      hasVideo: false,
    },
    {
      id: 2,
      title: "BAILE INolVIDABLE",
      artist: "Bad Bunny",
      streams: "34.4M",
      image: "/images/tracks/track.jpeg",
      hasVideo: true,
    },
    {
      id: 3,
      title: "NUEVAYoL",
      artist: "Bad Bunny",
      streams: "25.1M",
      image: "/images/tracks/track.jpeg",
      hasVideo: false,
    },
  ]

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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {tracks.map((track) => (
              <Card key={track.id} className="bg-[#0f2942] overflow-hidden shadow-lg hover:shadow-xl transition-all hover:scale-105 duration-200">
                <div className="relative">
                  <div className="aspect-square relative h-[120px]">
                    <Image
                      src={track.image}
                      alt={`${track.title} by ${track.artist}`}
                      fill
                      className="object-cover rounded-t-md"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
                  </div>

                  {track.hasVideo ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                        Video
                      </span>
                    </div>
                  ) : (
                    <button className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Play className="h-5 w-5 text-white fill-white" />
                      </div>
                    </button>
                  )}
                </div>

                <CardContent className="p-3">
                  <div>
                    <div className="text-sm font-bold truncate">{track.title}</div>
                    <div className="text-xs text-gray-400">{track.artist}</div>
                  </div>

                  <div className="flex items-center gap-1 mt-1">
                    <div className="text-xs font-semibold">{track.streams}</div>
                    <div className="flex items-center text-[10px] text-gray-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1"></span>
                      streams
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

