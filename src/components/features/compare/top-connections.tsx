"use client";

import { Card } from "@/components/ui/card";
import { getSimilarArtists, getArtistId } from "@/actions/artist";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useIsMounted } from "@/hooks/use-ismounted";
import Image from "next/image";

interface SimilarArtist {
  id: string;
  name: string;
  image_url: string;
  genres: string[];
  similarity_score: number;
  similarity_factors: Record<string, number>;
}

export function TopConnections() {
  const searchParams = useSearchParams();
  const entity1Slug = searchParams.get("entity1");
  const entity2Slug = searchParams.get("entity2");
  const [artist1Id, setArtist1Id] = useState<string>();
  const [artist2Id, setArtist2Id] = useState<string>();
  const [artist1Connections, setArtist1Connections] = useState<SimilarArtist[]>(
    []
  );
  const [artist2Connections, setArtist2Connections] = useState<SimilarArtist[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useIsMounted();

  // First get the IDs from slugs
  useEffect(() => {
    async function fetchIds() {
      try {
        if (entity1Slug) {
          const id = await getArtistId(entity1Slug);
          if (id) setArtist1Id(id);
        }
        if (entity2Slug) {
          const id = await getArtistId(entity2Slug);
          if (id) setArtist2Id(id);
        }
      } catch (err) {
        console.error("Error fetching artist IDs:", err);
        setError("Failed to load artist IDs");
      }
    }
    fetchIds();
  }, [entity1Slug, entity2Slug]);

  // Then fetch connections using the IDs
  useEffect(() => {
    if (!artist1Id && !artist2Id) {
      setIsLoading(false);
      return;
    }

    const fetchConnections = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [artist1Similar, artist2Similar] = await Promise.all([
          artist1Id ? getSimilarArtists(artist1Id, 5) : Promise.resolve([]),
          artist2Id ? getSimilarArtists(artist2Id, 5) : Promise.resolve([]),
        ]);

        if (isMounted()) {
          setArtist1Connections(artist1Similar);
          setArtist2Connections(artist2Similar);
        }
      } catch (err) {
        if (isMounted()) {
          console.error("Error fetching connections:", err);
          setError("Failed to load artist connections");
        }
      } finally {
        if (isMounted()) {
          setIsLoading(false);
        }
      }
    };

    fetchConnections();
  }, [artist1Id, artist2Id, isMounted]);

  const renderConnections = (connections: SimilarArtist[]) => {
    if (isLoading) {
      return (
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-blue-500/10 rounded-lg" />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-red-400 text-sm p-3 bg-red-500/10 rounded-lg">
          {error}
        </div>
      );
    }

    if (connections.length === 0) {
      return (
        <div className="text-muted-foreground text-sm p-3">
          No connections found
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {connections.map((artist) => (
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
            <span className="font-medium text-blue-200/90">{artist.name}</span>
          </div>
        ))}
      </div>
    );
  };

  if (!entity1Slug && !entity2Slug) return null;

  return (
    <Card className="p-6 bg-card/50 border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {entity1Slug && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-blue-200/80">
              Top Connections
            </h3>
            <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/10">
              {renderConnections(artist1Connections)}
            </div>
          </div>
        )}
        {entity2Slug && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-blue-200/80">
              Top Connections
            </h3>
            <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/10">
              {renderConnections(artist2Connections)}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
