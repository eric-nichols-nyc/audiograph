"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { ArtistSelect } from "./artist-select";
import { FanbaseChart } from "./fanbase-charts";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play } from "lucide-react";
import { SpotifyPerformance } from "./spotify-performance";

export function CompareContainer() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isSticky, setIsSticky] = useState(false)
    const stickyRef = useRef<HTMLDivElement>(null)
    const sentinelRef = useRef<HTMLDivElement>(null)

    const entity1 = searchParams.get('entity1')
    const entity2 = searchParams.get('entity2')

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // When sentinel is not intersecting, the div is sticky
                setIsSticky(!entry.isIntersecting)
            },
            {
                threshold: [0, 1],
                rootMargin: '-24px 0px 0px 0px'
            }
        )

        if (sentinelRef.current) {
            observer.observe(sentinelRef.current)
        }

        return () => observer.disconnect()
    }, [])


    const handleArtistSelect = (position: 1 | 2, artistId: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('type', 'artist')
        params.set(`entity${position}`, artistId.toLowerCase())
        router.push(`/compare?${params.toString()}`)
    }

    const handleArtistClear = (position: 1 | 2) => {
        const params = new URLSearchParams(searchParams.toString())
        params.delete(`entity${position}`)
        if (!params.get('entity1') && !params.get('entity2')) {
            params.delete('type')
        }
        router.push(`/compare?${params.toString()}`)
    }

    return (
        <div className="flex flex-col gap-4 border border-white/10 rounded-lg p-4 bg-card">
            {/* Sentinel div to detect when sticky div hits the top */}
            <div ref={sentinelRef} className="h-px w-full" />

            <div ref={stickyRef} className="flex gap-4 sticky top-[24px] bg-card z-10">
                <ArtistSelect
                    position={1}
                    selectedId={entity1 || undefined}
                    otherSelectedId={entity2 || undefined}
                    onSelect={(artistId) => handleArtistSelect(1, artistId)}
                    onClear={() => handleArtistClear(1)}
                    sticky={isSticky}
                />
                <ArtistSelect
                    position={2}
                    selectedId={entity2 || undefined}
                    otherSelectedId={entity1 || undefined}
                    onSelect={(artistId) => handleArtistSelect(2, artistId)}
                    onClear={() => handleArtistClear(2)}
                    sticky={isSticky}
                />
            </div>
            {entity1 && entity2 && (
                <>
                    <FanbaseChart />
                    <div className="max-w-6xl mx-auto px-4 py-8">
                        <div className="mb-12">
                            <h2 className="text-2xl font-semibold mb-6 flex items-center">
                                <Play className="text-red-600 mr-2" /> Most Viewed YouTube Video Alltime
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left artist video */}
                                <div className="space-y-4">
                                    <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
                                        <Image
                                            src="/placeholder.svg?height=300&width=500"
                                            alt="Video thumbnail"
                                            width={500}
                                            height={300}
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center">
                                                <Play className="h-6 w-6 text-black" />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                                            <p className="text-white font-medium">David Guetta - Titanium ft. Sia</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <span className="font-bold mr-2">1.2B</span>
                                        <div className="flex-1 h-6 bg-red-200 rounded">
                                            <div className="h-full w-3/4 bg-red-500 rounded text-xs text-white flex items-center justify-center">
                                                Plays
                                            </div>
                                        </div>
                                    </div>

                                    <Button variant="link" className="text-blue-600 p-0">
                                        Check Artist&apos;s Analytics
                                    </Button>
                                </div>

                                {/* Right artist video */}
                                <div className="space-y-4">
                                    <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
                                        <Image
                                            src="/placeholder.svg?height=300&width=500"
                                            alt="Video thumbnail"
                                            width={500}
                                            height={300}
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center">
                                                <Play className="h-6 w-6 text-black" />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                                            <p className="text-white font-medium">Calvin Harris - This Is What You Came For ft. Rihanna</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <span className="font-bold mr-2">2.4B</span>
                                        <div className="flex-1 h-6 bg-red-200 rounded">
                                            <div className="h-full w-5/6 bg-red-500 rounded text-xs text-white flex items-center justify-center">
                                                Plays
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <Button variant="link" className="text-blue-600 p-0">
                                            Check Artist&apos;s Analytics
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Fanbase section */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-semibold mb-6">Top Connections</h2>

                            <Card className="p-6">
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div>
                                        <p className="text-gray-600">Top Connections</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Top Connections</p>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Size & Distribution section */}
                        <div className="mb-12">
                            <SpotifyPerformance />
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}