"use client";

import { VideoCard } from "@/components/video-card";
import { useArtistStore } from "@/stores/artist-slug-store";
import { useQuery } from "@apollo/client";
import { SectionHeader } from "@/components/ui/section-header";
import {
  GET_ARTIST_VIDEOS,
  GetArtistVideosData,
  GetArtistVideosVars,
} from "@/graphql/queries/videos";
import { HeadphonesLoader } from "@/components/headphones-loader";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import type { SwiperOptions } from "swiper/types";
import { useState, useCallback, useMemo } from "react";
import { useYouTubePlayer } from "@/components/features/youtube/youtube-player";
import { PlayCircle } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const VIDEOS_PER_BATCH = 5;

const swiperOptions: SwiperOptions = {
  modules: [Pagination, Navigation],
  spaceBetween: 20,
  slidesPerView: 1,
  breakpoints: {
    640: { slidesPerView: 1.2 },
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
  },
  pagination: { clickable: true },
  navigation: true,
  watchSlidesProgress: true,
};

export function VideosStreaming() {
  const artist = useArtistStore((state) => state.artist);
  const [displayCount, setDisplayCount] = useState(VIDEOS_PER_BATCH);
  const { setVideo } = useYouTubePlayer();

  const {
    data,
    loading: isLoading,
    error,
  } = useQuery<GetArtistVideosData, GetArtistVideosVars>(GET_ARTIST_VIDEOS, {
    variables: {
      id: artist?.id || "",
    },
    skip: !artist?.id,
  });

  // Transform GraphQL data to match the expected Video type
  const videos = useMemo(() => {
    if (!data?.artist?.artist_videos) return [];

    return data.artist.artist_videos
      .map((av) => av.videos)
      .sort((a, b) => parseInt(b.view_count) - parseInt(a.view_count))
      .map((video) => ({
        id: video.id,
        video_id: video.video_id,
        title: video.title,
        view_count: video.view_count,
        daily_view_count: video.daily_view_count || "0",
        published_at: video.published_at || "",
        thumbnail_url: video.thumbnail_url,
        platform: video.platform,
        artist_name: data.artist.name,
      }));
  }, [data]);

  const youtubeVideos = useMemo(
    () => videos.filter((video) => video.platform === "youtube"),
    [videos]
  );

  const displayedVideos = useMemo(
    () => youtubeVideos.slice(0, displayCount),
    [youtubeVideos, displayCount]
  );

  const loadMoreVideos = useCallback(() => {
    setDisplayCount((prev) => prev + VIDEOS_PER_BATCH);
  }, []);

  const handleVideoClick = (videoId: string) => {
    setVideo(videoId);
  };

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

  if (videos.length === 0) {
    return (
      <div className="text-center text-gray-400 py-4">No videos available.</div>
    );
  }

  return (
    <div className="w-full">
      <SectionHeader title="Popular Videos" />
      <div className="mt-4">
        <Swiper
          {...swiperOptions}
          onSlideChange={(swiper) => {
            const isNearEnd =
              swiper.isEnd || swiper.activeIndex >= swiper.slides.length - 3;

            if (isNearEnd && displayCount < youtubeVideos.length) {
              loadMoreVideos();
            }
          }}
          className="w-full"
        >
          {displayedVideos.map((video) => (
            <SwiperSlide key={video.id}>
              <div
                onClick={() => handleVideoClick(video.video_id)}
                className="cursor-pointer relative group"
              >
                <VideoCard video={video} />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircle className="w-16 h-16 text-white" />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
