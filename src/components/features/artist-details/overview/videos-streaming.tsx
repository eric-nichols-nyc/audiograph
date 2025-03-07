"use client"

import { Play } from "lucide-react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function VideosStreaming() {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center gap-2">
        <div className="bg-red-600 text-white p-1 rounded-md">
          <Play className="h-5 w-5 fill-white" />
        </div>
        <CardTitle className="text-xl md:text-2xl font-medium">Artist&apos;s YouTube Videos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Video Card 1 */}
          <div className="bg-navy-900 rounded-lg overflow-hidden shadow-lg">
            <div className="relative aspect-video group">
              <Image
                src="/placeholder.svg?height=720&width=1280"
                alt="Music video thumbnail"
                width={1280}
                height={720}
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-sm p-2 rounded-full">
                  <Play className="h-8 w-8 fill-white" />
                </div>
              </div>
              <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-sm">
                <span className="font-bold">2.3B</span>
                <span className="text-gray-300 text-xs ml-1">Views</span>
              </div>
              <div className="absolute bottom-2 right-2">
                <Image
                  src="/placeholder.svg?height=50&width=100"
                  alt="Vevo logo"
                  width={100}
                  height={50}
                  className="h-6 w-auto"
                />
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-lg mb-2 line-clamp-2">
                Artist ft. Featured Artist - Song Title (Official Video)
              </h3>
              <div className="flex items-center gap-3">
                <Image
                  src="/placeholder.svg?height=40&width=40"
                  alt="Artist avatar"
                  width={40}
                  height={40}
                  className="rounded-full h-8 w-8"
                />
                <div>
                  <p className="text-sm">Artist Name</p>
                  <p className="text-xs text-gray-400">Uploaded Aug 29, 2022</p>
                </div>
              </div>
            </div>
          </div>

          {/* Video Card 2 */}
          <div className="bg-navy-900 rounded-lg overflow-hidden shadow-lg">
            <div className="relative aspect-video group">
              <Image
                src="/placeholder.svg?height=720&width=1280"
                alt="Music video thumbnail"
                width={1280}
                height={720}
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-sm p-2 rounded-full">
                  <Play className="h-8 w-8 fill-white" />
                </div>
              </div>
              <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-sm">
                <span className="font-bold">2B</span>
                <span className="text-gray-300 text-xs ml-1">Views</span>
              </div>
              <div className="absolute bottom-2 right-2">
                <Image
                  src="/placeholder.svg?height=50&width=100"
                  alt="Vevo logo"
                  width={100}
                  height={50}
                  className="h-6 w-auto"
                />
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-lg mb-2 line-clamp-2">
                Multiple Artists - Collaboration Song (Official Music Video)
              </h3>
              <div className="flex items-center gap-3">
                <Image
                  src="/placeholder.svg?height=40&width=40"
                  alt="Artist avatar"
                  width={40}
                  height={40}
                  className="rounded-full h-8 w-8"
                />
                <div>
                  <p className="text-sm">Artist Name</p>
                  <p className="text-xs text-gray-400">Uploaded Jun 15, 2021</p>
                </div>
              </div>
            </div>
          </div>

          {/* Video Card 3 */}
          <div className="bg-navy-900 rounded-lg overflow-hidden shadow-lg">
            <div className="relative aspect-video group">
              <Image
                src="/placeholder.svg?height=720&width=1280"
                alt="Music video thumbnail"
                width={1280}
                height={720}
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-sm p-2 rounded-full">
                  <Play className="h-8 w-8 fill-white" />
                </div>
              </div>
              <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-sm">
                <span className="font-bold">1.5B</span>
                <span className="text-gray-300 text-xs ml-1">Views</span>
              </div>
              <div className="absolute bottom-2 right-2">
                <Image
                  src="/placeholder.svg?height=50&width=100"
                  alt="Vevo logo"
                  width={100}
                  height={50}
                  className="h-6 w-auto"
                />
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-lg mb-2 line-clamp-2">Artist - Solo Track (Official Video)</h3>
              <div className="flex items-center gap-3">
                <Image
                  src="/placeholder.svg?height=40&width=40"
                  alt="Artist avatar"
                  width={40}
                  height={40}
                  className="rounded-full h-8 w-8"
                />
                <div>
                  <p className="text-sm">Artist Name</p>
                  <p className="text-xs text-gray-400">Uploaded Jan 17, 2023</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

