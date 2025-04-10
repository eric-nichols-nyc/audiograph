"use client";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { Artist } from "@/types/artist";
import { createSlug } from "@/utils/slugify";

interface ArtistListItemProps {
  artist: Artist;
}

export function ArtistListItem({ artist }: ArtistListItemProps) {
  const artistSlug = createSlug(artist.name);

  return (
    <Link href={`/artist/${artistSlug}`} className="block w-full mx-auto">
      <div
        key={artist.id}
        className="rounded-lg border bg-card p-4 hover:border-primary/50 hover:bg-card/60 transition-colors h-full"
      >
        <div className="flex flex-col gap-2">
          <div className="aspect-square w-32 mx-auto rounded-full bg-secondary/30 flex items-center justify-center overflow-hidden">
            {artist.image_url ? (
              <Image
                src={artist.image_url}
                alt={artist.name}
                width={200}
                height={200}
                className="w-full h-full object-cover"
                priority={false}
              />
            ) : (
              <span className="text-4xl font-bold text-primary/40">
                {artist.name.charAt(0)}
              </span>
            )}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold truncate">{artist.name}</h3>
              {artist.country && (
                <span className="text-sm text-muted-foreground">
                  • {artist.country}
                </span>
              )}
            </div>
            <Badge variant="secondary" className="mt-1">
              {artist.genres && artist.genres.length > 0
                ? artist.genres[0]
                : "Unknown Genre"}
            </Badge>
          </div>
        </div>
      </div>
    </Link>
  );
}
