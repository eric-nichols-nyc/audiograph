import { useSearchParams } from "next/navigation"
import { useArtistMetrics } from "./use-artist-metrics"
import { getArtistId, getArtistNameClient } from "@/actions/artist"
import { useEffect, useState } from "react"

export function useCompareArtists() {
    const searchParams = useSearchParams()
    const entity1Slug = searchParams.get("entity1")
    const entity2Slug = searchParams.get("entity2")

    const [artist1Id, setArtist1Id] = useState<string>()
    const [artist2Id, setArtist2Id] = useState<string>()

    // Get artist IDs from slugs
    useEffect(() => {
        async function fetchIds() {
            if (entity1Slug) {
                const id = await getArtistId(entity1Slug)
                setArtist1Id(id || undefined)
            }
            if (entity2Slug) {
                const id = await getArtistId(entity2Slug)
                setArtist2Id(id || undefined)
            }
        }
        fetchIds()
    }, [entity1Slug, entity2Slug])

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

    const [artist1Name, setArtist1Name] = useState<string>("")
    const [artist2Name, setArtist2Name] = useState<string>("")

    useEffect(() => {
        async function fetchNames() {
            if (artist1Id) {
                const name = await getArtistNameClient(artist1Id)
                setArtist1Name(name || "Unknown Artist")
            }
            if (artist2Id) {
                const name = await getArtistNameClient(artist2Id)
                setArtist2Name(name || "Unknown Artist")
            }
        }
        fetchNames()
    }, [artist1Id, artist2Id])

    const loading = artist1Loading || artist2Loading || !artist1Id || !artist2Id
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