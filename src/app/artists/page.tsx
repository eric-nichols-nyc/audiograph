
import { ContentLayout } from '@/components/features/content-layout';
import { ArtistsList } from '@/components/features/artists/ArtistsList';

export default function ArtistsPage() {
  return (
    <ContentLayout title="Artists">
      <div className="flex min-h-screen flex-col">
        <ArtistsList />
      </div>
    </ContentLayout>
  );
}
