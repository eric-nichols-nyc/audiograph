// hooks/useArtistQuery.ts
import { useQuery } from '@tanstack/react-query';
import { createBrowserSupabase } from '@/lib/supabase/client';

export function useArtistQuery(artistId?: string) {
    return useQuery({
        queryKey: ['artist', artistId],
        queryFn: async () => {
            if (!artistId) return null;
            const supabase = createBrowserSupabase();
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