import { gql } from '@apollo/client';

export interface Track {
  id: string;
  title: string;
  thumbnail_url: string;
  stream_count_total: string;
  platform: string;
  track_id: string;
}

export interface GetArtistTracksData {
  artist: {
    id: string;
    name: string;
    topTracks: Track[];
  };
}

export interface GetArtistTracksVars {
  id: string;
}

export const GET_ARTIST_TRACKS = gql`
  query GetArtistTracks($id: ID!) {
    artist(id: $id) {
      id
      name
      topTracks {
        id
        title
        thumbnail_url
        stream_count_total
        platform
        track_id
      }
    }
  }
`;

export interface GetAllTracksData {
  tracks: {
    id: string;
    title: string;
    thumbnail_url: string;
    stream_count_total: string;
    platform: string;
    track_id: string;
    artist: {
      id: string;
      name: string;
      slug: string;
      image_url: string;
    };
  }[];
}

export const GET_ALL_TRACKS = gql`
  query GetAllTracks {
    tracks {
      id
      title
      thumbnail_url
      stream_count_total
      platform
      track_id
      artist {
        id
        name
        slug
        image_url
      }
    }
  }
`; 