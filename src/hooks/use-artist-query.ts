// hooks/useArtistQuery.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useArtistQuery(artistId?: string) {
    return useQuery({
        queryKey: ['artist', artistId],
        queryFn: async () => {
            if (!artistId) return null;
            const { data, error } = await supabase
                .from('artists')
                .select('*')
                .eq('id', artistId)
                .single();

            if (error) throw error;
            return data;
        },
        enabled: !!artistId,
    });
}