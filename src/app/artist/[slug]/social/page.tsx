import { AdminLayout } from '@/components/features/admin-layout';
import { getArtistBySlug } from '@/actions/artists/artist';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for social media - in a real app, this would come from an API
const mockSocialData = {
  instagram: {
    followers: 1250000,
    posts: 342,
    engagement: 3.2,
    growth: 2.5,
    handle: '@artistname',
    url: 'https://instagram.com/artistname'
  },
  twitter: {
    followers: 850000,
    tweets: 1250,
    engagement: 1.8,
    growth: 1.2,
    handle: '@artistname',
    url: 'https://twitter.com/artistname'
  },
  tiktok: {
    followers: 2450000,
    videos: 125,
    engagement: 5.7,
    growth: 8.3,
    handle: '@artistname',
    url: 'https://tiktok.com/@artistname'
  },
  facebook: {
    followers: 650000,
    posts: 210,
    engagement: 1.5,
    growth: 0.8,
    handle: 'ArtistName',
    url: 'https://facebook.com/artistname'
  }
};

export default async function ArtistSocialPage({ params }: { params: { slug: string } }) {
  const { artist } = await getArtistBySlug(params.slug);

  return (
    <AdminLayout title={`${artist?.name || 'Artist'} Social Media`}>
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
              <CardDescription>Across all platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(
                  mockSocialData.instagram.followers +
                  mockSocialData.twitter.followers +
                  mockSocialData.tiktok.followers +
                  mockSocialData.facebook.followers
                ).toLocaleString()}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Top Platform</CardTitle>
              <CardDescription>Platform with most followers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {Object.entries(mockSocialData)
                  .sort(([, a], [, b]) => b.followers - a.followers)[0][0]}
              </div>
              <p className="text-xs text-muted-foreground">
                {Object.entries(mockSocialData)
                  .sort(([, a], [, b]) => b.followers - a.followers)[0][1].followers.toLocaleString()} followers
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Highest Engagement</CardTitle>
              <CardDescription>Platform with best engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {Object.entries(mockSocialData)
                  .sort(([, a], [, b]) => b.engagement - a.engagement)[0][0]}
              </div>
              <p className="text-xs text-muted-foreground">
                {Object.entries(mockSocialData)
                  .sort(([, a], [, b]) => b.engagement - a.engagement)[0][1].engagement}% engagement rate
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Fastest Growing</CardTitle>
              <CardDescription>Platform with highest growth</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {Object.entries(mockSocialData)
                  .sort(([, a], [, b]) => b.growth - a.growth)[0][0]}
              </div>
              <p className="text-xs text-muted-foreground">
                +{Object.entries(mockSocialData)
                  .sort(([, a], [, b]) => b.growth - a.growth)[0][1].growth}% monthly growth
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="instagram" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="instagram">Instagram</TabsTrigger>
            <TabsTrigger value="twitter">Twitter</TabsTrigger>
            <TabsTrigger value="tiktok">TikTok</TabsTrigger>
            <TabsTrigger value="facebook">Facebook</TabsTrigger>
          </TabsList>
          
          <TabsContent value="instagram" className="space-y-6">
            <SocialPlatformContent 
              platform="instagram" 
              data={mockSocialData.instagram} 
            />
          </TabsContent>
          
          <TabsContent value="twitter" className="space-y-6">
            <SocialPlatformContent 
              platform="twitter" 
              data={mockSocialData.twitter} 
            />
          </TabsContent>
          
          <TabsContent value="tiktok" className="space-y-6">
            <SocialPlatformContent 
              platform="tiktok" 
              data={mockSocialData.tiktok} 
            />
          </TabsContent>
          
          <TabsContent value="facebook" className="space-y-6">
            <SocialPlatformContent 
              platform="facebook" 
              data={mockSocialData.facebook} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

interface SocialPlatformContentProps {
  platform: string;
  data: {
    followers: number;
    posts?: number;
    tweets?: number;
    videos?: number;
    engagement: number;
    growth: number;
    handle: string;
    url: string;
  };
}

function SocialPlatformContent({ platform, data }: SocialPlatformContentProps) {
  const contentLabel = platform === 'twitter' 
    ? 'Tweets' 
    : platform === 'tiktok' 
      ? 'Videos' 
      : 'Posts';
  
  const contentCount = platform === 'twitter' 
    ? data.tweets 
    : platform === 'tiktok' 
      ? data.videos 
      : data.posts;
  
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Followers</CardTitle>
            <CardDescription>Total {platform} followers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.followers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+{data.growth}% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{contentLabel}</CardTitle>
            <CardDescription>Total {contentLabel.toLowerCase()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contentCount?.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <CardDescription>Average engagement per post</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.engagement}%</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Details about {platform} profile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Handle</h3>
              <p className="text-muted-foreground">{data.handle}</p>
            </div>
            <div>
              <h3 className="font-medium">URL</h3>
              <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {data.url}
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Growth Trend</CardTitle>
          <CardDescription>{platform} follower growth over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
            <p className="text-muted-foreground">Growth chart will be displayed here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 