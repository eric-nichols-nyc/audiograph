import { useSearchParams } from "next/navigation"
import { useArtistMetrics } from "./use-artist-metrics"
import { useEffect, useState } from "react"
import { useArtists } from "@/hooks/use-artists"

export function useCompareArtists() {
    const searchParams = useSearchParams()
    const entity1Slug = searchParams.get("entity1")
    const entity2Slug = searchParams.get("entity2")

    const { data: artists, isLoading: artistsLoading } = useArtists()

    const [artist1Id, setArtist1Id] = useState<string>()
    const [artist2Id, setArtist2Id] = useState<string>()
    const [artist1Name, setArtist1Name] = useState<string>("")
    const [artist2Name, setArtist2Name] = useState<string>("")

    // Get artist IDs and names from the artists data
    useEffect(() => {
        if (!artists || artistsLoading) return

        if (entity1Slug) {
            const artist1 = artists.find(artist => artist.slug === entity1Slug)
            if (artist1) {
                setArtist1Id(artist1.id)
                setArtist1Name(artist1.name)
            }
        }

        if (entity2Slug) {
            const artist2 = artists.find(artist => artist.slug === entity2Slug)
            if (artist2) {
                setArtist2Id(artist2.id)
                setArtist2Name(artist2.name)
            }
        }
    }, [entity1Slug, entity2Slug, artists, artistsLoading])

    const {
        metrics: artist1Metrics,
        loading: artist1Loading,
        error: artist1Error
    } = useArtistMetrics(artist1Id)

    const {
        metrics: artist2Metrics,
        loading: artist2Loading,
        error: artist2Error
    } = useArtistMetrics(artist2Id)

    const loading = artist1Loading || artist2Loading || artistsLoading || !artist1Id || !artist2Id
    const error = artist1Error || artist2Error

    return {
        artist1Metrics,
        artist2Metrics,
        artist1Name,
        artist2Name,
        loading,
        error
    }
} 