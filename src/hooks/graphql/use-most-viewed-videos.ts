import { useQuery } from '@apollo/client';
import { useSearchParams } from 'next/navigation';
import { GET_ARTIST_VIDEOS, GetArtistVideosData, GetArtistVideosVars } from '@/graphql/queries/videos';
import { useEffect, useState } from 'react';
import { getArtistId } from '@/actions/artist';

interface VideoData {
    title: string;
    thumbnailUrl: string;
    views: number;
    artistName: string;
}

export function useMostViewedVideos() {
    const searchParams = useSearchParams();
    const entity1Slug = searchParams.get('entity1');
    const entity2Slug = searchParams.get('entity2');
    const [artist1Id, setArtist1Id] = useState<string>();
    const [artist2Id, setArtist2Id] = useState<string>();

    // Convert slugs to IDs
    useEffect(() => {
        async function fetchIds() {
            if (entity1Slug) {
                const id = await getArtistId(entity1Slug);
                setArtist1Id(id || undefined);
            }
            if (entity2Slug) {
                const id = await getArtistId(entity2Slug);
                setArtist2Id(id || undefined);
            }
        }
        fetchIds();
    }, [entity1Slug, entity2Slug]);

    console.log('Artist IDs:', { artist1Id, artist2Id });

    // Query for first artist
    const { data: data1, loading: loading1 } = useQuery<GetArtistVideosData, GetArtistVideosVars>(
        GET_ARTIST_VIDEOS,
        {
            variables: { id: artist1Id || '' },
            skip: !artist1Id
        }
    );

    // Query for second artist
    const { data: data2, loading: loading2 } = useQuery<GetArtistVideosData, GetArtistVideosVars>(
        GET_ARTIST_VIDEOS,
        {
            variables: { id: artist2Id || '' },
            skip: !artist2Id
        }
    );

    console.log('Raw GraphQL responses:', {
        artist1: data1?.artist,
        artist2: data2?.artist
    });

    // Transform the data into the format expected by the component
    const videos: VideoData[] = [];

    // Process first artist's videos
    if (data1?.artist?.artist_videos?.length > 0) {
        console.log('Processing artist 1 videos:', data1.artist.artist_videos);

        // Get all videos and sort them by view count
        const allVideos = data1.artist.artist_videos
            .map(av => av.videos)
            .filter(video => video && video.view_count) // Filter out any null videos
            .sort((a, b) => parseInt(b.view_count) - parseInt(a.view_count));

        console.log('Sorted videos 1:', allVideos);

        if (allVideos.length > 0) {
            const mostViewedVideo = allVideos[0];
            const video = {
                title: mostViewedVideo.title,
                thumbnailUrl: mostViewedVideo.thumbnail_url,
                views: parseInt(mostViewedVideo.view_count),
                artistName: data1.artist.name
            };
            videos.push(video);
            console.log('Added video for artist 1:', video);
        }
    }

    // Process second artist's videos
    if (data2?.artist?.artist_videos?.length > 0) {
        console.log('Processing artist 2 videos:', data2.artist.artist_videos);

        // Get all videos and sort them by view count
        const allVideos = data2.artist.artist_videos
            .map(av => av.videos)
            .filter(video => video && video.view_count) // Filter out any null videos
            .sort((a, b) => parseInt(b.view_count) - parseInt(a.view_count));

        console.log('Sorted videos 2:', allVideos);

        if (allVideos.length > 0) {
            const mostViewedVideo = allVideos[0];
            const video = {
                title: mostViewedVideo.title,
                thumbnailUrl: mostViewedVideo.thumbnail_url,
                views: parseInt(mostViewedVideo.view_count),
                artistName: data2.artist.name
            };
            videos.push(video);
            console.log('Added video for artist 2:', video);
        }
    }

    console.log('Final videos array:', videos);

    return {
        videos,
        isLoading: loading1 || loading2 || (!artist1Id && !!entity1Slug) || (!artist2Id && !!entity2Slug),
        error: null
    };
} 