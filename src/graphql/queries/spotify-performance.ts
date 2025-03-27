import { gql } from '@apollo/client';

export const GET_SPOTIFY_PERFORMANCE = gql`
  query GetSpotifyPerformance($ids: [ID!]!) {
    artists(ids: $ids) {
      id
      name
      metrics {
        platform
        metric_type
        value
        date
      }
    }
  }
`;

export interface SpotifyPerformanceData {
    artists: Array<{
        id: string;
        name: string;
        metrics: Array<{
            platform: string;
            metric_type: string;
            value: number;
            date: string;
        }>;
    }>;
}

export interface SpotifyPerformanceVars {
    ids: string[];
} 