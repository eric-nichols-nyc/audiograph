import { useQuery } from '@apollo/client';
import { COMPARE_METRICS, CompareMetricsData, CompareMetricsVars } from '@/graphql/queries/compare-metrics';

export function useCompareArtistsGraphQL(slugs: string[] = []) {
    // Skip if no slugs or if any slug is empty/undefined
    const shouldSkip = !slugs.length || slugs.some(slug => !slug);

    const { data, loading, error } = useQuery<CompareMetricsData, CompareMetricsVars>(
        COMPARE_METRICS,
        {
            variables: { slugs },
            skip: shouldSkip
        }
    );

    return {
        loading,
        error: shouldSkip ? new Error("No artists selected") : error,
        artists: data?.artistsBySlugs || [],
    };
} 