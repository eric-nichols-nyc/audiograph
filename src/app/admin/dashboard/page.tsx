import { AdminLayout } from "@/components/features/admin-layout";
import { ArtistMetricsTable } from "@/components/features/admin-dashbaord/artists-table/artists-metrics-table";
import { ActivityLogContent } from "@/components/features/admin-dashbaord/recent-activity-log";
import { MetricsOverview } from "@/components/features/admin-dashbaord/metrics-overview";
import { createClient } from "@/lib/supabase/server";
import { Artist, ArtistMetric } from '@/types/artist';

export default async function Dashboard() {
  const supabase = await createClient();

  // Fetch initial artists data on the server
  const { data: artists } = await supabase
    .from("artists")
    .select("id, name, image_url, genres, country, rank")
    .order("rank")
    .limit(5);
    
  const artistIds = artists?.map((artist) => artist.id) || [];
  
  // Fetch metrics and sort by date
  const { data: allMetrics } = await supabase
    .from("artist_metrics")
    .select("*")
    .in("artist_id", artistIds)
    .order("date", { ascending: false });
    
  // Group metrics by artist_id
  const metricsGroupedByArtist = artistIds.reduce((acc, artistId) => {
    // Filter metrics for this artist and sort by date (newest first)
    const artistMetrics = allMetrics?.filter(metric => metric.artist_id === artistId) || [];
    
    // Add to accumulator
    acc[artistId] = artistMetrics;
    return acc;
  }, {} as Record<string, ArtistMetric[]>);

  // Fetch counts for metrics overview
  const [
    { count: songCount },
    { count: artistCount },
    { count: videoCount },
    { count: articleCount }
  ] = await Promise.all([
    supabase.from("tracks").select("*", { count: "exact", head: true }),
    supabase.from("artists").select("*", { count: "exact", head: true }),
    supabase.from("videos").select("*", { count: "exact", head: true }),
    supabase.from("artist_articles").select("*", { count: "exact", head: true })
  ]);

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-4">
        <MetricsOverview 
          songCount={songCount || 0}
          artistCount={artistCount || 0}
          videoCount={videoCount || 0}
          articleCount={articleCount || 0}
        />

        <ActivityLogContent />
        <ArtistMetricsTable
        initialArtists={artists as Artist[] || []}
        artistMetrics={metricsGroupedByArtist}
      />
      </div>
    </AdminLayout>
  );
}
