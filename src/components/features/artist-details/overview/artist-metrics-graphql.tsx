"use client";
import Image from "next/image";
import { useQuery } from "@apollo/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { GET_ARTIST_DETAILS } from "@/graphql/queries/artist";
import {
  calculateSpotifyFollowersTrend,
  type MetricPoint,
  type TrendResult,
} from "@/lib/trends";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, LineChart, Line } from "recharts";
import { ArrowUp, ArrowDown } from "lucide-react";

interface ArtistMetricsProps {
  artistId: string;
}

interface Metric {
  value: number;
  metric_type: string;
  platform: string;
  date: string;
}

type MetricsByType = {
  [key: string]: Metric[];
};

interface FilteredMetricsProps {
  metrics: Metric[];
  excludedTypes?: string[];
}

interface FilteredMetricsCardProps {
  metric: Metric;
  platform: string;
  trendValue: number;
  isComplete: boolean;
  metrics: Metric[];
}

function FilteredMetricsCard({
  metric,
  platform,
  trendValue,
  isComplete,
  metrics,
}: FilteredMetricsCardProps) {
  const formatMetricType = (metricType: string): string => {
    return metricType
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Calculate trend percentage
  const trendPercentage =
    metric.value > 0 ? (trendValue / metric.value) * 100 : 0;
  const isPositive = trendValue > 0;

  // Prepare data for the mini chart
  const chartData = metrics
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((m) => ({
      date: new Date(m.date).toLocaleDateString(),
      value: m.value,
    }));

  return (
    <div className="w-[300px] flex-none p-4 rounded-lg border bg-card">
      <div className="flex items-center gap-2">
        <Image
          src={`/images/icons/platforms/${platform}.svg`}
          alt={platform}
          width={10}
          height={10}
        />
        <h3 className="font-semibold">
          {formatMetricType(metric.metric_type)}
        </h3>
      </div>
      <p className="text-2xl">
        {metric.metric_type.includes("view") || metric.platform === "genius"
          ? parseInt(metric.value.toString()).toLocaleString()
          : metric.value.toLocaleString()}
      </p>
      {trendValue !== 0 && (
        <div className="flex items-center gap-2 mt-1">
          <Badge variant={isPositive ? "default" : "destructive"}>
            {isPositive ? (
              <ArrowUp className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDown className="h-3 w-3 mr-1" />
            )}
            {Math.abs(trendPercentage).toFixed(1)}%
          </Badge>
          <span className="text-sm text-muted-foreground">
            ({isPositive ? "+" : ""}
            {trendValue.toLocaleString()})
          </span>
        </div>
      )}
      <div className="h-[100px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={isPositive ? "#22c55e" : "#ef4444"}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between items-center mt-2">
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date(metric.date).toLocaleDateString()}
        </p>
        <p className="text-sm text-muted-foreground">
          {isComplete ? "28-day trend" : "Partial trend"}
        </p>
      </div>
    </div>
  );
}

function FilteredMetrics({
  metrics,
  excludedTypes = [
    "total_views",
    "daily_stream_count",
    "daily_view_count",
    "total_streams",
  ],
}: FilteredMetricsProps) {
  // Filter out excluded metric types
  const filteredMetrics = metrics.filter(
    (metric: Metric) => !excludedTypes.includes(metric.metric_type)
  );

  // Group metrics by platform and type
  const metricsByType = filteredMetrics.reduce(
    (acc: MetricsByType, metric: Metric) => {
      const key = `${metric.platform}_${metric.metric_type}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(metric);
      return acc;
    },
    {} as MetricsByType
  );

  console.log("metricsByType", metricsByType);

  // Calculate trends for each metric group
  const trendsData = Object.entries(metricsByType).reduce(
    (acc: { [key: string]: TrendResult }, [key, metrics]) => {
      // Convert Metric[] to MetricPoint[]
      const metricPoints: MetricPoint[] = (metrics as Metric[]).map((m) => ({
        value: m.value,
        date: m.date,
      }));
      acc[key] = calculateSpotifyFollowersTrend(metricPoints);
      return acc;
    },
    {}
  );

  // Get the most recent metric for each type and sort by platform
  const sortedMetrics = Object.values(metricsByType)
    .map((metrics: Metric[]) => {
      // Sort by date descending and take the most recent
      return [...metrics].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0];
    })
    .sort((a: Metric, b: Metric) => {
      // First sort by platform
      if (a.platform < b.platform) return -1;
      if (a.platform > b.platform) return 1;
      // Then by metric type
      return a.metric_type.localeCompare(b.metric_type);
    });

  return (
    <div className="space-y-8">
      {["spotify", "deezer", "youtube", "genius"].map((platform) => {
        const platformMetrics = sortedMetrics.filter(
          (metric: Metric) => metric.platform === platform
        );
        if (platformMetrics.length === 0) return null;

        return (
          <div key={platform} className="space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src={`/images/icons/platforms/${platform}.svg`}
                alt={platform}
                width={20}
                height={20}
              />
              <h2 className="text-lg font-semibold capitalize">
                {platform} Metrics
              </h2>
            </div>
            <div className="w-full rounded-md border">
              <div className="flex space-x-4 p-4 overflow-x-auto scrollbar-thin scrollbar-track-muted scrollbar-thumb-muted-foreground">
                {platformMetrics.map((metric: Metric) => {
                  const key = `${metric.platform}_${metric.metric_type}`;
                  const trendData = trendsData[key];
                  const trendValue = trendData?.trend || 0;
                  const isComplete = trendData?.isComplete || false;
                  const metricHistory = metricsByType[key] || [];

                  return (
                    <FilteredMetricsCard
                      key={key}
                      metric={metric}
                      platform={platform}
                      trendValue={trendValue}
                      isComplete={isComplete}
                      metrics={metricHistory}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ArtistMetricsGraphQL({ artistId }: ArtistMetricsProps) {
  const { loading, error, data, networkStatus } = useQuery(GET_ARTIST_DETAILS, {
    variables: { id: artistId },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      console.log("🔵 Query completed - Data from network or cache:", {
        networkStatus,
        data,
      });
    },
  });

  console.log("metrics data", data);

  if (loading) {
    console.log("🟡 Loading data...", { networkStatus });
    return <LoadingSpinner />;
  }
  if (error) return <div>Error: {error.message}</div>;
  if (!data?.artist) return <div>No artist found</div>;

  return <FilteredMetrics metrics={data.artist.metrics} />;
}
