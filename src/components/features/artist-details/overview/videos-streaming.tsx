"use client";
import { use } from "react";
import { VideoCard } from "@/components/video-card";
import { getVideosByArtist } from "@/actions/video";
import { useArtistStore } from "@/stores/artist-slug-store";
import { Video } from "@/types/video";

// Cache for storing promises
const videoCache = new Map<string, Promise<Video[]>>();

export function VideosStreaming() {
  const artist = useArtistStore((state) => state.artist);
  const artistId = artist?.id;

  if (!artistId) return null;

  // Get or create the promise for this artist
  let videosPromise = videoCache.get(artistId);
  if (!videosPromise) {
    videosPromise = new Promise<Video[]>((resolve) => {
      setTimeout(async () => {
        const videos = await getVideosByArtist(artistId, 3);
        resolve(videos);
      }, 5000);
    });
    videoCache.set(artistId, videosPromise);
  }

  const videos = use(videosPromise);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {videos
        .filter((video: Video) => video.platform === "youtube")
        .map((video: Video) => (
          <VideoCard key={video.id} video={video} />
        ))}
    </div>
  );
}
