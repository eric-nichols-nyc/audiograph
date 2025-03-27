"use server"

import { createBrowserSupabase } from "@/lib/supabase/client";

type SpotifyMetrics = {
    name: string;
    popularity: number;
    monthly_listeners: number;
    followers: number;
    total_streams: number;
}

type MetricRecord = {
    value: number;
    metric_type: string;
    date: string;
}

export async function getSpotifyData(slug: string): Promise<SpotifyMetrics | null> {
    const supabase = createBrowserSupabase();

    // First get the artist details using the slug
    const { data: artistData, error: artistError } = await supabase
        .from('artists')
        .select('id, name')
        .eq('slug', slug)
        .single();

    if (artistError) {
        console.error('Error fetching artist:', artistError);
        throw artistError;
    }

    if (!artistData) {
        console.error('Artist not found with slug:', slug);
        return null;
    }

    const { data, error } = await supabase
        .from('artist_metrics')
        .select(`
            value,
            metric_type,
            date
        `)
        .eq('artist_id', artistData.id)
        .eq('platform', 'spotify')
        .in('metric_type', ['popularity', 'monthly_listeners', 'followers', 'total_streams'])
        .order('date', { ascending: false });

    if (error) {
        console.error('Error fetching Spotify metrics:', error);
        throw error;
    }

    if (!data || data.length === 0) return null;

    // Get latest value for each metric type
    const latestMetrics = data.reduce((acc, curr) => {
        if (!acc[curr.metric_type] || new Date(curr.date) > new Date(acc[curr.metric_type].date)) {
            acc[curr.metric_type] = curr;
        }
        return acc;
    }, {} as Record<string, MetricRecord>);

    // Transform into final format
    const metrics: SpotifyMetrics = {
        name: artistData.name,
        popularity: latestMetrics['popularity']?.value || 0,
        monthly_listeners: latestMetrics['monthly_listeners']?.value || 0,
        followers: latestMetrics['followers']?.value || 0,
        total_streams: latestMetrics['total_streams']?.value || 0
    };

    return metrics;
}