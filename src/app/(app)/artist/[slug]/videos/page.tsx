import { AdminLayout } from '@/components/features/admin-layout';
import { getArtistBySlug } from '@/actions/artists/artist';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// Mock data for videos - in a real app, this would come from an API
const mockVideos = [
  {
    id: "1",
    title: "Summer Concert Highlights",
    description: "Highlights from the summer concert series",
    url: "https://youtube.com/watch?v=123",
    thumbnail_url: "https://i.ytimg.com/vi/123/maxresdefault.jpg",
    platform: "youtube",
    platform_id: "123",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    view_count: 1000,
  },
  {
    id: "2",
    title: "Behind the Scenes",
    description: "A look behind the scenes of our latest music video",
    url: "https://youtube.com/watch?v=456",
    thumbnail_url: "https://i.ytimg.com/vi/456/maxresdefault.jpg",
    platform: "youtube",
    platform_id: "456",
    created_at: "2024-01-02T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z",
    view_count: 1000,
  },
  {
    id: "3",
    title: "Live at Madison Square Garden",
    description: "Full concert performance at MSG",
    url: "https://youtube.com/watch?v=789",
    thumbnail_url: "https://i.ytimg.com/vi/789/maxresdefault.jpg",
    platform: "youtube",
    platform_id: "789",
    created_at: "2024-01-03T00:00:00Z",
    updated_at: "2024-01-03T00:00:00Z",
    view_count: 1000,
  },
];

export default async function ArtistVideosPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { artist } = await getArtistBySlug(slug);

  return (
    <AdminLayout title={`${artist?.name || 'Artist'} Videos`}>
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
              <CardDescription>Number of videos across platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockVideos.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <CardDescription>Combined views across all videos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockVideos.reduce((sum, video) => sum + video.view_count, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="all">All Videos</TabsTrigger>
            <TabsTrigger value="youtube">YouTube</TabsTrigger>
            <TabsTrigger value="tiktok">TikTok</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* {mockVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))} */}
              videos go here...
            </div>
          </TabsContent>

          <TabsContent value="youtube" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* {mockVideos
                .filter((video) => video.platform === 'youtube')
                .map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))} */}
              videos go here...
            </div>
          </TabsContent>

          <TabsContent value="tiktok" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* {mockVideos
                .filter((video) => video.platform === 'tiktok')
                .map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))} */}
              videos go here...
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

