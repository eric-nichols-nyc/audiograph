"use client";
import Image from "next/image";
import { useYouTubePlayer } from "../youtube/youtube-player";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { formatNumber } from "@/utils/number-format";
import { getArtistId } from "@/actions/artist";

interface Video {
  id: string;
  video_id: string;
  title: string;
  view_count: number;
  thumbnail_url: string;
  artist_name: string;
}

export function VideoContainer() {
  const { setVideo } = useYouTubePlayer();
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();

  const entity1Slug = searchParams.get("entity1");
  const entity2Slug = searchParams.get("entity2");
  const [artist1Id, setArtist1Id] = useState<string>();
  const [artist2Id, setArtist2Id] = useState<string>();

  // First, get artist IDs from slugs
  useEffect(() => {
    async function fetchIds() {
      if (entity1Slug) {
        const id = await getArtistId(entity1Slug);
        setArtist1Id(id || undefined);
      }
      if (entity2Slug) {
        const id = await getArtistId(entity2Slug);
        setArtist2Id(id || undefined);
      }
    }
    fetchIds();
  }, [entity1Slug, entity2Slug]);

  useEffect(() => {
    async function fetchVideos() {
      if (!artist1Id || !artist2Id) return;

      setIsLoading(true);
      const supabase = createBrowserSupabase();

      try {
        // Fetch videos for both artists
        const [{ data: data1 }, { data: data2 }] = await Promise.all([
          supabase
            .from("videos")
            .select(
              `
              *,
              artist_videos!inner (
                artist_id,
                artists!inner (
                  name
                )
              )
            `
            )
            .eq("artist_videos.artist_id", artist1Id)
            .order("view_count", { ascending: false })
            .limit(1)
            .single(),
          supabase
            .from("videos")
            .select(
              `
              *,
              artist_videos!inner (
                artist_id,
                artists!inner (
                  name
                )
              )
            `
            )
            .eq("artist_videos.artist_id", artist2Id)
            .order("view_count", { ascending: false })
            .limit(1)
            .single(),
        ]);

        if (data1 && data2) {
          const formattedVideos = [data1, data2].map((video) => ({
            id: video.id,
            video_id: video.video_id,
            title: video.title,
            view_count: video.view_count,
            thumbnail_url: `https://i.ytimg.com/vi/${video.video_id}/maxresdefault.jpg`,
            artist_name: video.artist_videos[0].artists.name,
          }));
          setVideos(formattedVideos);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchVideos();
  }, [artist1Id, artist2Id]);

  if (!entity1Slug || !entity2Slug) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {videos.map((video) => (
        <button
          key={video.id}
          onClick={() => setVideo(video.video_id)}
          className="relative aspect-video rounded-lg overflow-hidden hover:opacity-90 transition-opacity group"
        >
          <Image
            src={video.thumbnail_url}
            alt={video.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
              <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-black border-b-8 border-b-transparent ml-1" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <h3 className="text-white font-medium line-clamp-2">
              {video.title}
            </h3>
            <p className="text-white/80 text-sm mt-1">
              {formatNumber(video.view_count)} views • {video.artist_name}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
