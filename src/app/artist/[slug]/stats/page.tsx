import { AdminLayout } from '@/components/features/admin-layout';
import { getArtistBySlug } from '@/actions/artists/artist';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default async function ArtistStatsPage({ params }: { params: { slug: string } }) {
  const { artist } = await getArtistBySlug(params.slug);

  return (
    <AdminLayout title={`${artist?.name || 'Artist'} Statistics`}>
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Spotify Popularity</CardTitle>
              <CardDescription>Current popularity score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{artist?.popularity || 'N/A'}</div>
              <p className="text-xs text-muted-foreground">+2 points from last month</p>
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
              <CardTitle className="text-sm font-medium">Spotify Followers</CardTitle>
              <CardDescription>Total Spotify followers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{artist?.spotifyFollowers?.toLocaleString() || 'N/A'}</div>
              <p className="text-xs text-muted-foreground">+2.5% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">YouTube Subscribers</CardTitle>
              <CardDescription>Total YouTube subscribers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{artist?.youtubeSubscribers?.toLocaleString() || 'N/A'}</div>
              <p className="text-xs text-muted-foreground">+1.8% from last month</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="growth" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="growth">Growth Trends</TabsTrigger>
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="comparison">Competitor Comparison</TabsTrigger>
          </TabsList>
          
          <TabsContent value="growth" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Follower Growth</CardTitle>
                <CardDescription>Growth across platforms over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center bg-muted/20 rounded-md">
                  <p className="text-muted-foreground">Growth chart will be displayed here</p>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Listener Trend</CardTitle>
                  <CardDescription>Monthly listeners over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                    <p className="text-muted-foreground">Monthly listener chart will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Popularity Score Trend</CardTitle>
                  <CardDescription>Popularity score over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                    <p className="text-muted-foreground">Popularity score chart will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="demographics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Listener Demographics</CardTitle>
                <CardDescription>Age and gender distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center bg-muted/20 rounded-md">
                  <p className="text-muted-foreground">Demographics chart will be displayed here</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
                <CardDescription>Listeners by country</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center bg-muted/20 rounded-md">
                  <p className="text-muted-foreground">Geographic distribution map will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="comparison" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Competitor Comparison</CardTitle>
                <CardDescription>Comparison with similar artists</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center bg-muted/20 rounded-md">
                  <p className="text-muted-foreground">Competitor comparison chart will be displayed here</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Market Position</CardTitle>
                <CardDescription>Position within genre</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center bg-muted/20 rounded-md">
                  <p className="text-muted-foreground">Market position chart will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
} 