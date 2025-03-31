'use client';

// hooks/use-artists.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getArtists } from '@/actions/artists/artist';

// interface Artist {
//   id: string;
//   name: string;
//   slug: string;
//   image_url?: string;
//   genres?: string[];
// }

// interface ArtistsResponse {
//   artists: Artist[];
// }

export function useArtists() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['artists'],
    queryFn: async () => {
      try {
        const response = await getArtists({});
        return response;
      } catch (error) {
        console.error('Error fetching artists:', error);
        throw error;
      }
    }
  });

  // Safely extract artists data
  const artists = Array.isArray(query.data?.data) ? query.data.data : [];

  return {
    data: artists,
    isLoading: query.isLoading,
    error: query.error,
    mutate: () => queryClient.invalidateQueries({ queryKey: ['artists'] })
  };
}
