interface DeezerArtist {
    id: number
    name: string
    link: string
    picture: string
    picture_small: string
    picture_medium: string
    picture_big: string
    picture_xl: string
    nb_album: number
    nb_fan: number
    radio: boolean
    tracklist: string
    type: string
}

interface DeezerTrack {
    id: number
    title: string
    preview: string
}

interface DeezerSearchResponse {
    data: DeezerArtist[]
    total: number
    next?: string
}

interface DeezerTopTracksResponse {
    data: DeezerTrack[]
}

export class DeezerService {
    private static readonly BASE_URL = "https://api.deezer.com"

    /**
     * Search for a single artist by name
     * @param artistName The name of the artist to search for
     * @returns The first matching artist or null if not found
     */
    static async getArtist(artistName: string): Promise<DeezerArtist | null> {
        try {
            const response = await fetch(`${this.BASE_URL}/search?q=${encodeURIComponent(artistName)}&limit=1&type=artist`)
            if (!response.ok) {
                throw new Error(`Deezer API error: ${response.statusText}`)
            }
            const data: DeezerSearchResponse = await response.json()
            return data.data[0] || null
        } catch (error) {
            console.error("Error fetching Deezer artist:", error)
            return null
        }
    }

    /**
     * Search for multiple artists by name
     * @param artistNames Array of artist names to search for
     * @returns Array of found artists, maintaining the order of input names
     */
    static async getArtists(artistNames: string[]): Promise<(DeezerArtist | null)[]> {
        try {
            const promises = artistNames.map(name => this.getArtist(name))
            return await Promise.all(promises)
        } catch (error) {
            console.error("Error fetching multiple Deezer artists:", error)
            return artistNames.map(() => null)
        }
    }

    /**
     * Get a preview track for an artist
     * @param artistName The name of the artist
     * @returns Preview URL or null if not found
     */
    static async getArtistPreview(artistName: string): Promise<string | null> {
        try {
            const artist = await this.getArtist(artistName)
            if (!artist) return null

            const response = await fetch(`${this.BASE_URL}/artist/288166/top?limit=1`)
            if (!response.ok) {
                throw new Error(`Deezer API error: ${response.statusText}`)
            }
            const data: DeezerTopTracksResponse = await response.json()
            return data.data[0]?.preview || null
        } catch (error) {
            console.error("Error fetching artist preview:", error)
            return null
        }
    }
}
