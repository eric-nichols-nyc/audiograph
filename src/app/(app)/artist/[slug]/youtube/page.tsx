import { DailyViews } from '@/components/features/artist-youtube-tab/daily-views';
import { PerformanceCard } from '@/components/features/artist-youtube-tab/performance-card';


export default async function YoutubeMetricsPage() {
  return (
    <div className="flex flex-col gap-6 h-full pt-4">
      <div className="flex-1 h-full">
        <PerformanceCard />
      </div>
      <div className="flex-1 h-full">
        <DailyViews />
      </div>
    </div>
  );
} 