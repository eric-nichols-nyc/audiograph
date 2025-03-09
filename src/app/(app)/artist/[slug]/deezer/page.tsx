import { PerformanceCard } from '@/components/performance-card';
import { MetricLineChart } from '@/components/features/charts/metric-line-chart';
import { DeezerIcon } from '@/components/icons';
import { followersData } from '@/components/features/charts/deezer-data';

const metrics = [
  {
    label: "Followers",
    value: "104M",
    subLabel: "Total"
  }
]
export default async function ArtistMetricsPage() {
  return (
    <div className="flex flex-col gap-6 h-full pt-4">
      <div className="flex-1 h-full">
        <PerformanceCard
          metrics={metrics}
          color="#A238FF"
          title="Deezer Performance"
          icon={<DeezerIcon />}
        />
      </div>
      <div className="flex-1 h-full">
        <MetricLineChart
          color="#A238FF"
          title="Deezer Performance"
          svgIcon={<DeezerIcon />}
          data={followersData}
          dataKey="followers"
          tooltipLabel="Followers"
          description="Deezer followers count over time"
        />
      </div>
    </div>
  );
} 