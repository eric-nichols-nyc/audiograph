import { gql } from "@apollo/client";

export const COMPARE_METRICS = gql`
    query CompareArtistMetrics($slugs: [String!]!) {
        artistsBySlugs(slugs: $slugs) {
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

export interface CompareMetricsData {
    artistsBySlugs: Array<{
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

export interface CompareMetricsVars {
    slugs: string[];
} 