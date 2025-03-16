'use server'

import { unstable_cache } from 'next/cache'
import { createSpotifyService } from '@/services/spotify-service'

interface FormattedTrack {
    id: string
    title: string
    artist: string
    streams: string // We'll format this as "XM" or "XK"
    image: string
    hasVideo: boolean // We might need to determine this from another source
}

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
    return unstable_cache(
        async () => {
            try {
                //console.log('Fetching tracks for artist:', spotifyId)
                const spotifyService = createSpotifyService()
                const topTracks = await spotifyService.getArtistTopTracks(spotifyId, market)
                //console.log('Raw Spotify response:', JSON.stringify(topTracks, null, 2))

                if (!topTracks) {
                    console.error('No tracks found in response')
                    return []
                }

                const formattedTracks = topTracks.map(track => ({
                    id: track.id,
                    title: track.name,
                    artist: track.artists[0].name,
                    streams: formatNumber(track.popularity * 10000),
                    image: track.album.images[0]?.url || '',
                    hasVideo: false
                }))

                // console.log('Formatted tracks:', JSON.stringify(formattedTracks, null, 2))
                return formattedTracks
            } catch (error) {
                console.error('Error fetching artist top tracks:', error)
                throw error
            }
        },
        [`spotify-top-tracks-${spotifyId}-${market}`],
        {
            revalidate: 3600, // Cache for 1 hour
            tags: [`spotify-artist-${spotifyId}`],
        }
    )()
}
