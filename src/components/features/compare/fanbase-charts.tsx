"use client"

import { ComparePieChart } from "./pie-chart"
import { getArtistMetrics } from "@/actions/metrics"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

type ArtistMetric = {
  id: string
  artist_id: string
  platform: string
  metric_type: string
  value: number
  created_at: string
}

type MetricsState = {
  artist1: ArtistMetric[] | null
  artist2: ArtistMetric[] | null
}

export function FanbaseChart() {
  const searchParams = useSearchParams()
  const [metrics, setMetrics] = useState<MetricsState>({
    artist1: null,
    artist2: null
  })

  useEffect(() => {
    const entity1 = searchParams.get('entity1')
    const entity2 = searchParams.get('entity2')

    async function fetchMetrics() {
      const [artist1Metrics, artist2Metrics] = await Promise.all([
        entity1 ? getArtistMetrics(entity1) : null,
        entity2 ? getArtistMetrics(entity2) : null
      ])

      setMetrics({
        artist1: artist1Metrics,
        artist2: artist2Metrics
      })
    }

    fetchMetrics()
  }, [searchParams])

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex flex-col space-y-6">
        {/* Donut Charts */}
        <div className="flex flex-wrap justify-around items-center gap-8">
          {metrics.artist1 && <ComparePieChart artistId={metrics.artist1[0].artist_id} />}
          {metrics.artist2 && <ComparePieChart artistId={metrics.artist2[0].artist_id} />}
        </div>
      </div>
    </div>
  )
}

