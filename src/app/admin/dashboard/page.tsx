import { AdminLayout } from "@/components/features/admin-layout";
import { ArtistMetricsTable } from "@/components/features/admin-dashbaord/artists-table/artists-metrics-table";
export default function Dashboard() {   
    return (
        <AdminLayout title="Dashboard">
            <div className="space-y-4">
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
                        <h3 className="text-lg font-medium">Revenue</h3>
                        <p className="text-3xl font-bold">$12,345</p>
                    </div>
                </div>
                
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="text-primary">JD</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium">John Doe uploaded a new album</p>
                                <p className="text-xs text-muted-foreground">2 hours ago</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="text-primary">JS</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium">Jane Smith updated her profile</p>
                                <p className="text-xs text-muted-foreground">5 hours ago</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="text-primary">RJ</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium">Robert Johnson joined as an artist</p>
                                <p className="text-xs text-muted-foreground">1 day ago</p>
                            </div>
                        </div>
                    </div>
                </div>
                <ArtistMetricsTable initialArtists={[]} artistMetrics={{}} />
            </div>
        </AdminLayout>
    );
}
