export interface Track {
    id: string;
    title: string;
    track_id: string;
    platform: string;
    thumbnail_url: number;
    stream_count_total: number;
    stream_count_daily: number;
}


export interface FormattedTrack {
    id: string
    title: string
    artist: string
    streams: string // We'll format this as "XM" or "XK"
    image: string
    hasVideo: boolean // We might need to determine this from another source
}

export interface SpotifyApiTrack {
    id: string
    name: string
    album: {
        name: string
        images: {
            url: string
        }[]
    }
    artists: {
        name: string
    }[]
    popularity: number
    preview_url: string | null
    external_urls: {
        spotify: string
    }
}
