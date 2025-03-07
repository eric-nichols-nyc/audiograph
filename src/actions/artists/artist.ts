"use server";

import { createClient } from "@/lib/supabase/server";
import { actionClient } from "@/lib/safe-action";

export const getArtists = actionClient
  .action(async () => {
    const supabase = await createClient();
    
    // Add console.log for debugging
    console.log('Fetching artists...');
    
    const { data, error } = await supabase
      .from("artists")
      .select(`*`);
    
    // console.log('Artists data:', data); // Debug log
    
    if (error) {
      console.error("Error fetching artists:", error);
      throw error;
    }

    return { 
      data: Array.isArray(data) ? data : [] 
    };
  });


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
