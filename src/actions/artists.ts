"use server"

import { createClient } from "@/lib/supabase/server"
export async function getArtistName(id: string) {
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