"use client";

import { Card } from "@/components/ui/card";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { useSearchParams } from "next/navigation";
import { formatNumber } from "@/utils/number-format";

interface Metric {
  platform: string;
  metric_type: string;
  value: number;
  date: string;
}

const COMPARE_METRICS = gql`
  query CompareArtistMetrics($slugs: [String!]!) {
    artistsBySlugs(slugs: $slugs) {
      id
      name
      metrics {
        platform
        metric_type
        value
        date
      }
    }
  }
`;

export function HorizontalStackedBarChart() {
  const searchParams = useSearchParams();
  const entity1 = searchParams.get("entity1");
  const entity2 = searchParams.get("entity2");

  console.log("Component - URL params:", { entity1, entity2 });

  const { data, loading, error } = useQuery(COMPARE_METRICS, {
    variables: {
      slugs: [entity1, entity2].filter(Boolean),
    },
    skip: !entity1 || !entity2,
  });

  console.log("Component - GraphQL response:", { data, loading, error });

  if (loading) {
    console.log("Component - Loading state");
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (error || !data?.artistsBySlugs || data.artistsBySlugs.length < 2) {
    console.log("Component - Error or insufficient data:", {
      error,
      artistsData: data?.artistsBySlugs,
    });
    return (
      <Card className="p-6">
        <div className="text-red-500">Failed to load metrics comparison</div>
      </Card>
    );
  }

  const [artist1, artist2] = data.artistsBySlugs;
  console.log("Component - Artists data:", { artist1, artist2 });

  // Get latest metric value for a specific type
  const getLatestMetric = (metrics: Metric[], type: string) => {
    console.log("Component - Getting latest metric:", { metrics, type });
    const typeMetrics = metrics.filter((m) => m.metric_type === type);
    if (!typeMetrics.length) return 0;

    const latest = typeMetrics.reduce((latest, current) => {
      if (!latest.date || new Date(current.date) > new Date(latest.date)) {
        return current;
      }
      return latest;
    });
    console.log("Component - Latest metric result:", {
      type,
      value: latest.value,
    });
    return latest.value;
  };

  const metrics = {
    monthly_listeners: {
      artist1: {
        name: artist1.name,
        value: getLatestMetric(artist1.metrics, "monthly_listeners"),
      },
      artist2: {
        name: artist2.name,
        value: getLatestMetric(artist2.metrics, "monthly_listeners"),
      },
    },
    followers: {
      artist1: {
        name: artist1.name,
        value: getLatestMetric(artist1.metrics, "followers"),
      },
      artist2: {
        name: artist2.name,
        value: getLatestMetric(artist2.metrics, "followers"),
      },
    },
    popularity: {
      artist1: {
        name: artist1.name,
        value: getLatestMetric(artist1.metrics, "popularity"),
      },
      artist2: {
        name: artist2.name,
        value: getLatestMetric(artist2.metrics, "popularity"),
      },
    },
  };

  console.log("Component - Transformed metrics:", metrics);

  const metricLabels = {
    monthly_listeners: "Monthly Listeners",
    followers: "Followers",
    popularity: "Popularity",
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Metrics Comparison</h3>
        <div className="space-y-4">
          {Object.entries(metrics).map(([metricKey, data]) => {
            const total = data.artist1.value + data.artist2.value;
            const artist1Percentage = (data.artist1.value / total) * 100;
            const artist2Percentage = (data.artist2.value / total) * 100;

            return (
              <div key={metricKey} className="space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>
                    {metricLabels[metricKey as keyof typeof metricLabels]}
                  </span>
                  <span className="text-gray-400">
                    Total: {formatNumber(total)}
                  </span>
                </div>
                <div className="h-8 flex rounded-lg overflow-hidden">
                  <div
                    className="bg-blue-500 flex items-center px-2"
                    style={{ width: `${artist1Percentage}%` }}
                  >
                    <span className="text-white text-sm truncate">
                      {data.artist1.name}: {formatNumber(data.artist1.value)}
                    </span>
                  </div>
                  <div
                    className="bg-green-500 flex items-center px-2"
                    style={{ width: `${artist2Percentage}%` }}
                  >
                    <span className="text-white text-sm truncate">
                      {data.artist2.name}: {formatNumber(data.artist2.value)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
