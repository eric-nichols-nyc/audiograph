export interface SpotifyArtist {
    spotify_id: string
    name: string
    image_url: string
    genres: string[]
    popularity: number
    followers: number
}

export interface SpotifyTrack {
    id: string
    name: string
    image_url: string
    popularity: number
}