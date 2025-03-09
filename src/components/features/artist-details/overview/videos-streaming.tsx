"use client"

import { VideoCard } from "@/components/video-card";
const mockVideos = [
  {
    id: '1',
    title: 'Music Video One',
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    publishDate: '2023-06-15',
    views: 2450000,
    likes: 125000,
    duration: '4:12',
    platform: 'youtube'
  },
  {
    id: '2',
    title: 'Music Video Two',
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    publishDate: '2023-02-28',
    views: 1850000,
    likes: 95000,
    duration: '3:45',
    platform: 'youtube'
  },
  {
    id: '3',
    title: 'Live Performance',
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    publishDate: '2022-11-10',
    views: 980000,
    likes: 65000,
    duration: '5:30',
    platform: 'youtube'
  },
];
export function VideosStreaming() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {mockVideos
        .filter((video) => video.platform === 'youtube')
        .map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
    </div>
  )
}

