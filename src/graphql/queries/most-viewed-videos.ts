import { gql } from '@apollo/client';

export const GET_MOST_VIEWED_VIDEOS = gql`
  query GetMostViewedVideos($slugs: [String!]!) {
    artistsBySlugs(slugs: $slugs) {
      id
      name
      videos {
        id
        title
        thumbnail_url
        view_count
      }
    }
  }
`;

export interface MostViewedVideosData {
    artistsBySlugs: Array<{
        id: string;
        name: string;
        videos: Array<{
            id: string;
            title: string;
            thumbnail_url: string;
            view_count: number;
        }>;
    }>;
}

export interface MostViewedVideosVars {
    slugs: string[];
} 