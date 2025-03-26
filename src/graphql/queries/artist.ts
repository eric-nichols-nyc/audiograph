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
    tracks {
      id
      title
      plays
      image
      platform
    }
  }
`;

// Fragment for video fields
export const ARTIST_VIDEOS_FRAGMENT = gql`
  fragment ArtistVideos on Artist {
    videos {
      id
      title
      views
      thumbnail
      url
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
    }
  }
  ${ARTIST_METRICS_FRAGMENT}
  ${ARTIST_TRACKS_FRAGMENT}
  ${ARTIST_VIDEOS_FRAGMENT}
`;