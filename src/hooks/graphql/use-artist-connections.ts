import { useQuery } from '@apollo/client';
import { getArtistIdFromSlug } from '@/actions/artist';
import { useEffect, useState } from 'react';
import {
    GET_ARTIST_CONNECTIONS,
    GetArtistConnectionsData,
    GetArtistConnectionsVars
} from '@/graphql/queries/artist-connections';

interface UseArtistConnectionsProps {
    entity1Slug: string | null;
    entity2Slug: string | null;
}

export function useArtistConnections({ entity1Slug, entity2Slug }: UseArtistConnectionsProps) {
    const [artistIds, setArtistIds] = useState<string[]>([]);
    const [isLoadingIds, setIsLoadingIds] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    // Handle hydration
    useEffect(() => {
        setIsClient(true);
    }, []);

    // First get the artist IDs from slugs
    useEffect(() => {
        if (!isClient) {
            console.log('Waiting for hydration...');
            return;
        }

        console.log('Fetching artist IDs with slugs:', { entity1Slug, entity2Slug });
        console.log('Current artistIds:', artistIds);

        async function fetchArtistIds() {
            setIsLoadingIds(true);
            setError(null);

            if (!entity1Slug && !entity2Slug) {
                console.log('No slugs provided, skipping fetch');
                setIsLoadingIds(false);
                return;
            }

            try {
                console.log('Starting ID fetch for slugs:', { entity1Slug, entity2Slug });
                const ids = await Promise.all([
                    entity1Slug ? getArtistIdFromSlug(entity1Slug) : null,
                    entity2Slug ? getArtistIdFromSlug(entity2Slug) : null
                ]);

                console.log('Received IDs:', ids);
                const validIds = ids.filter((id): id is string => id !== null);
                console.log('Valid IDs:', validIds);
                setArtistIds(validIds);
            } catch (err) {
                console.error('Error fetching artist IDs:', err);
                setError('Failed to fetch artist IDs');
            } finally {
                setIsLoadingIds(false);
            }
        }

        fetchArtistIds();
    }, [entity1Slug, entity2Slug, isClient]);

    const {
        data,
        loading: isLoadingConnections,
        error: queryError
    } = useQuery<GetArtistConnectionsData, GetArtistConnectionsVars>(
        GET_ARTIST_CONNECTIONS,
        {
            variables: { ids: artistIds },
            skip: artistIds.length === 0 || isLoadingIds,
        }
    );

    console.log('Query state:', {
        artistIds,
        isLoadingIds,
        isLoadingConnections,
        skip: artistIds.length === 0 || isLoadingIds,
        data: data?.artistConnections || []
    });

    return {
        connections: data?.artistConnections || [],
        isLoading: !isClient || isLoadingIds || isLoadingConnections,
        error: error || queryError?.message || null
    };
} 