import { gql } from '@apollo/client';

export interface Video {
    id: string;
    title: string;
    video_id: string;
    platform: string;
    view_count: string;
    daily_view_count?: string;
    thumbnail_url: string;
    published_at?: string;
}

export interface GetArtistVideosData {
    artist: {
        id: string;
        name: string;
        videos: Video[];
    };
}

export interface GetArtistVideosVars {
    id: string;
}

export const GET_ARTIST_VIDEOS = gql`
  query GetArtistVideos($id: ID!) {
    artist(id: $id) {
      id
      name
      videos {
        id
        title
        video_id
        platform
        view_count
        daily_view_count
        thumbnail_url
        published_at
      }
    }
  }
`; 