export interface ArtistMetric {
    id: string
    artist_id?: string
    date: Date;
    platform: string
    metric_type: 'followers' | 'views' | 'likes' | 'subscribers' | 'monthly_listeners' | 'daily_view_count' | 'daily_stream_count' | 'total_views' | 'total_streams' | 'popularity'
    value: number
}

export interface Artist {
    id : string;
    name: string;
    image_url: string; 
    genres: string[];
    country: string;
    spotifyFollowers?: number;
    monthlyListeners?: number;
    youtubeSubscribers?: number; 
    instagramFollowers?: number; 
    popularity?: number;
}

export interface ArtistPlatformIds {
    platform: string;
    platform_id: string;
}
