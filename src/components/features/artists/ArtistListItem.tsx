'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Artist } from '@/types/artist';
import { createSlug } from '@/utils/slugify';

interface ArtistListItemProps {
  artist: Artist;
}

export function ArtistListItem({ artist }: ArtistListItemProps) {
  return (
    <div 
      key={artist.id} 
      className="rounded-lg border bg-card p-6 hover:border-primary/50 transition-colors"
    >
      <div className="flex flex-col gap-4">
        <div className="h-40 rounded-md bg-secondary/30 flex items-center justify-center">
          {artist.image_url ? (
            <img 
              src={artist.image_url} 
              alt={artist.name} 
              className="h-full w-full object-cover rounded-md"
            />
          ) : (
            <span className="text-4xl font-bold text-primary/40">{artist.name.charAt(0)}</span>
          )}
        </div>
        <div>
          <h3 className="text-xl font-bold">{artist.name}</h3>
          <p className="text-sm text-muted-foreground">
            {artist.genres && artist.genres.length > 0 ? artist.genres[0] : 'Unknown Genre'}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Followers</p>
            <p className="font-medium">{artist.spotifyFollowers?.toLocaleString() || 'N/A'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Monthly Listeners</p>
            <p className="font-medium">{artist.monthlyListeners?.toLocaleString() || 'N/A'}</p>
          </div>
        </div>
        <Link href={`/artist/${createSlug(artist.name)}`} passHref>
          <Button variant="outline" className="w-full">View Analytics</Button>
        </Link>
      </div>
    </div>
  );
}
