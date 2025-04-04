// src/graphql/queries/artist.ts

import { gql } from '@apollo/client';

// Fragment for reusable metric fields
export const ARTIST_METRICS_FRAGMENT = gql`
  fragment ArtistMetrics on Artist {
    metrics {
      value
      metric_type
      platform
      date
    }
  }
`;

// Fragment for track fields
export const ARTIST_TRACKS_FRAGMENT = gql`
  fragment ArtistTracks on Artist {
    topTracks {
      id
      title
      stream_count_total
      thumbnail_url
      track_id
      platform
    }
  }
`;

// Fragment for video fields
export const ARTIST_VIDEOS_FRAGMENT = gql`
  fragment ArtistVideos on Artist {
    artist_videos {
      videos {
        id
        video_id
        title
        view_count
        daily_view_count
        published_at
        thumbnail_url
        platform
      }
    }
  }
`;

// Fragment for similar artists
export const SIMILAR_ARTISTS_FRAGMENT = gql`
  fragment SimilarArtists on Artist {
    similarArtists {
      id
      name
      similarity_score
      image_url
    }
  }
`;

// Main query that combines everything
export const GET_ARTIST_DETAILS = gql`
  query GetArtistDetails($id: ID!) {
    artist(id: $id) {
      id
      name
      ...ArtistMetrics
      ...ArtistTracks
      ...ArtistVideos
      ...SimilarArtists
    }
  }
  ${ARTIST_METRICS_FRAGMENT}
  ${ARTIST_TRACKS_FRAGMENT}
  ${ARTIST_VIDEOS_FRAGMENT}
  ${SIMILAR_ARTISTS_FRAGMENT}
`;

// Export individual queries for components that need only specific data
export const GET_ARTIST_TRACKS = gql`
  query GetArtistTracks($id: ID!) {
    artist(id: $id) {
      id
      name
      ...ArtistTracks
    }
  }
  ${ARTIST_TRACKS_FRAGMENT}
`;

export const GET_ARTIST_VIDEOS = gql`
  query GetArtistVideos($id: ID!) {
    artist(id: $id) {
      id
      name
      ...ArtistVideos
    }
  }
  ${ARTIST_VIDEOS_FRAGMENT}
`;

export const GET_SIMILAR_ARTISTS = gql`
  query GetSimilarArtists($id: ID!) {
    artist(id: $id) {
      id
      name
      ...SimilarArtists
    }
  }
  ${SIMILAR_ARTISTS_FRAGMENT}
`;