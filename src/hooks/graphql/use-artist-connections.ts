import { useQuery } from '@apollo/client';
import { useSearchParams } from 'next/navigation';
import { getArtistIdFromSlug } from '@/actions/artist';
import { useEffect, useState } from 'react';
import {
    GET_ARTIST_CONNECTIONS,
    GetArtistConnectionsData,
    GetArtistConnectionsVars
} from '@/graphql/queries/artist-connections';

export function useArtistConnections() {
    const searchParams = useSearchParams();
    const [artistIds, setArtistIds] = useState<string[]>([]);
    const [isLoadingIds, setIsLoadingIds] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // First get the artist IDs from slugs
    useEffect(() => {
        async function fetchArtistIds() {
            setIsLoadingIds(true);
            setError(null);

            const entity1 = searchParams.get('entity1');
            const entity2 = searchParams.get('entity2');

            if (!entity1 && !entity2) {
                setIsLoadingIds(false);
                return;
            }

            try {
                const ids = await Promise.all([
                    entity1 ? getArtistIdFromSlug(entity1) : null,
                    entity2 ? getArtistIdFromSlug(entity2) : null
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
    }, [searchParams]);

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