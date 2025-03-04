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
      .select(`
        *,
        artist_platform_ids (
          platform,
          platform_id
        )
      `);
    
    // console.log('Artists data:', data); // Debug log
    
    if (error) {
      console.error("Error fetching artists:", error);
      throw error;
    }

    return { 
      data: Array.isArray(data) ? data : [] 
    };
  });
