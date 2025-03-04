// hooks/useArtistQueries.ts
import { useQuery } from '@tanstack/react-query';
import { getArtists } from '@/actions/artists/actions';

type ArtistPlatformStatus = {
    id: string;
    name: string;
    hasSpotify: boolean;
    hasYoutube: boolean;
    spotifyId?: string;
    youtubeId?: string;
  };

// Fetch a list of artists
export function useArtistsQuery(options = {}) {
  return useQuery({
    queryKey: ['artists'],
    queryFn: async () => {
      const data = await getArtists();
      return data;
    },
    ...options
  });
}

// Fetch metrics for all artists
export function useArtistsMetricsQuery() {
    return useQuery({
        queryKey: ['artists', 'platform-status'],
        queryFn: async () => {
          const response = await fetch("/api/admin/artist-platform-status");
          const data = await response.json();
          return data.artists as ArtistPlatformStatus[];
        },
      });
}


// // Fetch metrics for specific artists
export function useArtistMetricsQueryById(artistIds: string[], options = {}) {
  return useQuery({
    queryKey: ['artist-metrics', artistIds],
    queryFn: async () => {
      if (!artistIds.length) return [];
      
      const { data, error } = await supabase
        .from('artist_analytics')
        .select('*')
        .in('artist_id', artistIds)
        .order('date', { ascending: false })
        .limit(1, { foreignTable: 'artist_id' });
      
      if (error) throw error;
      return data;
    },
    enabled: artistIds.length > 0,
    ...options
  });
}