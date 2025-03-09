import { AdminLayout } from '@/components/features/admin-layout';
import { getArtistBySlug } from '@/actions/artists/artist';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// Mock data for tracks - in a real app, this would come from an API
const mockTracks = [
  {
    id: '1',
    title: 'Track One',
    album: 'Album Name',
    releaseDate: '2023-05-15',
    duration: '3:45',
    streams: 1250000,
    popularity: 75,
  },
  {
    id: '2',
    title: 'Track Two',
    album: 'Album Name',
    releaseDate: '2023-05-15',
    duration: '4:12',
    streams: 980000,
    popularity: 68,
  },
  {
    id: '3',
    title: 'Track Three',
    album: 'Different Album',
    releaseDate: '2022-11-03',
    duration: '3:21',
    streams: 2450000,
    popularity: 82,
  },
  {
    id: '4',
    title: 'Track Four',
    album: 'Different Album',
    releaseDate: '2022-11-03',
    duration: '2:58',
    streams: 1750000,
    popularity: 79,
  },
  {
    id: '5',
    title: 'Track Five',
    album: 'Single Release',
    releaseDate: '2024-01-20',
    duration: '3:33',
    streams: 850000,
    popularity: 71,
  },
];

export default async function ArtistTracksPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { artist } = await getArtistBySlug(slug);

  return (
    <AdminLayout title={`${artist?.name || 'Artist'} Tracks`}>
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Tracks</CardTitle>
              <CardDescription>Number of tracks on Spotify</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockTracks.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Streams</CardTitle>
              <CardDescription>Combined streams across all tracks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockTracks.reduce((sum, track) => sum + track.streams, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Popularity</CardTitle>
              <CardDescription>Average track popularity score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(mockTracks.reduce((sum, track) => sum + track.popularity, 0) / mockTracks.length)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Latest Release</CardTitle>
              <CardDescription>Most recent track release</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-md font-medium">
                {mockTracks.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())[0].title}
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date(mockTracks.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())[0].releaseDate).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>All Tracks</CardTitle>
            <CardDescription>Complete list of tracks by {artist?.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Album</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="text-right">Streams</TableHead>
                  <TableHead className="text-right">Popularity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTracks.map((track) => (
                  <TableRow key={track.id}>
                    <TableCell className="font-medium">{track.title}</TableCell>
                    <TableCell>{track.album}</TableCell>
                    <TableCell>{track.duration}</TableCell>
                    <TableCell className="text-right">{track.streams.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={track.popularity > 75 ? "default" : "secondary"}>
                        {track.popularity}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
} 