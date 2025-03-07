
import { ContentLayout } from '@/components/features/content-layout';
import { ArtistsList } from '@/components/features/artists/ArtistsList';
export default function ArtistsPage() {
  // Mock data for artists
  const artists = [
    { id: 1, name: 'Taylor Swift', genre: 'Pop', followers: '87.5M', monthlyListeners: '82.3M' },
    { id: 2, name: 'Drake', genre: 'Hip-Hop', followers: '65.2M', monthlyListeners: '68.7M' },
    { id: 3, name: 'The Weeknd', genre: 'R&B', followers: '52.1M', monthlyListeners: '74.2M' },
    { id: 4, name: 'Billie Eilish', genre: 'Pop', followers: '48.7M', monthlyListeners: '56.9M' },
    { id: 5, name: 'Bad Bunny', genre: 'Reggaeton', followers: '44.3M', monthlyListeners: '59.8M' },
    { id: 6, name: 'Ariana Grande', genre: 'Pop', followers: '51.9M', monthlyListeners: '61.2M' },
  ];

  return (
    <ContentLayout title="Artists">
    <div className="flex min-h-screen flex-col">
      <ArtistsList artists={artists} />
    </div>
    </ContentLayout>
  );
}
