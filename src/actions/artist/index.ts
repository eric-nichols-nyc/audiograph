import { createClient } from "@/lib/supabase/server";

export async function getArtist(slug: string) {
    console.log('getArtist', slug);
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('slug', slug)
        .single();

    console.log('artist/actions = ', data);

    if (error) {
        console.error('there was an error fetching the artist', error);
        throw new Error(error.message);
    }

    return data;
}