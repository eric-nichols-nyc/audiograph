import { gql } from '@apollo/client';
import { Video } from '@/types/video';

export interface ArtistVideoJoin {
  video_id: string;
  videos: Video;
}

export interface GetArtistVideosData {
  artist: {
    id: string;
    name: string;
    artist_videos: ArtistVideoJoin[];
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
      artist_videos {
        video_id
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
  }
`;

export interface GetAllVideosData {
  videos: {
    id: string;
    title: string;
    thumbnail_url: string;
    published_at: string;
    artist: {
      id: string;
      name: string;
      slug: string;
      image_url: string;
    };
  }[];
}

export const GET_ALL_VIDEOS = gql`
  query GetAllVideos {
    videos {
      id
      title
      thumbnail_url
      published_at
      artist {
        id
        name
        slug
        image_url
      }
    }
  }
`;