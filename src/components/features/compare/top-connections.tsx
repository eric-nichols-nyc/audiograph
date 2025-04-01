"use client";

import { Card } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useArtistConnections } from "@/hooks/graphql/use-artist-connections";

export function TopConnections() {
  const searchParams = useSearchParams();
  const entity1Slug = searchParams.get("entity1");
  const entity2Slug = searchParams.get("entity2");
  console.log("URL Parameters:", { entity1Slug, entity2Slug });

  const { connections, isLoading, error } = useArtistConnections({
    entity1Slug,
    entity2Slug,
  });
  console.log("Hook Response:", { connections, isLoading, error });

  const renderConnections = (artistId: string) => {
    console.log("Rendering connections for artist:", artistId);
    if (isLoading) {
      console.log("Loading state...");
      return (
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-blue-500/10 rounded-lg" />
          ))}
        </div>
      );
    }

    if (error) {
      console.log("Error state:", error);
      return (
        <div className="text-red-400 text-sm p-3 bg-red-500/10 rounded-lg">
          {error}
        </div>
      );
    }

    const artistConnection = connections.find(
      (connection) => connection.artist.id === artistId
    );
    console.log("Found connection:", artistConnection);

    if (!artistConnection || artistConnection.similarArtists.length === 0) {
      console.log("No connections found for artist:", artistId);
      return (
        <div className="text-muted-foreground text-sm p-3">
          No connections found
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {artistConnection.similarArtists.map((artist) => (
          <div
            key={artist.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10 transition-colors"
          >
            <div className="relative h-10 w-10 overflow-hidden rounded-full">
              <Image
                src={artist.image_url || "/images/svgs/avatar.svg"}
                alt={artist.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-blue-200/90 truncate">
                {artist.name}
              </div>
            </div>
            {artist.genres.length > 0 && (
              <div className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-200/90">
                {artist.genres[0]}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (!entity1Slug && !entity2Slug) {
    console.log("No slugs found, returning null");
    return null;
  }

  console.log("Rendering component with connections:", connections);
  return (
    <Card className="p-6 bg-card/50 border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {connections.map((connection) => {
          console.log("Rendering connection:", connection);
          return (
            <div key={connection.artist.id} className="space-y-4">
              <h3 className="text-lg font-medium text-blue-200/80">
                Top Connections for {connection.artist.name}
              </h3>
              <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/10">
                {renderConnections(connection.artist.id)}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
