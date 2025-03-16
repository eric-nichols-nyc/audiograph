"use client"

import { VideoCard } from "@/components/video-card";
import { getVideosByArtist } from "@/actions/video";
import { useEffect, useState } from "react";
import { useArtistStore } from "@/stores/artist-slug-store";
import { Video } from "@/types/video";

export function VideosStreaming() {
  const artist = useArtistStore(state => state.artist);
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    async function fetchVideos() {
      if (artist?.id) {
        console.log('Fetching videos for artist:', artist.id);
        const artistVideos = await getVideosByArtist(artist.id);
        console.log('Videos fetched:', artistVideos);
        if (Array.isArray(artistVideos)) {
          setVideos(artistVideos);
        }
      }
    }

    fetchVideos();
  }, [artist?.id]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {videos
        .filter((video: Video) => video.platform === 'youtube')
        .map((video: Video) => (
          <VideoCard key={video.id} video={video} />
        ))}
    </div>
  );
}

