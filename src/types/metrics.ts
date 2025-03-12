export interface PlatformData {
    platform: string;
    followers: number;
    color: string;
}

export interface ArtistFanbaseData {
    name: string;
    platforms: PlatformData[];
    totalFollowers: number;
}


export interface ArtistMetrics {
    id: string;
    artist_id: string;
    platform: string;
    value: number;
    metric_type: string;
    date: Date;
}
