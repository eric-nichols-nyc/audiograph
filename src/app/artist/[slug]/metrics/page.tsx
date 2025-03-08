import { AdminLayout } from '@/components/features/admin-layout';
import { getArtistBySlug } from '@/actions/artists/artist';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default async function ArtistMetricsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { artist } = await getArtistBySlug(slug);

  return (
    <AdminLayout title={`${artist?.name || 'Artist'} Metrics`}>
      <Tabs defaultValue="spotify" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="spotify">Spotify</TabsTrigger>
          <TabsTrigger value="youtube">YouTube</TabsTrigger>
          <TabsTrigger value="instagram">Instagram</TabsTrigger>
          <TabsTrigger value="tiktok">TikTok</TabsTrigger>
        </TabsList>
        
        <TabsContent value="spotify" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Followers</CardTitle>
                <CardDescription>Total Spotify followers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{artist?.spotifyFollowers?.toLocaleString() || 'N/A'}</div>
                <p className="text-xs text-muted-foreground">+2.5% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Monthly Listeners</CardTitle>
                <CardDescription>Current monthly listeners</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{artist?.monthlyListeners?.toLocaleString() || 'N/A'}</div>
                <p className="text-xs text-muted-foreground">+5.2% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Popularity</CardTitle>
                <CardDescription>Spotify popularity score</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{artist?.popularity || 'N/A'}</div>
                <p className="text-xs text-muted-foreground">+1 point from last month</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Follower Growth</CardTitle>
              <CardDescription>Spotify follower growth over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                <p className="text-muted-foreground">Follower growth chart will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="youtube" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
                <CardDescription>Total YouTube subscribers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{artist?.youtubeSubscribers?.toLocaleString() || 'N/A'}</div>
                <p className="text-xs text-muted-foreground">+1.8% from last month</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>View Count</CardTitle>
              <CardDescription>YouTube view count over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                <p className="text-muted-foreground">View count chart will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="instagram" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Followers</CardTitle>
                <CardDescription>Total Instagram followers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{artist?.instagramFollowers?.toLocaleString() || 'N/A'}</div>
                <p className="text-xs text-muted-foreground">+3.2% from last month</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Engagement Rate</CardTitle>
              <CardDescription>Instagram engagement over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                <p className="text-muted-foreground">Engagement chart will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tiktok" className="space-y-6">
          <div className="h-[400px] flex items-center justify-center bg-muted/20 rounded-md">
            <p className="text-muted-foreground">TikTok metrics coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
} 