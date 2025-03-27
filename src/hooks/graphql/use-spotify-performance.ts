import { useQuery } from '@apollo/client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { GET_SPOTIFY_PERFORMANCE, SpotifyPerformanceData, SpotifyPerformanceVars } from '@/graphql/queries/spotify-performance';
import { getArtistIdFromSlug } from '@/actions/artist';

interface SpotifyMetrics {
    name: string;
    popularity: number;
    monthly_listeners: number;
    followers: number;
    total_streams: number;
}

export function useSpotifyPerformance() {
    const searchParams = useSearchParams();
    const [artistIds, setArtistIds] = useState<string[]>([]);
    const [isLoadingIds, setIsLoadingIds] = useState(true);
    const [idError, setIdError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchArtistIds() {
            setIsLoadingIds(true);
            setIdError(null);

            const entity1 = searchParams.get('entity1');
            const entity2 = searchParams.get('entity2');
            console.log('URL parameters:', { entity1, entity2 });

            if (!entity1 || !entity2) {
                setIdError('Please select two artists to compare');
                setIsLoadingIds(false);
                return;
            }

            try {
                const [id1, id2] = await Promise.all([
                    getArtistIdFromSlug(entity1),
                    getArtistIdFromSlug(entity2)
                ]);

                console.log('Fetched artist IDs:', { id1, id2 });

                if (!id1 || !id2) {
                    setIdError('Could not find one or both artists');
                    setArtistIds([]);
                } else {
                    setArtistIds([id1, id2]);
                }
            } catch (error) {
                console.error('Error fetching artist IDs:', error);
                setIdError('Error fetching artist IDs');
                setArtistIds([]);
            }

            setIsLoadingIds(false);
        }

        fetchArtistIds();
    }, [searchParams]);

    // Then use the IDs to fetch the metrics
    const { data, loading: isLoadingData, error: graphqlError } = useQuery<SpotifyPerformanceData, SpotifyPerformanceVars>(
        GET_SPOTIFY_PERFORMANCE,
        {
            variables: { ids: artistIds },
            skip: artistIds.length === 0 || isLoadingIds
        }
    );

    console.log('GraphQL Query State:', {
        artistIds,
        isLoadingIds,
        isLoadingData,
        idError,
        graphqlError,
        hasData: !!data,
        artistsCount: data?.artists?.length
    });

    // Get the latest metric value for a specific type
    const getLatestMetric = (metrics: SpotifyPerformanceData['artists'][0]['metrics'], type: string) => {
        if (!metrics || !Array.isArray(metrics)) {
            console.log(`No metrics found for type: ${type}`);
            return 0;
        }

        const typeMetrics = metrics.filter(m => m.metric_type === type && m.platform === 'spotify');
        console.log(`Metrics for ${type}:`, {
            total: metrics.length,
            filtered: typeMetrics.length,
            metrics: typeMetrics
        });

        if (!typeMetrics.length) return 0;

        const latest = typeMetrics.reduce((latest, current) => {
            if (!latest || new Date(current.date) > new Date(latest.date)) {
                return current;
            }
            return latest;
        });

        return latest.value;
    };

    // Transform the data into the format expected by the component
    const transformArtistData = (artist: SpotifyPerformanceData['artists'][0]): SpotifyMetrics | null => {
        if (!artist || !artist.metrics) {
            console.log('Invalid artist data:', artist);
            return null;
        }

        return {
            name: artist.name,
            popularity: getLatestMetric(artist.metrics, 'popularity'),
            monthly_listeners: getLatestMetric(artist.metrics, 'monthly_listeners'),
            followers: getLatestMetric(artist.metrics, 'followers'),
            total_streams: getLatestMetric(artist.metrics, 'total_streams')
        };
    };

    const artist1Data = data?.artists?.[0] ? transformArtistData(data.artists[0]) : null;
    const artist2Data = data?.artists?.[1] ? transformArtistData(data.artists[1]) : null;

    // Determine the appropriate error message
    let errorMessage = idError || graphqlError?.message || null;
    if (!errorMessage && !artist1Data && !artist2Data && !isLoadingIds && !isLoadingData) {
        errorMessage = 'Could not load Spotify metrics for both artists';
    }

    console.log('Final state:', {
        artist1Data,
        artist2Data,
        isLoading: isLoadingIds || isLoadingData,
        error: errorMessage
    });

    return {
        artist1Data,
        artist2Data,
        isLoading: isLoadingIds || isLoadingData,
        error: errorMessage
    };
} 