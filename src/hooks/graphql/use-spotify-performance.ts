import { useSearchParams } from 'next/navigation';
import { SpotifyPerformanceData } from '@/graphql/queries/spotify-performance';
import { useCompareArtistsGraphQL } from './use-compare-artists-graphql';

interface SpotifyMetrics {
    name: string;
    popularity: number;
    monthly_listeners: number;
    followers: number;
    total_streams: number;
}

export function useSpotifyPerformance() {
    const searchParams = useSearchParams();
    const entity1 = searchParams.get('entity1');
    const entity2 = searchParams.get('entity2');

    const slugs = [entity1, entity2].filter(Boolean) as string[];
    const { artists, loading: isLoadingArtists, error: artistError } = useCompareArtistsGraphQL(slugs);

    // Get the latest metric value for a specific type
    const getLatestMetric = (metrics: SpotifyPerformanceData['artists'][0]['metrics'], type: string) => {
        if (!metrics || !Array.isArray(metrics)) {
            console.log(`No metrics found for type: ${type}`);
            return 0;
        }

        const typeMetrics = metrics.filter(m => m.metric_type === type && m.platform === 'spotify');
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

    const artist1Data = artists?.[0] ? transformArtistData(artists[0]) : null;
    const artist2Data = artists?.[1] ? transformArtistData(artists[1]) : null;

    // Determine the appropriate error message
    let errorMessage = artistError?.message || null;
    if (!errorMessage && !artist1Data && !artist2Data && !isLoadingArtists) {
        errorMessage = 'Could not load Spotify metrics for both artists';
    }

    console.log('Spotify Performance state:', {
        artist1Data,
        artist2Data,
        isLoading: isLoadingArtists,
        error: errorMessage,
        slugs
    });

    return {
        artist1Data,
        artist2Data,
        isLoading: isLoadingArtists,
        error: errorMessage
    };
} 