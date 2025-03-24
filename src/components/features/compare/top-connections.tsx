"use client";

import { Card } from "@/components/ui/card";
import { getSimilarArtists } from "@/actions/artist";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useIsMounted } from "@/hooks/use-ismounted";

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
  const entity1 = searchParams.get("entity1");
  const entity2 = searchParams.get("entity2");
  const [artist1Connections, setArtist1Connections] = useState<SimilarArtist[]>(
    []
  );
  const [artist2Connections, setArtist2Connections] = useState<SimilarArtist[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useIsMounted();

  useEffect(() => {
    // Add this check to ensure we have at least one ID
    if (!entity1 && !entity2) {
      setIsLoading(false);
      return;
    }

    const fetchConnections = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [artist1Similar, artist2Similar] = await Promise.all([
          entity1 ? getSimilarArtists(entity1, 5) : Promise.resolve([]),
          entity2 ? getSimilarArtists(entity2, 5) : Promise.resolve([]),
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
  }, [entity1, entity2, isMounted]);

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
            className="flex items-center justify-between p-3 rounded-lg bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10 transition-colors"
          >
            <span className="font-medium text-blue-200/90">{artist.name}</span>
            <span className="text-sm text-blue-200/60">
              {(artist.similarity_score * 100).toFixed(1)}% match
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (!entity1 && !entity2) return null;

  return (
    <Card className="p-6 bg-card/50 border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {entity1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-blue-200/80">
              Top Connections
            </h3>
            <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/10">
              {renderConnections(artist1Connections)}
            </div>
          </div>
        )}
        {entity2 && (
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
