interface MetricsOverviewProps {
  songCount: number;
  artistCount: number;
  videoCount: number;
  articleCount: number;
}

export function MetricsOverview({ 
  songCount = 0, 
  artistCount = 0, 
  videoCount = 0, 
  articleCount = 0 
}: MetricsOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-medium">Total Songs</h3>
        <p className="text-3xl font-bold">{songCount.toLocaleString()}</p>
      </div>
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-medium">Active Artists</h3>
        <p className="text-3xl font-bold">{artistCount.toLocaleString()}</p>
      </div>
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-medium">Total Videos</h3>
        <p className="text-3xl font-bold">{videoCount.toLocaleString()}</p>
      </div>
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-medium">Total Articles</h3>
        <p className="text-3xl font-bold">{articleCount.toLocaleString()}</p>
      </div>
    </div>
  );
}
