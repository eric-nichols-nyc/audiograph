"use client";

import { PlatformCard } from "@/components/features/artist-details/platform-card";
import { platformData } from "@/components/features/artist-details/data";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { MetricPieChart } from "@/components/features/charts/metric-pie-chart";
import { useArtistStore } from "@/stores/artist-slug-store";
import { getFormattedArtistMetrics, FormattedMetric } from "@/actions/metrics";
import { use } from "react";

// Cache for storing promises
const metricsCache = new Map<string, Promise<FormattedMetric[]>>();

export function SocialMediaDashboard() {
  const data = platformData || [];
  const artist = useArtistStore((state) => state.artist);
  const artistId = artist?.id;

  if (!artistId) return null;

  // Get or create the promise for this artist
  let metricsPromise = metricsCache.get(artistId);
  if (!metricsPromise) {
    metricsPromise = new Promise<FormattedMetric[]>((resolve) => {
      setTimeout(async () => {
        const metrics = await getFormattedArtistMetrics(artistId);
        resolve(metrics);
      }, 5000);
    });
    metricsCache.set(artistId, metricsPromise);
  }

  const metrics = use(metricsPromise);

  if (!metrics) return <div>No metrics available</div>;

  const formattedMetrics = metrics.map((metric) => {
    const platformInfo = data.find(
      (p) => p.name.toLowerCase() === metric.platform.toLowerCase()
    );
    return {
      ...metric,
      name: platformInfo?.name || metric.platform,
      growth: platformInfo?.growth || 0,
      change: platformInfo?.change || 0,
      icon: metric.platform,
    };
  });

  const totalFans = metrics.reduce((sum, metric) => sum + metric.value, 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl">
          Total fans {totalFans.toLocaleString()}
        </CardTitle>
        <CardDescription>
          Follower and subscriber evolution over the last 28 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Center donut chart */}
          <MetricPieChart artistId={artistId} />

          {/* Platform cards grid */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {formattedMetrics.map((platform) => (
              <PlatformCard key={platform.platform} platform={platform} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
