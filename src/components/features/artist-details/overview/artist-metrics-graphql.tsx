"use client";
import Image from "next/image";
import { useQuery } from "@apollo/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { GET_ARTIST_DETAILS } from "@/graphql/queries/artist";

interface ArtistMetricsProps {
  artistId: string;
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

  interface Metric {
    value: number;
    metric_type: string;
    platform: string;
    date: string;
  }

  type MetricsByPlatformAndType = {
    [key: string]: Metric;
  };

  const latestMetrics = data.artist.metrics.reduce(
    (acc: MetricsByPlatformAndType, metric: Metric) => {
      // Create a unique key combining platform and metric type
      const key = `${metric.platform}_${metric.metric_type}`;

      if (!acc[key] || new Date(metric.date) > new Date(acc[key].date)) {
        acc[key] = metric;
      }
      return acc;
    },
    {} as MetricsByPlatformAndType
  );

  const formatMetricType = (metricType: string): string => {
    return metricType
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Sort metrics to group by platform
  const sortedMetrics = Object.values(latestMetrics).sort(
    (a: Metric, b: Metric) => {
      // First sort by platform
      if (a.platform < b.platform) return -1;
      if (a.platform > b.platform) return 1;
      // Then by metric type
      return a.metric_type.localeCompare(b.metric_type);
    }
  );

  return (
    <div className="space-y-8">
      {["spotify", "deezer", "youtube", "genius"].map((platform) => {
        const platformMetrics = sortedMetrics.filter(
          (metric: Metric) => metric.platform === platform
        );
        if (platformMetrics.length === 0) return null;

        return (
          <div key={platform}>
            <div className="flex items-center gap-2 mb-4">
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {platformMetrics.map((metric: Metric) => (
                <div
                  key={`${metric.platform}_${metric.metric_type}`}
                  className="p-4 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">
                      {formatMetricType(metric.metric_type)}
                    </h3>
                  </div>
                  <p className="text-2xl">
                    {metric.metric_type.includes("view") ||
                    metric.platform === "genius"
                      ? parseInt(metric.value.toString()).toLocaleString()
                      : metric.value.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Last updated: {new Date(metric.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
