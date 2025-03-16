'use server';

import { createClient } from "@/lib/supabase/server";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { Artist } from "@/types/artist";

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

/**
 * Get similar artists for a specific artist, sorted by similarity score
 * @param {string} artistId - The UUID of the source artist
 * @param {number} limit - Maximum number of similar artists to return (default: 10)
 * @returns {Promise<Array>} - Array of similar artists with similarity data
 */
export async function getSimilarArtists(artistId: string, limit = 10) {
    const supabase = createBrowserSupabase();
    const { data, error } = await supabase
        .from('artist_similarities')
        .select(`
        similarity_score,
        metadata,
        similar_artist:artist2_id(
          id, 
          name,
          image_url,
          genres
        )
      `)
        .eq('artist1_id', artistId)
        .order('similarity_score', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching similar artists:', error);
        return [];
    }

    // Transform the result to a more convenient format
    return data.map(item => ({
        ...item.similar_artist,
        similarity_score: item.similarity_score,
        similarity_factors: item.metadata?.factors || {}
    }));
}

/**
 * Get artist with their platform IDs
 * @param {string} slug - The slug of the artist
 * @returns {Promise<Artist>} - Artist data including platform IDs
 */
export async function getArtistWithPlatformIds(slug: string): Promise<Artist> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('artists')
        .select(`
            *,
            artist_platform_ids (
                platform,
                platform_id
            )
        `)
        .eq('slug', slug)
        .single();

    if (error) {
        console.error('Error fetching artist with platform IDs:', error);
        throw new Error(error.message);
    }

    return data;
}