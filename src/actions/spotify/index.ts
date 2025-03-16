'use server'

import { SpotifyService } from '@/services/spotify-service'
import * as redis from '@/lib/redis'
import { FormattedTrack } from '@/types/track'

/**
 * Format number to abbreviated string (e.g., 1234567 to "1.2M")
 */
function formatNumber(num: number): string {
    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
}

/**
 * Fetches and formats an artist's top tracks from Spotify
 * @param spotifyId The Spotify ID of the artist
 * @param market The market to get tracks for (defaults to 'US')
 */
export async function getArtistTopTracks(spotifyId: string, market: string = 'US'): Promise<FormattedTrack[]> {
    const cacheKey = `spotify:formatted-tracks:${spotifyId}-${market}`
    const cachedTracks = await redis.get<FormattedTrack[]>(cacheKey)

    if (cachedTracks) {
        console.log('Cache hit: Returning cached formatted tracks')
        return cachedTracks
    }

    console.log('Cache miss: Fetching and formatting tracks')
    const spotifyService = new SpotifyService()
    const topTracks = await spotifyService.getArtistTopTracks(spotifyId, market)

    if (!topTracks || topTracks.length === 0) {
        console.log('No tracks found')
        return []
    }

    const tracks = topTracks.map(track => ({
        id: track.id,
        title: track.name,
        artist: track.artists[0].name,
        streams: formatNumber(track.popularity * 10000),
        image: track.album.images[0]?.url || '',
        hasVideo: false
    }))

    // Cache formatted tracks for 1 hour
    await redis.set(cacheKey, tracks, 3600)
    console.log('Cached formatted tracks')

    return tracks
}

