// src/hooks/useArtistDetails.ts

import { useQuery } from '@apollo/client';
import { GET_ARTIST_DETAILS } from '@/graphql/queries/artist';

export function useArtistDetails(artistId: string) {
    return useQuery(GET_ARTIST_DETAILS, {
        variables: { id: artistId },
        // Optional: configure caching
        fetchPolicy: 'cache-and-network',
    });
}