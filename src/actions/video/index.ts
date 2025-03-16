"use server"
import { createBrowserSupabase } from "@/lib/supabase/client"
import * as redis from '@/lib/redis'
import { Video } from "@/types/video"


export const getVideosByArtist = async (artistId: string, limit: number = 6): Promise<Video[]> => {
    try {
        // Check cache first
        const cacheKey = `artist:${artistId}:videos:${limit}`
        const cachedVideos = await redis.get<Video[]>(cacheKey)

        if (cachedVideos) {
            console.log('Cache hit: Returning cached videos for artist:', artistId)
            return cachedVideos.slice(0, limit)
        }

        console.log('Cache miss: Fetching videos from database for artist:', artistId)
        const supabase = createBrowserSupabase()

        // First, get video IDs from artist_videos table
        const { data: artistVideos, error: artistVideosError } = await supabase
            .from('artist_videos')
            .select('video_id')
            .eq('artist_id', artistId)
            .limit(limit)

        if (artistVideosError) {
            console.error('Error fetching artist videos:', artistVideosError)
            return []
        }

        if (!artistVideos || artistVideos.length === 0) {
            return []
        }

        // Extract video IDs
        const videoIds = artistVideos.map(av => av.video_id)

        // Then fetch the actual videos
        const { data: videos, error: videosError } = await supabase
            .from('videos')
            .select('*')
            .in('id', videoIds)
            .limit(limit)

        if (videosError) {
            console.error('Error fetching videos:', videosError)
            return []
        }

        const fetchedVideos = videos || []

        // Cache the videos - we can use a long TTL since videos won't change
        // 1 week = 604800 seconds
        await redis.set(cacheKey, fetchedVideos, 604800)
        console.log('Cached videos for artist:', artistId)

        return fetchedVideos
    } catch (err) {
        console.error('Error in getVideosByArtist:', err)
        return []
    }
}
