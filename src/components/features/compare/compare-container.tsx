"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { ArtistSelect } from "./artist-select";
import { FanbaseChart } from "./fanbase-chart";



export function CompareContainer() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const entity1 = searchParams.get('entity1')
    const entity2 = searchParams.get('entity2')

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
        <div className="flex flex-col  gap-4 border border-white/10 rounded-lg p-4 bg-card">
            <div className="flex gap-4">
                <ArtistSelect
                    position={1}
                    selectedId={entity1 || undefined}
                    otherSelectedId={entity2 || undefined}
                    onSelect={(artistId) => handleArtistSelect(1, artistId)}
                    onClear={() => handleArtistClear(1)}
                />
                <ArtistSelect
                    position={2}
                    selectedId={entity2 || undefined}
                    otherSelectedId={entity1 || undefined}
                    onSelect={(artistId) => handleArtistSelect(2, artistId)}
                    onClear={() => handleArtistClear(2)}
                />
            </div>
            {entity1 && entity2 && (
                <FanbaseChart />
            )}
        </div>
    )
}