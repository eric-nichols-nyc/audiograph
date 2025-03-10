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