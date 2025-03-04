"use server";

import { actionClient } from "@/lib/safe-action";
import { createClient } from "@/lib/supabase/server";
export const getArtistsMetricsById = actionClient.action(async () => {
    // get artist 
  const supabase = await createClient();  
  // Add console.log for debugging

});