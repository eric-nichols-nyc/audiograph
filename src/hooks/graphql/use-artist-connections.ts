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

    // First get the artist IDs from slugs
    useEffect(() => {
        async function fetchArtistIds() {
            setIsLoadingIds(true);
            setError(null);

            if (!entity1Slug && !entity2Slug) {
                setIsLoadingIds(false);
                return;
            }

            try {
                const ids = await Promise.all([
                    entity1Slug ? getArtistIdFromSlug(entity1Slug) : null,
                    entity2Slug ? getArtistIdFromSlug(entity2Slug) : null
                ]);

                const validIds = ids.filter((id): id is string => id !== null);
                setArtistIds(validIds);
            } catch (err) {
                console.error('Error fetching artist IDs:', err);
                setError('Failed to fetch artist IDs');
            } finally {
                setIsLoadingIds(false);
            }
        }

        fetchArtistIds();
    }, [entity1Slug, entity2Slug]);

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

    return {
        connections: data?.artistConnections || [],
        isLoading: isLoadingIds || isLoadingConnections,
        error: error || queryError?.message || null
    };
} 