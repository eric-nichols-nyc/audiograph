"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export function ArtistNavbar() {
  const pathname = usePathname();
  const slug = pathname.split("/")[2]; // Get the slug from the URL

  const { data: artist, isLoading } = useQuery({
    queryKey: ["artist", slug],
    queryFn: async () => {
      const response = await fetch(`/api/artists/${slug}`);
      if (!response.ok) {
        throw new Error("Failed to fetch artist");
      }
      return response.json();
    },
    enabled: !!slug,
  });

  const basePath = pathname.split("/").slice(0, 3).join("/");

  const navItems = [
    { label: "Overview", href: `${basePath}/overview` },
    { label: "Audience", href: `${basePath}/audience` },
    { label: "Spotify", href: `${basePath}/spotify` },
    { label: "Youtube", href: `${basePath}/youtube` },
    { label: "Deezer", href: `${basePath}/deezer` },
  ];

  // Get first letter of artist name for fallback
  const artistInitial = artist?.name?.charAt(0) || "A";

  if (isLoading) {
    return (
      <div className="z-20 bg-background w-full border-b sticky top-0">
        <div className="flex items-center gap-4 px-6 py-3">
          <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
          <div className="flex flex-col gap-2">
            <div className="h-5 w-32 bg-muted animate-pulse rounded" />
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="z-20 bg-background w-full border-b sticky top-0">
      <div className="flex ">
        <div className="flex items-center gap-4 px-6 py-3">
          <div className="relative flex flex-col items-center gap-2">
            <Avatar className="w-12 h-12">
              <AvatarImage
                className="w-12 h-12"
                src={artist?.image_url || "https://github.com/shadcn.png"}
              />
              <AvatarFallback className="w-12 h-12">
                {artistInitial}
              </AvatarFallback>
            </Avatar>
            {artist?.rank && (
              <Badge
                variant="outline"
                className="text-xs absolute -top-2 -right-2"
              >
                # {artist.rank}
              </Badge>
            )}
            {artist?.country && (
              <Image
                className="w-4 h-4"
                src={`/images/flags/${artist.country}.svg`}
                alt={artist.country}
                width={16}
                height={16}
              />
            )}
          </div>
          <div className="flex flex-col border">
            <div className="flex flex-col items-center gap-2">
              <span className="font-medium text-foreground text-lg">
                {artist?.name || "Artist Name"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {artist?.genres && artist.genres.length > 0 && (
                <>
                  <Badge variant="outline" className="text-xs mt-2">
                    {artist.genres[0]}
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>
        <nav className="flex justify-between gap-6 px-6 pb-2 w-full">
          {navItems.map((item) => {
            // Check if this nav item matches the current path
            const isActive = pathname.includes(
              item.href.split("/").pop() || ""
            );

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium p-2 ${
                  isActive
                    ? "text-primary/90 bg-primary/20"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="flex items-center ml-auto">
            <Link
              href="/compare"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <Button size="sm">
                Compare this artist
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
