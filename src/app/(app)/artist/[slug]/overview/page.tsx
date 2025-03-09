import { SocialMediaDashboard } from '@/components/features/artist-details/overview/social-media-dashboard';
import { SimilarArtists } from '@/components/features/artist-details/overview/similar-artists';
import { MusicStreaming } from '@/components/features/artist-details/overview/music-streaming';
import { VideosStreaming } from '@/components/features/artist-details/overview/videos-streaming';

export default async function ArtistOverviewPage() {
  return (
    <>
      <MusicStreaming />
      <VideosStreaming />
      <SocialMediaDashboard />
      <SimilarArtists />
    </>
  );
} 