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
      image: "/placeholder.svg?height=400&width=400",
      hasVideo: false,
    },
    {
      id: 2,
      title: "BAILE INolVIDABLE",
      artist: "Bad Bunny",
      streams: "34.4M",
      image: "/placeholder.svg?height=400&width=400",
      hasVideo: true,
    },
    {
      id: 3,
      title: "NUEVAYoL",
      artist: "Bad Bunny",
      streams: "25.1M",
      image: "/placeholder.svg?height=400&width=400",
      hasVideo: false,
    },
  ]

  return (
    <div className="w-full">
      <Card className="bg-[#0a1929] text-white">
        <CardHeader className="flex flex-row items-center justify-between">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tracks.map((track) => (
              <Card key={track.id} className="bg-[#0f2942] overflow-hidden shadow-lg">
                <div className="relative">
                  <div className="aspect-square relative">
                    <Image
                      src={track.image || "/placeholder.svg"}
                      alt={`${track.title} by ${track.artist}`}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {track.hasVideo ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                        {track.title}
                      </span>
                    </div>
                  ) : (
                    <button className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                      <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Play className="h-6 w-6 text-white fill-white" />
                      </div>
                    </button>
                  )}
                </div>

                <CardContent className="p-4">
                  <div className="mb-1">
                    <div className="text-lg font-bold">{track.title}</div>
                    <div className="text-gray-400">{track.artist}</div>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <div className="text-lg font-semibold">{track.streams}</div>
                    <div className="flex items-center text-xs text-gray-400">
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                      7-day streams
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

