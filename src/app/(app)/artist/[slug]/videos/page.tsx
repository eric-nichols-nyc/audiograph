import { AdminLayout } from '@/components/features/admin-layout';
import { getArtistBySlug } from '@/actions/artists/artist';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VideoCard } from '@/components/video-card';
// Mock data for videos - in a real app, this would come from an API
const mockVideos = [
  {
    id: '1',
    title: 'Music Video One',
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    publishDate: '2023-06-15',
    views: 2450000,
    likes: 125000,
    duration: '4:12',
    platform: 'youtube'
  },
  {
    id: '2',
    title: 'Music Video Two',
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    publishDate: '2023-02-28',
    views: 1850000,
    likes: 95000,
    duration: '3:45',
    platform: 'youtube'
  },
  {
    id: '3',
    title: 'Live Performance',
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    publishDate: '2022-11-10',
    views: 980000,
    likes: 65000,
    duration: '5:30',
    platform: 'youtube'
  },
  {
    id: '4',
    title: 'Behind the Scenes',
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    publishDate: '2023-07-05',
    views: 750000,
    likes: 42000,
    duration: '8:15',
    platform: 'youtube'
  },
  {
    id: '5',
    title: 'Short Clip',
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    publishDate: '2024-01-15',
    views: 3250000,
    likes: 285000,
    duration: '0:45',
    platform: 'tiktok'
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
                {mockVideos.reduce((sum, video) => sum + video.views, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
              <CardDescription>Combined likes across all videos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockVideos.reduce((sum, video) => sum + video.likes, 0).toLocaleString()}
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
              {mockVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="youtube" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mockVideos
                .filter((video) => video.platform === 'youtube')
                .map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="tiktok" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mockVideos
                .filter((video) => video.platform === 'tiktok')
                .map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

