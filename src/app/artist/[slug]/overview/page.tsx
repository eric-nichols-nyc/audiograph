import { AdminLayout } from '@/components/features/admin-layout';
import { getArtistBySlug } from '@/actions/artists/artist';
import { ArtistNavbar } from '@/components/features/artist-details/artist-navbar';
import { SocialMediaDashboard } from '@/components/features/artist-details/overview/social-media-dashboard';
import { SimilarArtists } from '@/components/features/artist-details/overview/similar-artists';
import { MusicStreaming } from '@/components/features/artist-details/overview/music-streaming';
import { VideosStreaming } from '@/components/features/artist-details/overview/videos-streaming';
import { ArtistMap } from '@/components/features/artist-details/artist-map';

export default async function ArtistOverviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { artist } = await getArtistBySlug(slug);

  return (
    <AdminLayout title={`${artist?.name || 'Artist'} Overview`}>
      <ArtistNavbar artist={artist} />
      <div className="p-6">
        <MusicStreaming />
        <VideosStreaming />
        <SocialMediaDashboard />
        <ArtistMap />
        <SimilarArtists />
      </div>
    </AdminLayout>
  );
} 