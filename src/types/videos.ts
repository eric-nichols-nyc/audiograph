export interface Video {
    id: string;
    video_id: string;
    title: string;
    view_count: number;
    daily_view_count: number;
    published_at: string;
    thumbnail_url: string;
    views: number;
    artist_name: string;
}


export interface ArtistVideo {
    artist_id: string;
    video_id: string;
}