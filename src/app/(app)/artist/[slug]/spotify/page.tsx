import { MonthlyListenersChart } from '@/components/features/artist-spotify-tab/monthly-listeners-chart';
import { SpotifyPerformanceCard } from '@/components/features/artist-spotify-tab/spotify-performance-card';
import { FollowersChart } from '@/components/features/artist-spotify-tab/followers-chart';
import { AudienceRetention } from '@/components/features/artist-spotify-tab/audience-rentention-chart';
export default async function ArtistMetricsPage() {
  return (
    <div className="flex flex-col gap-6 h-full p-4">
      <div className="flex-1 h-full">
        <SpotifyPerformanceCard />
      </div>
      <div>
        <div className="flex flex-col gap-3">
          <div className="flex-1 h-full">
            <MonthlyListenersChart />
          </div>
          <div className="flex-[1 h-full">
            <FollowersChart />
          </div>
          <div className="flex-1 h-full">
            <AudienceRetention />
          </div>
        </div>
      </div>

    </div>
  );
} 