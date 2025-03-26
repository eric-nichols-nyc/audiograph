import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Crown } from "lucide-react";
import { Artist } from "@/types/artist";
import { cn } from "@/lib/utils";

interface ArtistCardProps {
  artist: Artist;
  onChangeClick?: () => void;
  compact?: boolean;
  position?: 1 | 2;
}

export function ArtistCard({
  artist,
  onChangeClick,
  compact = false,
  position = 1,
}: ArtistCardProps) {
  // Function to get flag image path
  const getFlagPath = (country: string | null) => {
    if (!country) return null;
    return `/images/flags/${country.toLowerCase()}.svg`;
  };

  if (!artist) {
    return (
      <Card className="w-full text-white">
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

  if (compact) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div
            className={cn(
              "flex items-center gap-3",
              position === 2 && "flex-row-reverse"
            )}
          >
            <div className="relative h-10 w-10 overflow-hidden rounded-full">
              <Image
                src={artist.image_url || "/images/svgs/avatar.svg"}
                alt={artist.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{artist.name}</span>
              {artist.rank === 1 && (
                <Crown className="h-4 w-4 text-yellow-500" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div
          className={cn(
            "flex items-center justify-between gap-4",
            position === 2 && "flex-row-reverse"
          )}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-full">
              <Image
                src={artist.image_url || "/images/svgs/avatar.svg"}
                alt={artist.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div
            className={cn("flex flex-col gap-1", position === 2 && "items-end")}
          >
            <div
              className={cn(
                "flex flex-col gap-2 text-sm",
                position === 2 ? "items-start" : "items-end"
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">{artist.name}</span>
                {artist.rank === 1 && (
                  <Crown className="h-4 w-4 text-yellow-500" />
                )}
              </div>
              {artist.country && (
                <div
                  className={cn(
                    "flex items-center gap-2",
                    position === 2 && "flex-row-reverse"
                  )}
                >
                  <span className="text-sm text-muted-foreground">
                    {artist.country}
                  </span>
                  <div className="relative h-4 w-6">
                    <Image
                      src={
                        getFlagPath(artist.country) ||
                        "/images/flags/unknown.svg"
                      }
                      alt={`${artist.country} flag`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
              {artist.rank && (
                <div
                  className={cn(
                    "flex items-baseline gap-1 mt-3",
                    position === 2 && "flex-row-reverse"
                  )}
                >
                  <span className="text-sm text-muted-foreground">
                    Overall Rank
                  </span>
                  <span className="text-2xl font-bold">{artist.rank}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
