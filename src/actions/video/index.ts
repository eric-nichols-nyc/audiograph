"use server"
import { createBrowserSupabase } from "@/lib/supabase/client"
import * as redis from '@/lib/redis'
import { Video } from "@/types/video"


export const getVideosByArtist = async (artistId: string, limit: number = 10): Promise<Video[]> => {
    try {
        // Check cache first
        const cacheKey = `artist:${artistId}:videos:${limit}`
        const cachedVideos = await redis.get<Video[]>(cacheKey)

        if (cachedVideos) {
            console.log('Cache hit: Returning cached videos for artist:', artistId)
            return cachedVideos
        }

        console.log('Cache miss: Fetching videos from database for artist:', artistId)
        const supabase = createBrowserSupabase()

        // Join artist_videos and videos tables to get all data in one query
        const { data, error } = await supabase
            .from('artist_videos')
            .select(`
                video_id,
                videos(*)
            `)
            .eq('artist_id', artistId)

        if (error) {
            console.error('Error fetching artist videos:', error)
            return []
        }

        if (!data || data.length === 0) {
            return []
        }

        // Extract and format the videos with the right structure
        const videos = data
            .filter(item => item.videos) // Filter out any null video references
            .map(item => {
                const video = item.videos as unknown as Video;
                return {
                    id: video.id,
                    video_id: video.video_id,
                    title: video.title,
                    view_count: video.view_count,
                    daily_view_count: video.daily_view_count,
                    thumbnail_url: video.thumbnail_url,
                    published_at: video.published_at,
                    platform: video.platform
                };
            }) as Video[]

        // Sort by view_count in descending order (highest views first)
        const sortedVideos = videos.sort((a: Video, b: Video) =>
            parseInt(b.view_count || '0') - parseInt(a.view_count || '0')
        )

        // Take only the requested number of videos
        const topVideos = sortedVideos.slice(0, limit)

        // Cache the videos for 30 seconds
        await redis.set(cacheKey, topVideos, 30)
        console.log('Cached top videos for artist:', artistId, '(expires in 30 seconds)')

        return topVideos
    } catch (err) {
        console.error('Error in getVideosByArtist:', err)
        return []
    }
}

export const clearArtistVideosCache = async (artistId: string, limit: number = 10): Promise<boolean> => {
    try {
        const cacheKey = `artist:${artistId}:videos:${limit}`
        await redis.del(cacheKey)
        console.log(`Cache cleared for artist: ${artistId} with limit: ${limit}`)
        return true
    } catch (err) {
        console.error('Error clearing artist videos cache:', err)
        return false
    }
}