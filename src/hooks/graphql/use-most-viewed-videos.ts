import { useQuery } from '@apollo/client';
import { useSearchParams } from 'next/navigation';
import { GET_MOST_VIEWED_VIDEOS, MostViewedVideosData, MostViewedVideosVars } from '@/graphql/queries/most-viewed-videos';

interface VideoData {
    title: string;
    thumbnailUrl: string;
    views: number;
    artistName: string;
}

export function useMostViewedVideos() {
    const searchParams = useSearchParams();
    const artist1 = searchParams.get('artist1');
    const artist2 = searchParams.get('artist2');

    const slugs = [artist1, artist2].filter(Boolean) as string[];
    const shouldSkip = !slugs.length || slugs.some(slug => !slug);

    const { data, loading, error } = useQuery<MostViewedVideosData, MostViewedVideosVars>(
        GET_MOST_VIEWED_VIDEOS,
        {
            variables: { slugs },
            skip: shouldSkip
        }
    );

    // Transform the data into the format expected by the component
    const videos: VideoData[] = !data ? [] : data.artistsBySlugs.map(artist => {
        // Get the most viewed video for this artist
        const mostViewedVideo = artist.videos.reduce((max, current) =>
            current.view_count > max.view_count ? current : max
            , artist.videos[0]);

        return {
            title: mostViewedVideo?.title || '',
            thumbnailUrl: mostViewedVideo?.thumbnail_url || '',
            views: mostViewedVideo?.view_count || 0,
            artistName: artist.name
        };
    });

    return {
        videos,
        isLoading: loading,
        error: error?.message || null
    };
} 