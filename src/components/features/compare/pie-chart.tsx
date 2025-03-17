"use client"

import * as React from "react"
import { Pie, PieChart } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { getFormattedArtistMetrics, type FormattedMetric } from "@/actions/metrics"

const chartConfig = {
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
    }
} as const

interface ComparePieChartProps {
    artistId: string
}

export function ComparePieChart({ artistId }: ComparePieChartProps) {
    const [metrics, setMetrics] = React.useState<FormattedMetric[]>([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)

    React.useEffect(() => {
        async function fetchMetrics() {
            try {
                const formattedMetrics = await getFormattedArtistMetrics(artistId)
                setMetrics(formattedMetrics)
            } catch (err) {
                console.error('Error fetching metrics:', err)
                setError('Failed to load metrics')
            } finally {
                setLoading(false)
            }
        }

        fetchMetrics()
    }, [artistId])

    const totalValue = React.useMemo(() => {
        return metrics.reduce((acc, curr) => acc + curr.value, 0)
    }, [metrics])

    if (loading) {
        return (
            <Card className="flex flex-col">
                <CardContent className="flex items-center justify-center h-[400px]">
                    Loading...
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return (
            <Card className="flex flex-col">
                <CardContent className="flex items-center justify-center h-[400px] text-red-500">
                    {error}
                </CardContent>
            </Card>
        )
    }

    if (!metrics.length) {
        return (
            <Card className="flex flex-col">
                <CardContent className="flex items-center justify-center h-[400px] text-gray-500">
                    No metrics available
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardDescription>Platform Metrics</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
                    <PieChart>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Pie data={metrics} dataKey="value" nameKey="platform" innerRadius={75} strokeWidth={2} />
                    </PieChart>
                </ChartContainer>
                <div className="mt-4 text-center">
                    <div className="text-3xl font-bold">
                        {totalValue.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Total Followers
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="leading-none text-muted-foreground">
                    Showing latest metrics across all platforms
                </div>
            </CardFooter>
        </Card>
    )
}

