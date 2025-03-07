import { AdminLayout } from '@/components/features/admin-layout';
import { getArtistBySlug } from '@/actions/artists/artist';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ArtistOverviewPage({ params }: { params: { slug: string } }) {
  const { artist } = await getArtistBySlug(params.slug);

  return (
    <AdminLayout title={`${artist?.name || 'Artist'} Overview`}>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Spotify Followers</CardTitle>
            <CardDescription>Total followers on Spotify</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{artist?.spotifyFollowers?.toLocaleString() || 'N/A'}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Listeners</CardTitle>
            <CardDescription>Average monthly listeners</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{artist?.monthlyListeners?.toLocaleString() || 'N/A'}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">YouTube Subscribers</CardTitle>
            <CardDescription>Total YouTube channel subscribers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{artist?.youtubeSubscribers?.toLocaleString() || 'N/A'}</div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Artist Information</CardTitle>
            <CardDescription>Basic details about {artist?.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-medium">Genres</h3>
                <p className="text-muted-foreground">
                  {artist?.genres?.join(', ') || 'No genres available'}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Country</h3>
                <p className="text-muted-foreground">{artist?.country || 'Unknown'}</p>
              </div>
              <div>
                <h3 className="font-medium">Popularity Score</h3>
                <p className="text-muted-foreground">{artist?.popularity || 'N/A'}</p>
              </div>
              <div>
                <h3 className="font-medium">Instagram Followers</h3>
                <p className="text-muted-foreground">
                  {artist?.instagramFollowers?.toLocaleString() || 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
} 