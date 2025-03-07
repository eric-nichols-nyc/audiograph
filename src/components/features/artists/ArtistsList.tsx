'use client';

import { Button } from '@/components/ui/button';
import { useArtists } from '@/hooks/use-artists';
import { ArtistListItem } from './ArtistListItem';

export function ArtistsList() {
  const { data: artists, isLoading, error } = useArtists();
  
  if (isLoading) {
    return (
      <main className="flex-1 container py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading artists...</p>
        </div>
      </main>
    );
  }
  
  if (error) {
    return (
      <main className="flex-1 container py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-red-500">Error loading artists: {error.message}</p>
        </div>
      </main>
    );
  }
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
          <ArtistListItem key={artist.id} artist={artist} />
        ))}
      </div>
    </main>
  );
}
