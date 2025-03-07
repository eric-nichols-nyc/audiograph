import { Button } from '@/components/ui/button';

interface Artist {
  id: number;
  name: string;
  genre: string;
  followers: string;
  monthlyListeners: string;
}

interface ArtistsListProps {
  artists: Artist[];
}

export function ArtistsList({ artists }: ArtistsListProps) {
  return (
    <main className="flex-1 container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Top Artists</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Filter</Button>
          <Button variant="outline" size="sm">Sort</Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {artists.map((artist) => (
          <div 
            key={artist.id} 
            className="rounded-lg border bg-card p-6 hover:border-primary/50 transition-colors"
          >
            <div className="flex flex-col gap-4">
              <div className="h-40 rounded-md bg-secondary/30 flex items-center justify-center">
                <span className="text-4xl font-bold text-primary/40">{artist.name.charAt(0)}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">{artist.name}</h3>
                <p className="text-sm text-muted-foreground">{artist.genre}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Followers</p>
                  <p className="font-medium">{artist.followers}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Monthly Listeners</p>
                  <p className="font-medium">{artist.monthlyListeners}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">View Analytics</Button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
