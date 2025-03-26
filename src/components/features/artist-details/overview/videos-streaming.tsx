"use client";

import { VideoCard } from "@/components/video-card";
import { useArtistStore } from "@/stores/artist-slug-store";
import { useQuery } from "@apollo/client";
import {
  GET_ARTIST_VIDEOS,
  GetArtistVideosData,
  GetArtistVideosVars,
} from "@/graphql/queries/videos";
import { HeadphonesLoader } from "@/components/headphones-loader";
import { Video } from "@/types/video";

export function VideosStreaming() {
  const artist = useArtistStore((state) => state.artist);

  const {
    data,
    loading: isLoading,
    error,
  } = useQuery<GetArtistVideosData, GetArtistVideosVars>(GET_ARTIST_VIDEOS, {
    variables: { id: artist?.id || "" },
    skip: !artist?.id,
  });

  if (!artist?.id) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <HeadphonesLoader size={120} color="#3b82f6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 py-4">
        Failed to load videos. Please try again later.
      </div>
    );
  }

  // Transform GraphQL data to match the expected Video type
  const videos: Video[] = (data?.artist?.videos || []).map((video) => ({
    id: video.id,
    video_id: video.video_id,
    title: video.title,
    view_count: parseInt(video.view_count, 10),
    daily_view_count: video.daily_view_count
      ? parseInt(video.daily_view_count, 10)
      : 0,
    published_at: video.published_at || "",
    thumbnail_url: video.thumbnail_url,
    platform: video.platform,
    artist_name: data.artist.name,
  }));

  if (videos.length === 0) {
    return (
      <div className="text-center text-gray-400 py-4">No videos available.</div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {videos
        .filter((video) => video.platform === "youtube")
        .map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
    </div>
  );
}
