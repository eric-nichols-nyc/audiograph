"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import { formatNumber } from "@/utils/number-format";
import { useMostViewedVideos } from "@/hooks/graphql/use-most-viewed-videos";
import { useYouTubePlayer } from "../youtube/youtube-player";

interface VideoData {
  title: string;
  thumbnailUrl: string;
  views: number;
  artistName: string;
  videoId?: string;
}

function ViewComparisonBar({ videos }: { videos: VideoData[] }) {
  if (videos.length !== 2) return null;

  const maxViews = Math.max(videos[0].views, videos[1].views);
  const leftWidth = (videos[0].views / maxViews) * 100;
  const rightWidth = (videos[1].views / maxViews) * 100;

  return (
    <div className="relative h-16 flex items-center">
      {/* View count left */}
      <div className="absolute left-0 -top-8 font-medium text-black dark:text-white">
        {formatNumber(videos[0].views)}
      </div>

      {/* Left Bar */}
      <div className="flex-1 h-12 flex justify-end">
        <div
          className="bg-red-600 h-full rounded-l-md transition-all duration-500"
          style={{ width: `${leftWidth}%` }}
        />
      </div>

      {/* Center Logo */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#FF0000">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        </div>
      </div>

      {/* Right Bar */}
      <div className="flex-1 h-12 flex justify-start">
        <div
          className="bg-red-300 h-full rounded-r-md transition-all duration-500"
          style={{ width: `${rightWidth}%` }}
        />
      </div>

      {/* View count right */}
      <div className="absolute right-0 -top-8 font-medium text-black dark:text-white">
        {formatNumber(videos[1].views)}
      </div>
    </div>
  );
}

export function MostViewedVideos() {
  const { videos, isLoading, error } = useMostViewedVideos();
  const { setVideo } = useYouTubePlayer();
  console.log("videos ", videos);

  if (videos.length === 0 && !isLoading && !error) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4 text-center">{error}</div>;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#FF0000">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
        <h2 className="text-xl font-semibold">Most Viewed Music Videos</h2>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {videos.map((video, index) => (
          <button
            key={index}
            onClick={() => video.videoId && setVideo(video.videoId)}
            className="flex flex-col text-left hover:opacity-90 hover:cursor-pointer transition-opacity"
          >
            <div className="relative aspect-video w-full group">
              <Image
                src={`https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`}
                alt={video.title}
                fill
                className="object-cover rounded-md"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-black/20 rounded-md" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-red-600/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg
                    className="w-6 h-6 text-white ml-0.5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <h3
                className="font-medium text-base line-clamp-1"
                title={video.title}
              >
                {video.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {video.artistName}
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8">
        <ViewComparisonBar videos={videos} />
      </div>
    </Card>
  );
}
