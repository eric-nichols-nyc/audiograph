export function MetricsOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-medium">Total Songs</h3>
        <p className="text-3xl font-bold">1,234</p>
      </div>
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-medium">Active Artists</h3>
        <p className="text-3xl font-bold">56</p>
      </div>
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-medium">Total Videos</h3>
        <p className="text-3xl font-bold">128</p>
      </div>
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-medium">Total Playlists</h3>
        <p className="text-3xl font-bold">87</p>
      </div>
    </div>
  );
}
