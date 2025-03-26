"use server";

import { createClient } from "@/lib/supabase/server";

interface GetArtistsParams {
  slug?: string;
}

export async function getArtists({ slug }: GetArtistsParams = {}) {
  const supabase = await createClient();

  let query = supabase.from("artists").select(`*`);

  // If slug is provided, filter by it
  if (slug) {
    query = query.eq('slug', slug);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching artists:", error);
    throw error;
  }

  return {
    data: Array.isArray(data) ? data : []
  };
}

export async function getArtistBySlug(slug: string) {
  const supabase = await createClient();

  // Get basic artist info
  const { data: artist } = await supabase
    .from('artists')
    .select('*')
    .eq('slug', slug)
    .single()

  // Get platform IDs
  const { data: platformIds } = await supabase
    .from('artist_platform_ids')
    .select('*')
    .eq('artist_id', artist.id)

  return {
    artist,
    platformIds
  }
}
