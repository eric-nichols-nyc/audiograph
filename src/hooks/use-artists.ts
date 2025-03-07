// hooks/use-artists.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getArtists } from '@/actions/artists/artist';

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

  return {
    data: query.data?.data || [],
    isLoading: query.isLoading,
    error: query.error,
    mutate: () => queryClient.invalidateQueries({ queryKey: ['artists'] })
  };
}
