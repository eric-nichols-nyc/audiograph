"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { ArtistSelect } from "./artist-select";
import { FanbaseChart } from "./fanbase-chart";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play } from "lucide-react";

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
            { threshold: 1.0 }
        )

        if (sentinelRef.current) {
            observer.observe(sentinelRef.current)
        }

        return () => observer.disconnect()
    }, [])

    //console.log isSticky
    useEffect(() => {
        console.log('isSticky', isSticky)
    }, [isSticky])

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
            <div ref={sentinelRef} className="absolute top-0 h-px w-full" />

            <div ref={stickyRef} className="flex gap-4 sticky top-0 bg-card z-10">
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
                        {/* Overview section */}
                        <div className="mb-12">
                            <div className="flex items-center mb-6">
                                <div className="bg-red-600 text-white p-1 rounded mr-2">
                                    <span className="font-bold">V</span>
                                </div>
                                <h2 className="text-2xl font-semibold">Overview</h2>
                                <div className="ml-2 text-blue-600">ⓘ</div>
                            </div>

                            <Card className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Left artist stats */}
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold">4.2M</span>
                                            <div className="flex-1 mx-4 h-6 bg-gray-700 rounded">
                                                <div className="h-full w-3/4 bg-gray-500 rounded text-xs text-white flex items-center justify-center">
                                                    Viberate Points
                                                </div>
                                            </div>
                                            <span className="text-gray-500">Social Media</span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="font-bold">656.5M</span>
                                            <div className="flex-1 mx-4 h-6 bg-gray-700 rounded">
                                                <div className="h-full w-4/5 bg-gray-500 rounded text-xs text-white flex items-center justify-center">
                                                    Viberate Points
                                                </div>
                                            </div>
                                            <span className="text-gray-500">Music Channels</span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="font-bold">3.8K</span>
                                            <div className="flex-1 mx-4 h-6 bg-gray-700 rounded">
                                                <div className="h-full w-1/2 bg-gray-500 rounded text-xs text-white flex items-center justify-center">
                                                    Viberate Points
                                                </div>
                                            </div>
                                            <span className="text-gray-500">Network Respect</span>
                                        </div>

                                        <Button variant="link" className="text-blue-600 p-0">
                                            Check Artist&apos;s Analytics
                                        </Button>
                                    </div>

                                    {/* Right artist stats */}
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-500">Social Media</span>
                                            <div className="flex-1 mx-4 h-6 bg-gray-200 rounded">
                                                <div className="h-full w-1/6 bg-gray-500 rounded text-xs text-white flex items-center justify-center"></div>
                                            </div>
                                            <span className="font-bold">155.7K</span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-500">Music Channels</span>
                                            <div className="flex-1 mx-4 h-6 bg-gray-200 rounded">
                                                <div className="h-full w-5/6 bg-gray-700 rounded text-xs text-white flex items-center justify-center">
                                                    Viberate Points
                                                </div>
                                            </div>
                                            <span className="font-bold">690.4M</span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-500">Network Respect</span>
                                            <div className="flex-1 mx-4 h-6 bg-gray-200 rounded">
                                                <div className="h-full w-5/6 bg-gray-700 rounded text-xs text-white flex items-center justify-center">
                                                    Viberate Points
                                                </div>
                                            </div>
                                            <span className="font-bold">4.7K</span>
                                        </div>

                                        <div className="text-right">
                                            <Button variant="link" className="text-blue-600 p-0">
                                                Check Artist&apos;s Analytics
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* YouTube Videos section */}
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
                            <h2 className="text-2xl font-semibold mb-6">Fanbase</h2>

                            <Card className="p-6">
                                <div className="flex justify-center mb-8">
                                    <div className="relative h-40 w-40">
                                        <div className="absolute inset-0 rounded-full overflow-hidden">
                                            <div className="h-full w-1/2 bg-gray-700"></div>
                                            <div className="h-full w-1/2 bg-gray-400 absolute right-0 top-0"></div>
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="flex justify-between w-40">
                                                    <span className="font-bold">11.8K</span>
                                                    <span className="font-bold">11.5K</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

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
                            <h2 className="text-2xl font-semibold mb-6">Size & Distribution</h2>

                            <Card className="p-6 h-60 flex items-center justify-center">
                                <p className="text-gray-500">Size & Distribution data visualization would go here</p>
                            </Card>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}