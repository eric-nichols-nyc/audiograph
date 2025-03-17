import { useSearchParams } from "next/navigation"
import { useArtistMetrics } from "./use-artist-metrics"
import { getArtistName } from "@/actions/artists"
import { useEffect, useState } from "react"

export function useCompareArtists() {
    const searchParams = useSearchParams()
    const artist1Id = searchParams.get("entity1")
    const artist2Id = searchParams.get("entity2")

    const {
        metrics: artist1Metrics,
        loading: artist1Loading,
        error: artist1Error
    } = useArtistMetrics(artist1Id || undefined)

    const {
        metrics: artist2Metrics,
        loading: artist2Loading,
        error: artist2Error
    } = useArtistMetrics(artist2Id || undefined)

    const [artist1Name, setArtist1Name] = useState<string>("")
    const [artist2Name, setArtist2Name] = useState<string>("")

    useEffect(() => {
        async function fetchNames() {
            if (artist1Id) {
                const name = await getArtistName(artist1Id)
                setArtist1Name(name || "Unknown Artist")
            }
            if (artist2Id) {
                const name = await getArtistName(artist2Id)
                setArtist2Name(name || "Unknown Artist")
            }
        }
        fetchNames()
    }, [artist1Id, artist2Id])

    const loading = artist1Loading || artist2Loading
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