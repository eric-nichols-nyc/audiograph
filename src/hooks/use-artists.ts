'use client';

// hooks/use-artists.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getArtists } from '@/actions/artists/artist';
import { Artist } from '@/types/artist';

export function useArtists() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['artists'],
    queryFn: async () => {
      try {
        return await getArtists();
      } catch (error) {
        console.error('Error fetching artists:', error);
        throw error;
      }
    }
  });

  // Safely extract artists data
  const artistsData = query?.data?.data?.data;
  const artists = Array.isArray(artistsData) ? artistsData as Artist[] : [];

  return {
    data: artists,
    isLoading: query.isLoading,
    error: query.error,
    mutate: () => queryClient.invalidateQueries({ queryKey: ['artists'] })
  };
}
