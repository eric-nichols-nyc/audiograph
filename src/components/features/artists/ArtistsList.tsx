"use client";

import { useArtists } from "@/hooks/use-artists";
import { ArtistListItem } from "./ArtistListItem";
import { useState } from "react";
import { SearchBar } from "./SearchBar";

export function ArtistsList() {
  const { data: artists, isLoading, error } = useArtists();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArtists = artists?.filter((artist) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    const nameParts = artist.name.toLowerCase().split(" ");

    // Check if any part of the name starts with the query
    return (
      nameParts.some((part) => part.startsWith(query)) ||
      // Also check if full name contains the query for partial matches
      artist.name.toLowerCase().includes(query)
    );
  });

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
          <p className="text-lg text-red-500">
            Error loading artists: {error.message}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 container py-8">
      <div className="sticky top-0 z-10 pb-8 pt-2 bg-background/80 backdrop-blur-sm">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search artists..."
        />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center gap-3">
        {filteredArtists?.map((artist) => (
          <ArtistListItem key={artist.id} artist={artist} />
        ))}
      </div>
    </main>
  );
}
