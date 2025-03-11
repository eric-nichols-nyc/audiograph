export interface ArtistMetric {
    id: string
    artist_id?: string
    date: Date;
    platform: string
    metric_type: 'followers' | 'views' | 'likes' | 'subscribers' | 'monthly_listeners' | 'daily_view_count' | 'daily_stream_count' | 'total_views' | 'total_streams' | 'popularity'
    value: number
}

export interface Artist {
    id?: string
    is_complete?: boolean
    name: string
    slug: string
    rank?: number | null
    genres?: string[] | null
    rank_change?: number | null
    last_rank_update?: string | null
    bio: string | null
    gender: string | null
    country: string | null
    birth_date: string | null
    image_url: string | null
}

export interface ArtistPlatformIds {
    platform: string;
    platform_id: string;
}
