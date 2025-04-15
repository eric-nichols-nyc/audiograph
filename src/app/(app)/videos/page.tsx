"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/client";

export default function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const supabase = createBrowserSupabase();

        // Fetch videos with artist information
        const { data, error } = await supabase
          .from("videos")
          .select(
            `
            *,
            artist_videos!inner (
              artist_id,
              artists!inner (
                id,
                name,
                slug,
                image_url
              )
            )
          `
          )
          .order("view_count", { ascending: false })
          .limit(20);

        if (error) {
          console.error("Error fetching videos:", error);
          setError(error.message);
          return;
        }

        console.log("Videos data from database:", data);
        setVideos(data || []);
      } catch (err) {
        console.error("Error in fetchVideos:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, []);

  return (
    <div className="container mx-auto py-12 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Videos</h1>

      {loading ? (
        <div className="bg-muted p-8 rounded-lg text-center max-w-md">
          <p className="text-xl mb-4">Loading videos...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 p-8 rounded-lg text-center max-w-md">
          <p className="text-xl mb-4 text-red-600">Error loading videos</p>
          <p className="text-muted-foreground">{error}</p>
        </div>
      ) : videos.length === 0 ? (
        <div className="bg-muted p-8 rounded-lg text-center max-w-md">
          <p className="text-xl mb-4">No videos found</p>
          <p className="text-muted-foreground">
            We couldn&apos;t find any videos in the database.
          </p>
        </div>
      ) : (
        <div className="bg-muted p-8 rounded-lg text-center max-w-md">
          <p className="text-xl mb-4">Videos loaded successfully!</p>
          <p className="text-muted-foreground">
            Found {videos.length} videos in the database. Check the console for
            details.
          </p>
        </div>
      )}
    </div>
  );
}
