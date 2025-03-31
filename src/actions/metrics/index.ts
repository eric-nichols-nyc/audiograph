"use server"
import { createClient } from "@/lib/supabase/server";
import * as redis from '@/lib/redis'

export async function getArtistMetrics(id: string) {
    // console.log('getArtistMetrics', id);
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

        if (cachedMetrics) {
            console.log('Cache hit: Returning cached formatted metrics')
            return cachedMetrics
        }

        console.log('Cache miss: Fetching and formatting metrics')

        const supabase = await createClient()
        const { data: metrics, error } = await supabase
            .from('artist_metrics')
            .select('*')
            .eq('artist_id', artistId)
            .order('created_at', { ascending: false })

        if (error) {
            throw error
        }

        if (!metrics || metrics.length === 0) {
            console.log('No metrics found')
            return []
        }

        const platforms = {
            spotify: [] as { value: number; date: string }[],
            youtube: [] as { value: number; date: string }[],
            deezer: [] as { value: number; date: string }[],
            musicbrainz: [] as { value: number; date: string }[],
            genius: [] as { value: number; date: string }[]
        }

        // Group metrics by platform
        metrics.forEach((metric: ArtistMetric) => {
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
        const formattedMetrics = Object.entries(platforms)
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

        // Cache formatted metrics for 1 hour
        await redis.set(cacheKey, formattedMetrics, 3600)
        console.log('Cached formatted metrics')

        return formattedMetrics
    } catch (err) {
        console.error('Error getting formatted metrics:', err)
        return []
    }
}