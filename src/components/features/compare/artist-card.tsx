import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Crown } from "lucide-react";

interface ArtistCardProps {
    artist: {
        name: string;
        country: string;
        rank?: number;
        image: string;
    };
    onChangeClick?: () => void;
}

export function ArtistCard({ artist, onChangeClick }: ArtistCardProps) {
    if (!artist) {
        return (
            <Card className="w-full">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="relative h-20 w-20 overflow-hidden rounded-full bg-muted">
                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                    ?
                                </div>
                            </div>
                            <Button variant="secondary" onClick={onChangeClick}>
                                Select Artist
                            </Button>
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="h-6 w-32 rounded-md bg-muted animate-pulse" />
                            <div className="h-5 w-24 rounded-md bg-muted animate-pulse" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative h-20 w-20 overflow-hidden rounded-full">
                            <Image
                                src={artist.image || "/images/svgs/avatar.svg"}
                                alt={artist.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <Button variant="secondary" onClick={onChangeClick}>
                            Change
                        </Button>
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-semibold">{artist.name}</span>
                            {artist.rank === 1 && (
                                <Crown className="h-4 w-4 text-yellow-500" />
                            )}
                        </div>
                        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                            <span>{artist.country}</span>
                            {artist.rank && (
                                <span>Rank #{artist.rank}</span>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}