"use client";

import { Card } from "@/components/ui/card";
import { useCompareMetricsChart } from "@/hooks/graphql/use-compare-metrics-chart";
import { formatNumber } from "@/utils/number-format";

export function HorizontalStackedChartGraphQL() {
  const { metrics, artist1Name, artist2Name, loading, error } =
    useCompareMetricsChart();

  if (loading) {
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

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-red-500">Failed to load metrics comparison</div>
      </Card>
    );
  }

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
                      {artist1Name}: {formatNumber(data.artist1.value)}
                    </span>
                  </div>
                  <div
                    className="bg-green-500 flex items-center px-2"
                    style={{ width: `${artist2Percentage}%` }}
                  >
                    <span className="text-white text-sm truncate">
                      {artist2Name}: {formatNumber(data.artist2.value)}
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
