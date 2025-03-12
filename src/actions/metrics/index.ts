"use server"
import { createClient } from "@/lib/supabase/server";

export async function getArtistMetrics(id: string) {
    console.log('getArtistMetrics', id);
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('artist_metrics')
        .select('*')
        .eq('artist_id', id)
        .order('date', { ascending: false })
    console.log('metrics/actions = ', data);

    if (error) {
        console.error('there was an error fetching the artist', error);
        throw new Error(error.message);
    }

    return data;
}