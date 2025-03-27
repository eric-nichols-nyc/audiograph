import { useQuery } from "@apollo/client";
import { useSearchParams } from "next/navigation";
import { COMPARE_ARTIST_METRICS } from "@/graphql/queries/compare-metrics";

export function useCompareArtistsGraphQL() {
    const searchParams = useSearchParams();
    const entity1Slug = searchParams.get("entity1");
    const entity2Slug = searchParams.get("entity2");

    const slugs = [entity1Slug, entity2Slug].filter(Boolean) as string[];

    const { data, loading, error } = useQuery(COMPARE_ARTIST_METRICS, {
        variables: { slugs },
        skip: slugs.length === 0
    });

    return {
        artists: data?.artistsBySlug || [],
        loading,
        error
    };
} 