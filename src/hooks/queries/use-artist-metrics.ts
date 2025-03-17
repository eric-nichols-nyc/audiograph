// hooks/queries/use-artist-metrics.ts
import * as React from "react"
import { getFormattedArtistMetrics } from "@/actions/metrics"
import { FormattedMetric } from "@/actions/metrics"

export function useArtistMetrics(artistId: string | undefined) {
    const [metrics, setMetrics] = React.useState<FormattedMetric[]>([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)

    React.useEffect(() => {
        async function fetchMetrics() {
            if (!artistId) {
                setLoading(false)
                return
            }

            try {
                const data = await getFormattedArtistMetrics(artistId)
                setMetrics(data)
                setError(null)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch metrics")
                setMetrics([])
            } finally {
                setLoading(false)
            }
        }

        fetchMetrics()
    }, [artistId])

    return { metrics, loading, error }
}