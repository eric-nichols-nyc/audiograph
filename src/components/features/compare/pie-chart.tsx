"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

type ArtistMetric = {
    id: string
    artist_id: string
    platform: string
    metric_type: string
    value: number
    created_at: string
}

// Format date to a readable string
function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

// Utility function to organize and sort metrics
function organizeMetrics(metrics: ArtistMetric[]) {
    if (!metrics || metrics.length === 0) return []

    // Initialize arrays for each platform
    const platforms = {
        spotify: [] as { value: number; date: string }[],
        youtube: [] as { value: number; date: string }[],
        deezer: [] as { value: number; date: string }[],
        musicbrainz: [] as { value: number; date: string }[],
        genius: [] as { value: number; date: string }[]
    }

    // Group metrics by platform
    metrics.forEach(metric => {
        const date = new Date(metric.created_at || '').toISOString()
        // spotify followers
        if (metric.metric_type === 'followers' && metric.platform === 'spotify') {
            platforms.spotify.push({ value: metric.value, date })
        }
        // youtube subscribers
        if (metric.metric_type === 'subscribers' && metric.platform === 'youtube') {
            platforms.youtube.push({ value: metric.value, date })
        }
        // deezer followers
        if (metric.metric_type === 'followers' && metric.platform === 'deezer') {
            platforms.deezer.push({ value: metric.value, date })
        }
        // lastfm listeners
        if (metric.metric_type === 'monthly_listeners' && metric.platform === 'musicbrainz') {
            platforms.musicbrainz.push({ value: metric.value, date })
        }
        // genius followers
        if (metric.metric_type === 'followers' && metric.platform === 'genius') {
            platforms.genius.push({ value: metric.value, date })
        }
    })

    // Convert to chart data format with latest values
    const latestData = Object.entries(platforms)
        .filter(([, data]) => data.length > 0)
        .map(([platform, data]) => {
            const sortedData = data.sort((a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            const config = chartConfig[platform as keyof typeof chartConfig]
            return {
                platform,
                value: sortedData[0].value,
                fill: config?.color || '#000000'
            }
        })

    return latestData
}

const chartData = [
    { platform: "youtube", value: 275, fill: "#FF0050" },
    { platform: "spotify", value: 200, fill: "#1DB954" },
    { platform: "deezer", value: 287, fill: "#1DA1F2" },
    { platform: "musicbrainz", value: 173, fill: "#4267B2" },
    { platform: "genius", value: 190, fill: "#4CAF50" }
]

interface PlatformConfig {
    label: string;
    color: string;
}

const chartConfig: Record<string, PlatformConfig> = {
    value: {
        label: "value",
        color: "#000000"
    },
    youtube: {
        label: "Youtube Subscribers",
        color: "#FF0050"
    },
    spotify: {
        label: "Spotify Followers",
        color: "#1DB954"
    },
    deezer: {
        label: "Deezer Fans",
        color: "#1DA1F2"
    },
    musicbrainz: {
        label: "Last.fm Listeners",
        color: "#4267B2"
    },
    genius: {
        label: "Genius Fans",
        color: "#4CAF50"
    },
} as const

type ComparePieChartProps = {
    data: ArtistMetric[]
}

export function ComparePieChart({ data }: ComparePieChartProps) {
    // Get organized metrics data
    const organizedData = React.useMemo(() => organizeMetrics(data), [data])

    // Calculate total from organized data if available, otherwise use static data
    const chartDataToUse = organizedData.length > 0 ? organizedData : chartData

    const totalvalue = React.useMemo(() => {
        return chartDataToUse.reduce((acc, curr) => acc + curr.value, 0)
    }, [chartDataToUse])

    const dateRange = React.useMemo(() => {
        if (!data || data.length === 0) return "No data available"
        // Sort dates in ascending order
        const dates = [...data].sort((a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
        const startDate = formatDate(dates[0].created_at)
        const endDate = formatDate(dates[dates.length - 1].created_at)
        return `${startDate} - ${endDate}`
    }, [data])

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardDescription>{dateRange}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
                    <PieChart>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Pie data={chartDataToUse} dataKey="value" nameKey="platform" innerRadius={75} strokeWidth={2} />
                    </PieChart>
                </ChartContainer>
                <div className="mt-4 text-center">
                    <div className="text-3xl font-bold">
                        {totalvalue.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Total Followers
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">Showing total value for the last 6 months</div>
            </CardFooter>
        </Card>
    )
}

