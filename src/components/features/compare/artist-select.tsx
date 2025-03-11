"use client"
import { useState } from "react";
import Image from "next/image"
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ArtistCard } from "./artist-card";
import { cn } from "@/lib/utils";

const artists: Artist[] = [
    {
        id: "1",
        name: "The Neighbourhood",
        country: "USA",
        countryCode: "US",
        genre: "ROCK",
        image: "/images/svgs/avatar.svg",
        rank: 12
    },
    {
        id: "2",
        name: "Conan Gray",
        country: "USA",
        countryCode: "US",
        genre: "POP",
        image: "/images/svgs/avatar.svg",
        rank: 11
    },
    {
        id: "3",
        name: "Girl in Red",
        country: "NOR",
        countryCode: "NO",
        genre: "POP",
        image: "/images/svgs/avatar.svg",
        rank: 10
    },
    {
        id: "4",
        name: "Taylor Swift",
        country: "USA",
        countryCode: "US",
        genre: "POP",
        image: "/images/svgs/avatar.svg",
        rank: 1
    },
    {
        id: "5",
        name: "Bruno Mars",
        country: "USA",
        countryCode: "US",
        genre: "POP",
        image: "/images/svgs/avatar.svg",
        rank: 5
    },
    {
        id: "6",
        name: "Sabrina Carpenter",
        country: "USA",
        countryCode: "US",
        genre: "POP",
        image: "/images/svgs/avatar.svg",
        rank: 9
    },
    {
        id: "7",
        name: "Ariana Grande",
        country: "USA",
        countryCode: "US",
        genre: "POP",
        image: "/images/svgs/avatar.svg",
        rank: 2
    },
    {
        id: "8",
        name: "The Weeknd",
        country: "CAN",
        countryCode: "CA",
        genre: "POP",
        image: "/images/svgs/avatar.svg",
        rank: 3
    },
    {
        id: "9",
        name: "Lady Gaga",
        country: "USA",
        countryCode: "US",
        genre: "POP",
        image: "/images/svgs/avatar.svg",
        rank: 4
    },
    {
        id: "10",
        name: "Adele",
        country: "GBR",
        countryCode: "GB",
        genre: "POP",
        image: "/images/svgs/avatar.svg",
        rank: 6
    },
    {
        id: "11",
        name: "Olivia Rodrigo",
        country: "USA",
        countryCode: "US",
        genre: "POP",
        image: "/images/svgs/avatar.svg",
        rank: 7
    },
    {
        id: "12",
        name: "Lana Del Rey",
        country: "USA",
        countryCode: "US",
        genre: "POP",
        image: "/images/svgs/avatar.svg",
        rank: 8
    },
]

interface Artist {
    id: string;
    name: string;
    country: string;
    countryCode: string;
    genre: string;
    image: string;
    rank: number;
}

interface ArtistSelectProps {
    position: 1 | 2;
    selectedId?: string;
    otherSelectedId?: string;
    onSelect: (artistId: string) => void;
    onClear: () => void;
    sticky?: boolean;
}

export function ArtistSelect({ position, selectedId, otherSelectedId, onSelect, onClear, sticky = false }: ArtistSelectProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [isFocused, setIsFocused] = useState(false)

    const selectedArtist = selectedId ? artists.find(a => a.id.toLowerCase() === selectedId.toLowerCase()) : null

    const availableArtists = artists.filter(artist =>
        !otherSelectedId || artist.id.toLowerCase() !== otherSelectedId.toLowerCase()
    )

    const filteredArtists = searchQuery
        ? availableArtists.filter(
            (artist) =>
                artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                artist.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                artist.country.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        : availableArtists

    const handleArtistSelect = (artist: Artist) => {
        onSelect(artist.id)
        setIsFocused(false)
        setSearchQuery("")
    }

    if (selectedArtist) {
        return (
            <div className="flex flex-col gap-2 flex-1">
                <ArtistCard
                    artist={selectedArtist}
                    onChangeClick={onClear}
                    compact={sticky}
                />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-2 flex-1">
            <div className="p-6 space-y-6">
                <h2 className="text-xl font-semibold text-center">
                    {position === 1 ? "First" : "Second"} Artist
                </h2>
            </div>

            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                    <Search className="h-5 w-5" />
                </div>
                <Input
                    type="text"
                    className="w-full py-3 pl-10 pr-4 rounded-md"
                    placeholder={`Search for ${position === 1 ? "first" : "second"} artist...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                />

                {/* Dropdown list */}
                {isFocused && filteredArtists.length > 0 && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsFocused(false)}
                        />
                        <Card className={cn(
                            "mt-2 w-full z-20 max-h-[400px] overflow-y-auto border shadow-lg",
                            sticky ? "sticky top-2" : "absolute"
                        )}>
                            <div className="p-2">
                                <h3 className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                                    {searchQuery ? 'Search Results' : 'Recommended Artists'}
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
                                                            src={artist.image}
                                                            alt={artist.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <span className="font-medium">{artist.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                                                        <span className={`fi fi-${artist.countryCode.toLowerCase()} mr-1`}></span>
                                                        {artist.country}
                                                    </span>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                                                        {artist.genre}
                                                    </span>
                                                </div>
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        </Card>
                    </>
                )}

                {isFocused && filteredArtists.length === 0 && (
                    <Card className={cn(
                        "mt-2 w-full z-20 border shadow-lg",
                        sticky ? "sticky top-2" : "absolute"
                    )}>
                        <div className="p-4 text-center text-muted-foreground">
                            {searchQuery ? 'No artists found' : 'No artists available'}
                        </div>
                    </Card>
                )}
            </div>
        </div>
    )
}