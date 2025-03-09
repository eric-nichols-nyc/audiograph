import { PerformanceCard } from '@/components/features/artist-youtube-tab/performance-card';
import { MetricLineChart } from '@/components/features/charts/metric-line-chart';
import { monthlyListenersData } from '@/components/features/charts/youtube-data';
// YouTube icon component
const YouTubeIcon = ({ color = "#E5234A" }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ color }}
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="currentColor" />
  </svg>
);

// Sample metrics data
const metrics = [
  { label: "Video Likes", value: "80.6M", subLabel: "Current" },
  { label: "Subscribers", value: "104M", subLabel: "Total" },
  { label: "Channel Views", value: "92%", subLabel: "Current" },
];

export default async function YoutubeMetricsPage() {
  return (
    <div className="flex flex-col gap-6 h-full pt-4">
      <div className="flex-1 h-full">
        <PerformanceCard
          color="#E5234A"
          title="YouTube Performance"
          icon={<YouTubeIcon />}
          metrics={metrics}
        />
      </div>
      <div className="flex-1 h-full">
        <MetricLineChart
          color="#E5234A"
          title="YouTube Performance"
          svgIcon={<YouTubeIcon />}
          data={monthlyListenersData}
          dataKey="monthly_listeners"
          tooltipLabel="Monthly Listeners"
          description="YouTube monthly listener count over time"
        />
      </div>
    </div>
  );
} 