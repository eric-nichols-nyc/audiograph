"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import {
  useResponsiveStore,
  useNavbarScroll,
} from "@/hooks/use-responsive-store";
import { cn } from "@/lib/utils";

export function ArtistNavbar() {
  const getFlagPath = (country: string | null) => {
    if (!country) return null;
    return `/images/flags/${country.toLowerCase()}.svg`;
  };

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
  ];

  // Get first letter of artist name for fallback
  const artistInitial = artist?.name?.charAt(0) || "A";

  // Get current scroll position and handle scroll behavior
  const scrollY = useNavbarScroll();

  // Get the shouldHideNavbar helper from store
  const shouldHideNavbar = useResponsiveStore(
    (state) => state.shouldHideNavbar
  );

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
    <div
      className={cn(
        "z-20 bg-background w-full border-b sticky top-0",
        "transition-transform duration-300",
        // Use the helper to determine if we should hide
        shouldHideNavbar(scrollY) && "-translate-y-full"
      )}
    >
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
                src={getFlagPath(artist.country)}
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
        <nav className="flex overflow-x-auto scrollbar-hide pb-2 w-full">
          <div className="flex gap-6 px-6 min-w-max">
            {navItems.map((item) => {
              // Check if this nav item matches the current path
              const isActive = pathname.includes(
                item.href.split("/").pop() || ""
              );

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium p-2 whitespace-nowrap ${
                    isActive
                      ? "text-primary/90 bg-primary/20"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
