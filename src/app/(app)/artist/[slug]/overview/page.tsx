"use client";
import { Suspense } from "react";
import { SocialMediaDashboard } from "@/components/features/artist-details/overview/social-media-dashboard";
import { SimilarArtists } from "@/components/features/artist-details/overview/similar-artists";
import { MusicStreaming } from "@/components/features/artist-details/overview/music-streaming";
import { VideosStreaming } from "@/components/features/artist-details/overview/videos-streaming";
import { HeadphonesLoader } from "@/components/headphones-loader";

export default function ArtistOverviewPage() {
  return (
    <>
      <Suspense fallback={<HeadphonesLoader />}>
        <MusicStreaming />
      </Suspense>
      <Suspense fallback={<HeadphonesLoader />}>
        <VideosStreaming />
      </Suspense>
      <Suspense fallback={<HeadphonesLoader />}>
        <SocialMediaDashboard />
      </Suspense>
      <Suspense fallback={<HeadphonesLoader />}>
        <SimilarArtists />
      </Suspense>
    </>
  );
}
