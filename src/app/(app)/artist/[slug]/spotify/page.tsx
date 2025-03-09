import { MonthlyListenersChart } from '@/components/features/artist-spotify-tab/monthly-listeners-chart';
import { SpotifyPerformanceCard } from '@/components/features/artist-spotify-tab/spotify-performance-card';
export default async function ArtistMetricsPage() {
  return (
    <div className="flex gap-6 h-full pt-4">
      <div className="flex-[2] h-full">
        <MonthlyListenersChart />
      </div>
      <div className="flex-1 h-full">
        <SpotifyPerformanceCard />
      </div>
    </div>
  );
} 