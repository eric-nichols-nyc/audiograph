"use client"
import { useState } from "react";
import Image from "next/image"
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const artists: Artist[] = [
    {
        id: "1",
        name: "The Neighbourhood",
        country: "USA",
        countryCode: "US",
        genre: "ROCK",
        image: "/placeholder.svg?height=50&width=50",
    },
    {
        id: "2",
        name: "Conan Gray",
        country: "USA",
        countryCode: "US",
        genre: "POP",
        image: "/placeholder.svg?height=50&width=50",
    },
    {
        id: "3",
        name: "Girl in Red",
        country: "NOR",
        countryCode: "NO",
        genre: "POP",
        image: "/placeholder.svg?height=50&width=50",
    },
    {
        id: "4",
        name: "Taylor Swift",
        country: "USA",
        countryCode: "US",
        genre: "POP",
        image: "/placeholder.svg?height=50&width=50",
    },
    {
        id: "5",
        name: "Bruno Mars",
        country: "USA",
        countryCode: "US",
        genre: "POP",
        image: "/placeholder.svg?height=50&width=50",
    },
    {
        id: "6",
        name: "Sabrina Carpenter",
        country: "USA",
        countryCode: "US",
        genre: "POP",
        image: "/placeholder.svg?height=50&width=50",
    },
    {
        id: "7",
        name: "Ariana Grande",
        country: "USA",
        countryCode: "US",
        genre: "POP",
        image: "/placeholder.svg?height=50&width=50",
    },
    {
        id: "8",
        name: "The Weeknd",
        country: "CAN",
        countryCode: "CA",
        genre: "POP",
        image: "/placeholder.svg?height=50&width=50",
    },
    {
        id: "9",
        name: "Lady Gaga",
        country: "USA",
        countryCode: "US",
        genre: "POP",
        image: "/placeholder.svg?height=50&width=50",
    },
    {
        id: "10",
        name: "Adele",
        country: "GBR",
        countryCode: "GB",
        genre: "POP",
        image: "/placeholder.svg?height=50&width=50",
    },
    {
        id: "11",
        name: "Olivia Rodrigo",
        country: "USA",
        countryCode: "US",
        genre: "POP",
        image: "/placeholder.svg?height=50&width=50",
    },
    {
        id: "12",
        name: "Lana Del Rey",
        country: "USA",
        countryCode: "US",
        genre: "POP",
        image: "/placeholder.svg?height=50&width=50",
    },
]

export function ArtistSelect() {
    const [searchQuery, setSearchQuery] = useState("")

    const filteredArtists = searchQuery
        ? artists.filter(
            (artist) =>
                artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                artist.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                artist.country.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        : artists

    return (
        <div className="flex flex-col gap-2 flex-1">
            <div className="p-6 space-y-6">
                <h2 className="text-xl font-semibold text-center">
                    Compare the social media and streaming stats of any two Artists out there.
                </h2>
            </div>

            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <Search className="h-5 w-5" />
                </div>
                <Input
                    type="text"
                    className="w-full py-3 pl-10 pr-4 border-0 rounded-md focus:ring-0 focus:outline-none text-gray-900"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Recommended Artists to compare</h3>
                <ul className="space-y-2">
                    {filteredArtists.map((artist) => (
                        <li
                            key={artist.id}
                            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                            onClick={() => onSelect?.(artist)}
                        >
                            <div className="flex items-center gap-3">
                                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                                    <Image src="/images/svgs/avatar.svg" alt={artist.name} fill className="object-cover" />
                                </div>
                                <span className="font-medium">{artist.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    <span className={`fi fi-${artist.countryCode.toLowerCase()} mr-1`}></span>
                                    {artist.country}
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    {artist.genre}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    )
}