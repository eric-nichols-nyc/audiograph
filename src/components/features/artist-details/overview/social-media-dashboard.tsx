"use client"

import { PlatformCard } from "@/components/features/artist-details/platform-card"
import { platformData } from "@/components/features/artist-details/data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MetricPieChart } from "@/components/features/charts/metric-pie-chart"
import { useArtistStore } from "@/stores/artist-slug-store"
export function SocialMediaDashboard() {
  // Add null check for platformData
  const data = platformData || []
  const artist = useArtistStore((state) => state.artist)
  const artistId = artist?.id
  const totalFans = data.reduce((sum, platform) => sum + platform.count, 0)


  // Data for the donut chart
  const COLORS = ["#4ade80", "#FF5733", "#60a5fa", "#fbbf24", "#a78bfa"]
  const pieData = data
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map((platform, index) => ({
      name: platform.name,
      value: platform.count,
      color: COLORS[index % COLORS.length],
    }))

  // Add "Others" segment for remaining platforms
  const otherPlatformsSum = data
    .sort((a, b) => b.count - a.count)
    .slice(5)
    .reduce((sum, platform) => sum + platform.count, 0)

  pieData.push({
    name: "Others",
    value: otherPlatformsSum,
    color: "#9ca3af",
  })

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl">Total fans {totalFans.toLocaleString()}</CardTitle>
        <CardDescription>Follower and subscriber evolution over the last 28 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Center donut chart */}
          <MetricPieChart artistId={artistId} />

          {/* Platform cards grid */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {data.map((platform) => (
              <PlatformCard key={platform.id} platform={platform} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

