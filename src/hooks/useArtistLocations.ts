import { useState, useEffect, useCallback } from 'react';
import { LocationData, LocationResponse } from '@/utils/location-data';

interface UseArtistLocationsProps {
  artistSlug: string;
  enabled?: boolean;
}

interface UseArtistLocationsResult {
  data: LocationData[] | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch artist location data
 */
export function useArtistLocations({
  artistSlug,
  enabled = true,
}: UseArtistLocationsProps): UseArtistLocationsResult {
  const [data, setData] = useState<LocationData[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {     
    if (!artistSlug) return;

    setIsLoading(true);
    setError(null);

    try {
      // Fetch data from the API endpoint
      const response = await fetch(`/api/artists/${artistSlug}/locations`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const responseData: LocationResponse = await response.json();

      if (!responseData.success) {
        throw new Error('Unknown API error');
      }

      setData(responseData.topLocations);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch location data'));
    } finally {
      setIsLoading(false);
    }
  }, [artistSlug]);

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [artistSlug, enabled, fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
}
