'use server';

import { createClient } from "@/lib/supabase/server";
import { createBrowserSupabase } from "@/lib/supabase/client";
import * as redis from '@/lib/redis'
import { CACHE_TTL } from '@/lib/redis';
import { Artist } from "@/types/artist";

interface SimilarArtistResponse {
    similarity_score: number;
    similar_artist: {
        id: string;
        name: string;
        image_url: string;
        genres: string[];
    };
}

interface SimilarArtist {
    id: string;
    name: string;
    image_url: string;
    genres: string[];
    similarity_score: number;
}

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
export async function getSimilarArtists(artistId: string, limit = 10): Promise<SimilarArtist[]> {
    console.log('getSimilarArtists called with artistId:', artistId, 'limit:', limit);

    const cacheKey = `artist:${artistId}:similar:${limit}`;
    console.log('Checking cache with key:', cacheKey);
    const cachedData = await redis.get<SimilarArtist[]>(cacheKey);

    if (cachedData) {
        console.log('Cache hit: Returning cached similar artists:', cachedData);
        return cachedData;
    }

    console.log('Cache miss: Fetching from database for artist:', artistId);
    const supabase = createBrowserSupabase();

    console.log('Executing Supabase query...');
    const { data, error } = await supabase
        .from('similar_artists')
        .select(`
            similarity_score,
            similar_artist:artists!similar_artists_artist2_id_fkey (
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
        console.error('Database error:', error);
        return [];
    }

    console.log('Raw database response:', data);

    // Transform the result to a more convenient format
    const similarArtists = (data as unknown as SimilarArtistResponse[]).map((item: SimilarArtistResponse): SimilarArtist => ({
        id: item.similar_artist.id,
        name: item.similar_artist.name,
        image_url: item.similar_artist.image_url,
        genres: item.similar_artist.genres,
        similarity_score: item.similarity_score
    }));

    console.log('Transformed similar artists:', similarArtists);

    // Cache the results
    console.log('Caching results...');
    await redis.set(cacheKey, similarArtists, CACHE_TTL.ARTIST);

    return similarArtists;
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


export async function getArtistId(slug: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('artists')
        .select('id')
        .eq('slug', slug)
        .single()

    if (error) {
        console.error('Error fetching artist ID:', error)
        return null
    }

    return data?.id
}
export async function getArtistNameClient(id: string) {
    const supabase = await createBrowserSupabase()
    const { data, error } = await supabase
        .from('artists')
        .select('name')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching artist name:', error)
        return null
    }

    return data?.name
}

export async function getArtistNameServer(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('artists')
        .select('name')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching artist name:', error)
        return null
    }

    return data?.name
}

export async function getArtistIdFromSlug(slug: string): Promise<string | null> {
    console.log('Getting artist ID for slug:', slug);
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('artists')
        .select('id')
        .eq('slug', slug)
        .single();

    if (error || !data) {
        console.error('Error fetching artist ID:', error);
        return null;
    }

    console.log('Found artist ID:', data.id);
    return data.id;
}