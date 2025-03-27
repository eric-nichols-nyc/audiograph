import { gql } from "@apollo/client";

export const COMPARE_ARTIST_METRICS = gql`
    query CompareArtistMetrics($slugs: [String!]!) {
        artistsBySlug(slugs: $slugs) {
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

export interface CompareArtistMetricsData {
    artistsBySlug: Array<{
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

export interface CompareArtistMetricsVars {
    slugs: string[];
} 