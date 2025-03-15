"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { ArtistSelect } from "./artist-select";
import { FanbaseChart } from "./fanbase-charts";
import { useEffect, useRef, useState } from "react";
import { VideoContainer } from "./video-container";
import { SpotifyPerformance } from "./spotify-performance";
import { cn } from "@/lib/utils";
import { TopConnections } from "./top-connections";

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
        <div className="relative flex flex-col gap-6 border border-white/10 rounded-lg p-6 bg-card">
            {/* Background accent */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-lg pointer-events-none" />

            {/* Sentinel div to detect when sticky div hits the top */}
            <div ref={sentinelRef} className="h-px w-full" />

            <div
                ref={stickyRef}
                className={cn(
                    "flex gap-4 sticky top-[24px] z-10 transition-all duration-300",
                    isSticky && "bg-background/80 backdrop-blur-sm shadow-lg rounded-lg p-4"
                )}
            >
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

            {entity1 && entity2 ? (
                <div className="relative space-y-8">
                    <div className="rounded-lg overflow-hidden">
                        <FanbaseChart />
                    </div>

                    <section className="space-y-8">
                        <section className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-1 bg-blue-500/30 rounded-full" />
                                <h2 className="text-2xl font-semibold">Most Viewed YouTube Video Alltime</h2>
                            </div>
                            <VideoContainer />
                        </section>

                        {/* Fanbase section */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-1 bg-blue-500/30 rounded-full" />
                                <h2 className="text-2xl font-semibold">Top Connections</h2>
                            </div>
                            <TopConnections />
                        </section>

                        {/* Size & Distribution section */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-1 bg-blue-500/30 rounded-full" />
                                <h2 className="text-2xl font-semibold">Spotify Performance</h2>
                            </div>
                            <div className="rounded-lg overflow-hidden">
                                <SpotifyPerformance />
                            </div>
                        </section>
                    </section>
                </div>
            ) : (
                <div className="flex items-center justify-center min-h-[200px] rounded-lg bg-blue-500/5 border border-blue-500/10">
                    <p className="text-lg text-muted-foreground">Select two artists to compare their metrics</p>
                </div>
            )}
        </div>
    )
}