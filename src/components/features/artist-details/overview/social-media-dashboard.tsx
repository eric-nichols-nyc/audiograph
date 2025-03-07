"use client"

import { PieChart, Pie, Cell } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { PlatformCard } from "@/components/features/artist-details/platform-card"
import { platformData } from "@/components/features/artist-details/data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function SocialMediaDashboard() {
  // Add null check for platformData
  const data = platformData || []

  const totalFans = data.reduce((sum, platform) => sum + platform.count, 0)
  const formattedTotal = (totalFans / 1000000).toFixed(0)

  // Calculate total growth percentage
  const totalGrowth =
    data.reduce((sum, platform) => {
      return sum + (platform.growth || 0) * platform.count
    }, 0) / totalFans

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
          <div className="lg:col-span-1 flex justify-center items-center">
            <div className="relative w-64 h-64">
              <ChartContainer className="w-full h-full" config={{
                spotify: { color: "#22c55e" },
                youtube: { color: "#FF5733" },
                instagram: { color: "#3b82f6" },
                tiktok: { color: "#f59e0b" },
                other: { color: "#6b7280" }
              }}>
                <PieChart width={250} height={250}>
                  <Pie
                    data={pieData}
                    cx={125}
                    cy={125}
                    innerRadius={90}
                    outerRadius={105}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="absolute inset-0 flex flex-col justify-center items-center">
                <div className="text-4xl font-medium">{formattedTotal} M</div>
                <div className={`text-sm ${totalGrowth >= 0 ? "text-green-500" : "text-red-500"} flex items-center`}>
                  {totalGrowth >= 0 ? "↑" : "↓"}
                  {Math.abs(totalGrowth * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* Platform cards grid */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
            {data.map((platform) => (
              <PlatformCard key={platform.id} platform={platform} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

