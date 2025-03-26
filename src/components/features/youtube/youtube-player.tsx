"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { create } from "zustand";

interface YouTubePlayerStore {
  videoId: string | null;
  isOpen: boolean;
  setVideo: (videoId: string | null) => void;
  closePlayer: () => void;
}

export const useYouTubePlayer = create<YouTubePlayerStore>((set) => ({
  videoId: null,
  isOpen: false,
  setVideo: (videoId) => {
    // Extract video ID if a full URL is provided
    if (videoId?.includes("youtube.com") || videoId?.includes("youtu.be")) {
      const url = new URL(videoId);
      if (videoId.includes("youtube.com")) {
        videoId = url.searchParams.get("v");
      } else {
        videoId = url.pathname.slice(1);
      }
    }
    set({ videoId, isOpen: true });
  },
  closePlayer: () => set({ isOpen: false, videoId: null }),
}));

export function YouTubePlayer() {
  const { videoId, isOpen, closePlayer } = useYouTubePlayer();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (videoId) {
      setIsLoading(true);
    }
  }, [videoId]);

  if (!isMounted) return null;
  if (!isOpen || !videoId) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[350px] shadow-lg rounded-lg overflow-hidden bg-background border border-border">
      <div className="relative">
        <button
          onClick={closePlayer}
          className="absolute top-2 right-2 z-10 p-1 rounded-full bg-background/80 hover:bg-background"
        >
          <X className="h-4 w-4" />
        </button>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
          </div>
        )}
        <div className="aspect-video">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0"
            title="YouTube video player"
            onLoad={() => setIsLoading(false)}
          />
        </div>
      </div>
    </div>
  );
}
