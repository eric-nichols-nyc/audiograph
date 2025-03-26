'use client';

import { useQuery } from '@apollo/client';
import { GET_ARTIST_DETAILS } from '@/graphql/queries/artist';

export function useArtistDetails(artistId: string) {
    return useQuery(GET_ARTIST_DETAILS, {
        variables: { id: artistId },
        // Skip if no artistId
        skip: !artistId,
        // Cache for 1 hour
        fetchPolicy: 'cache-and-network',
    });
} 