'use client';

import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { Artist } from '@/types/artist';
import { createSlug } from '@/utils/slugify';

interface ArtistListItemProps {
  artist: Artist;
}

export function ArtistListItem({ artist }: ArtistListItemProps) {
  const artistSlug = createSlug(artist.name);
  
  return (
    <Link 
      href={`/artist/${artistSlug}`} 
      className="block"
    >
      <div 
        key={artist.id} 
        className="rounded-lg border bg-card p-6 hover:border-primary/50 hover:bg-card/60 transition-colors"
      >
        <div className="flex flex-col gap-4">
          <div className="h-40 rounded-md bg-secondary/30 flex items-center justify-center overflow-hidden">
            {artist.image_url ? (
              <Image 
                src={artist.image_url} 
                alt={artist.name} 
                width={320}
                height={160}
                className="h-full w-full object-cover rounded-md"
                priority={false}
              />
            ) : (
              <span className="text-4xl font-bold text-primary/40">{artist.name.charAt(0)}</span>
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold">{artist.name}</h3>
            <Badge>
              {artist.genres && artist.genres.length > 0 ? artist.genres[0] : 'Unknown Genre'}
            </Badge>
          </div>
        </div>
      </div>
    </Link>
  );
}
