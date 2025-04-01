"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ArtistCard } from "./artist-card";
import { Artist } from "@/types/artist";
import { cn } from "@/lib/utils";
import { useArtists } from "@/hooks/use-artists";
import { Button } from "@/components/ui/button";
import { RefreshCcwIcon } from "lucide-react";

interface ArtistSelectProps {
  position: 1 | 2;
  selectedId?: string;
  otherSelectedId?: string;
  onSelect: (artistId: string) => void;
  onClear: () => void;
  sticky?: boolean;
}

export function ArtistSelect({
  position,
  selectedId,
  otherSelectedId,
  onSelect,
  onClear,
  sticky = false,
}: ArtistSelectProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { data: artists, isLoading } = useArtists();

  const selectedArtist = selectedId
    ? artists?.find((a) => a.slug.toLowerCase() === selectedId.toLowerCase())
    : null;

  const availableArtists =
    artists?.filter(
      (artist) =>
        !otherSelectedId ||
        artist.slug.toLowerCase() !== otherSelectedId.toLowerCase()
    ) || [];

  const filteredArtists = searchQuery
    ? availableArtists.filter(
        (artist) =>
          artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (artist.genres?.[0] || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          artist.country?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : availableArtists;

  const handleArtistSelect = (artist: Artist) => {
    console.log("Artist selected:", { artist });
    onSelect(artist.slug);
    setIsFocused(false);
    setSearchQuery("");
  };

  return (
    <div className="w-full min-w-[300px]">
      {selectedArtist ? (
        <div className="relative pb-2">
          <ArtistCard
            artist={selectedArtist}
            onChangeClick={onClear}
            position={position}
          />
          <Button
            variant="secondary"
            onClick={onClear}
            className="absolute top-0 right-0"
          >
            <RefreshCcwIcon className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <ArtistCard
          artist={null}
          onChangeClick={() => setIsFocused(true)}
          position={position}
        />
      )}

      <div className="flex flex-col gap-2">
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
            <Search className="h-5 w-5" />
          </div>
          <Input
            type="text"
            className="w-full py-3 pl-10 pr-4 rounded-md"
            placeholder={`Search for ${
              position === 1 ? "first" : "second"
            } artist...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
          />

          {/* Loading state */}
          {isLoading && isFocused && (
            <Card
              className={cn(
                "mt-2 w-full z-20 border shadow-lg",
                sticky ? "sticky top-2" : "absolute"
              )}
            >
              <div className="p-4 text-center text-muted-foreground">
                Loading artists...
              </div>
            </Card>
          )}

          {/* Dropdown list */}
          {!isLoading && isFocused && filteredArtists.length > 0 && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsFocused(false)}
              />
              <Card
                className={cn(
                  "mt-2 w-full z-20 max-h-[400px] overflow-y-auto border shadow-lg",
                  sticky ? "sticky top-2" : "absolute"
                )}
              >
                <div className="p-2">
                  <h3 className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                    {searchQuery ? "Search Results" : "Recommended Artists"}
                  </h3>
                  <ul className="space-y-1">
                    {filteredArtists
                      .sort((a, b) => (a.rank || 999) - (b.rank || 999))
                      .map((artist) => (
                        <li
                          key={artist.id}
                          className="flex items-center justify-between p-2 hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer"
                          onClick={() => handleArtistSelect(artist)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative h-8 w-8 overflow-hidden rounded-full">
                              <Image
                                src={
                                  artist.image_url || "/images/svgs/avatar.svg"
                                }
                                alt={artist.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span className="font-medium">{artist.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {artist.country && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                                {artist.country}
                              </span>
                            )}
                            {artist.genres?.[0] && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                                {artist.genres[0]}
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              </Card>
            </>
          )}

          {!isLoading && isFocused && filteredArtists.length === 0 && (
            <Card
              className={cn(
                "mt-2 w-full z-20 border shadow-lg",
                sticky ? "sticky top-2" : "absolute"
              )}
            >
              <div className="p-4 text-center text-muted-foreground">
                {searchQuery ? "No artists found" : "No artists available"}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
