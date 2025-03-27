import { useSearchParams } from "next/navigation";
import { useCompareArtistsGraphQL } from "./use-compare-artists-graphql";
import { ApolloError } from "@apollo/client";

interface Metric {
    value: number;
    metric_type: string;
    date: string;
    platform: string;
}

interface ChartMetric {
    name: string;
    value: number;
}

interface ChartData {
    artist1Name: string;
    artist2Name: string;
    metrics: {
        [key: string]: {
            artist1: ChartMetric;
            artist2: ChartMetric;
        };
    };
    loading: boolean;
    error: ApolloError | Error | null;
}

export function useCompareMetricsChart(): ChartData {
    const searchParams = useSearchParams();
    const entity1 = searchParams.get("entity1");
    const entity2 = searchParams.get("entity2");

    const slugs = [entity1, entity2].filter(Boolean) as string[];
    const { artists, loading, error } = useCompareArtistsGraphQL(slugs);

    if (loading) {
        return {
            artist1Name: "",
            artist2Name: "",
            metrics: {},
            loading,
            error
        };
    }

    if (error || !artists || artists.length < 2) {
        return {
            artist1Name: "",
            artist2Name: "",
            metrics: {},
            loading: false,
            error: error || new Error("Not enough artists data")
        };
    }

    const [artist1, artist2] = artists;

    // Get the latest metrics for each type
    const getLatestMetric = (metrics: Metric[], type: string) => {
        const typeMetrics = metrics.filter(m => m.metric_type === type);
        if (!typeMetrics.length) return { value: 0, date: "" };

        return typeMetrics.reduce((latest, current) => {
            if (!latest.date || new Date(current.date) > new Date(latest.date)) {
                return current;
            }
            return latest;
        });
    };

    // Transform metrics into chart format
    const metricsData: ChartData["metrics"] = {
        monthly_listeners: {
            artist1: {
                name: artist1.name,
                value: getLatestMetric(artist1.metrics, "monthly_listeners").value
            },
            artist2: {
                name: artist2.name,
                value: getLatestMetric(artist2.metrics, "monthly_listeners").value
            }
        },
        followers: {
            artist1: {
                name: artist1.name,
                value: getLatestMetric(artist1.metrics, "followers").value
            },
            artist2: {
                name: artist2.name,
                value: getLatestMetric(artist2.metrics, "followers").value
            }
        },
        popularity: {
            artist1: {
                name: artist1.name,
                value: getLatestMetric(artist1.metrics, "popularity").value
            },
            artist2: {
                name: artist2.name,
                value: getLatestMetric(artist2.metrics, "popularity").value
            }
        }
    };

    return {
        artist1Name: artist1.name,
        artist2Name: artist2.name,
        metrics: metricsData,
        loading: false,
        error: null
    };
} 