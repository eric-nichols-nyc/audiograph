import { AdminLayout } from '@/components/features/admin-layout';
import { getArtistBySlug } from '@/actions/artists/artist';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
// Mock data for albums - in a real app, this would come from an API
const mockAlbums = [
  {
    id: '1',
    title: 'Album One',
    releaseDate: '2023-05-15',
    trackCount: 12,
    totalStreams: 15250000,
    coverArt: 'https://placehold.co/400x400/333/FFF',
    type: 'album'
  },
  {
    id: '2',
    title: 'Album Two',
    releaseDate: '2022-11-03',
    trackCount: 10,
    totalStreams: 22450000,
    coverArt: 'https://placehold.co/400x400/333/FFF',
    type: 'album'
  },
  {
    id: '3',
    title: 'EP Collection',
    releaseDate: '2021-08-22',
    trackCount: 6,
    totalStreams: 8750000,
    coverArt: 'https://placehold.co/400x400/333/FFF',
    type: 'ep'
  },
  {
    id: '4',
    title: 'Single Release',
    releaseDate: '2024-01-20',
    trackCount: 1,
    totalStreams: 850000,
    coverArt: 'https://placehold.co/400x400/333/FFF',
    type: 'single'
  },
  {
    id: '5',
    title: 'Compilation Album',
    releaseDate: '2020-03-15',
    trackCount: 15,
    totalStreams: 5250000,
    coverArt: 'https://placehold.co/400x400/333/FFF',
    type: 'compilation'
  },
];

export default async function ArtistAlbumsPage({ params }: { params: { slug: string } }) {
  const { artist } = await getArtistBySlug(params.slug);

  return (
    <AdminLayout title={`${artist?.name || 'Artist'} Albums`}>
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Albums</CardTitle>
              <CardDescription>Number of albums released</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockAlbums.filter(album => album.type === 'album').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Releases</CardTitle>
              <CardDescription>All albums, EPs, and singles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAlbums.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Streams</CardTitle>
              <CardDescription>Combined streams across all releases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockAlbums.reduce((sum, album) => sum + album.totalStreams, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Latest Release</CardTitle>
              <CardDescription>Most recent album or single</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-md font-medium">
                {mockAlbums.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())[0].title}
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date(mockAlbums.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())[0].releaseDate).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockAlbums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

interface AlbumCardProps {
  album: {
    id: string;
    title: string;
    releaseDate: string;
    trackCount: number;
    totalStreams: number;
    coverArt: string;
    type: 'album' | 'ep' | 'single' | 'compilation';
  };
}

function AlbumCard({ album }: AlbumCardProps) {
  const albumTypeColors = {
    album: 'default',
    ep: 'secondary',
    single: 'outline',
    compilation: 'destructive'
  };
  
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square relative">
        <Image 
          fill
          src={album.coverArt} 
          alt={album.title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium line-clamp-1">{album.title}</h3>
          <Badge variant={albumTypeColors[album.type]} className="capitalize">
            {album.type}
          </Badge>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{new Date(album.releaseDate).toLocaleDateString()}</span>
          <span>{album.trackCount} tracks</span>
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          <span>{album.totalStreams.toLocaleString()} streams</span>
        </div>
      </CardContent>
    </Card>
  );
} 