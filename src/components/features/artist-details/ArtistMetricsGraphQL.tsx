"use client";

import { gql, useQuery } from "@apollo/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const GET_ARTIST_METRICS = gql`
  query GetArtist($id: ID!) {
    artist(id: $id) {
      name
      metrics {
        value
        metric_type
        platform
        date
      }
    }
  }
`;

interface ArtistMetricsProps {
  artistId: string;
}

export function ArtistMetricsGraphQL({ artistId }: ArtistMetricsProps) {
  const { loading, error, data } = useQuery(GET_ARTIST_METRICS, {
    variables: { id: artistId },
  });

  console.log("metrics data", data);

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error.message}</div>;
  if (!data?.artist) return <div>No artist found</div>;

  interface Metric {
    value: number;
    metric_type: string;
    platform: string;
    date: string;
  }

  type MetricsByType = {
    [key: string]: Metric;
  };

  const latestMetrics = data.artist.metrics.reduce(
    (acc: MetricsByType, metric: Metric) => {
      if (
        !acc[metric.metric_type] ||
        new Date(metric.date) > new Date(acc[metric.metric_type].date)
      ) {
        acc[metric.metric_type] = metric;
      }
      return acc;
    },
    {} as MetricsByType
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Object.values(latestMetrics).map((metric: Metric) => (
        <div key={metric.metric_type} className="p-4 rounded-lg border bg-card">
          <h3 className="font-semibold">{metric.metric_type}</h3>
          <p className="text-2xl">{metric.value.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date(metric.date).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
