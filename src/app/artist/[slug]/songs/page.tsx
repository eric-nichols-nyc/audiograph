import { AdminLayout } from '@/components/features/admin-layout';
import { getArtistBySlug } from '@/actions/artists/artist';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// Mock data for songs - in a real app, this would come from an API
const mockSongs = [
  {
    id: '1',
    title: 'Song One',
    album: 'Album Name',
    releaseDate: '2023-05-15',
    duration: '3:45',
    streams: 1250000,
    popularity: 75,
  },
  {
    id: '2',
    title: 'Song Two',
    album: 'Album Name',
    releaseDate: '2023-05-15',
    duration: '4:12',
    streams: 980000,
    popularity: 68,
  },
  {
    id: '3',
    title: 'Song Three',
    album: 'Different Album',
    releaseDate: '2022-11-03',
    duration: '3:21',
    streams: 2450000,
    popularity: 82,
  },
  {
    id: '4',
    title: 'Song Four',
    album: 'Different Album',
    releaseDate: '2022-11-03',
    duration: '2:58',
    streams: 1750000,
    popularity: 79,
  },
  {
    id: '5',
    title: 'Song Five',
    album: 'Single Release',
    releaseDate: '2024-01-20',
    duration: '3:33',
    streams: 850000,
    popularity: 71,
  },
];

export default async function ArtistSongsPage({ params }: { params: { slug: string } }) {
  const { artist } = await getArtistBySlug(params.slug);

  return (
    <AdminLayout title={`${artist?.name || 'Artist'} Songs`}>
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Songs</CardTitle>
              <CardDescription>Number of songs on Spotify</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockSongs.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Streams</CardTitle>
              <CardDescription>Combined streams across all songs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockSongs.reduce((sum, song) => sum + song.streams, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Popularity</CardTitle>
              <CardDescription>Average song popularity score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(mockSongs.reduce((sum, song) => sum + song.popularity, 0) / mockSongs.length)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Latest Release</CardTitle>
              <CardDescription>Most recent song release</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-md font-medium">
                {mockSongs.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())[0].title}
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date(mockSongs.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())[0].releaseDate).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>All Songs</CardTitle>
            <CardDescription>Complete list of songs by {artist?.name}</CardDescription>
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
                {mockSongs.map((song) => (
                  <TableRow key={song.id}>
                    <TableCell className="font-medium">{song.title}</TableCell>
                    <TableCell>{song.album}</TableCell>
                    <TableCell>{song.duration}</TableCell>
                    <TableCell className="text-right">{song.streams.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={song.popularity > 75 ? "default" : "secondary"}>
                        {song.popularity}
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