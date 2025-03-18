"use server"
import { createClient } from "@/lib/supabase/server";
import * as redis from '@/lib/redis'

export async function getArtistMetrics(id: string) {
    console.log('getArtistMetrics', id);
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('artist_metrics')
        .select('*')
        .eq('artist_id', id)
        .order('date', { ascending: false })

    if (error) {
        console.error('there was an error fetching the artist', error);
        throw new Error(error.message);
    }

    return data;
}

export interface ArtistMetric {
    id: string
    artist_id: string
    platform: string
    metric_type: string
    value: number
    created_at: string
}

export interface FormattedMetric {
    platform: string
    value: number
    fill: string
}

interface PlatformConfig {
    label: string
    color: string
}

const chartConfig: Record<string, PlatformConfig> = {
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
}

export async function getFormattedArtistMetrics(artistId: string): Promise<FormattedMetric[]> {
    try {
        const cacheKey = `artist:${artistId}:formatted-metrics`
        const cachedMetrics = await redis.get<FormattedMetric[]>(cacheKey)
        const CACHE_DURATION = 24 * 60 * 60 // 24 hours in seconds

        // If we have cached data, return it immediately
        if (cachedMetrics) {
            console.log('Cache hit: Returning cached formatted metrics')
            return cachedMetrics
        }

        console.log('Cache miss: Fetching and formatting metrics')
        return await fetchAndFormatMetrics(artistId, cacheKey, CACHE_DURATION)
    } catch (err) {
        console.error('Error getting formatted metrics:', err)
        return []
    }
}

async function fetchAndFormatMetrics(
    artistId: string,
    cacheKey: string,
    cacheDuration: number
): Promise<FormattedMetric[]> {
    const supabase = await createClient()
    const { data: metrics, error } = await supabase
        .from('artist_metrics')
        .select(`
            platform,
            value
        `)
        .eq('artist_id', artistId)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(5) // We only need one record per platform, and we have 5 platforms max

    if (error) {
        throw error
    }

    if (!metrics || metrics.length === 0) {
        console.log('No metrics found')
        return []
    }

    // Get the latest value for each platform
    const latestMetrics = metrics.reduce((acc, metric) => {
        if (!acc[metric.platform]) {
            acc[metric.platform] = metric
        }
        return acc
    }, {} as Record<string, typeof metrics[0]>)

    const formattedMetrics = Object.values(latestMetrics).map(metric => {
        const config = chartConfig[metric.platform as keyof typeof chartConfig]
        return {
            platform: metric.platform,
            value: metric.value,
            fill: config?.color || '#000000'
        }
    })

    // Cache the formatted metrics
    await redis.set(cacheKey, formattedMetrics, cacheDuration)
    console.log('Cached formatted metrics')

    return formattedMetrics
}