import { AdminLayout } from '@/components/features/admin-layout';
import { ArtistNavbar } from '@/components/features/artist-details/artist-navbar';
export default function ArtistsPage() {
  return (
    <AdminLayout title="Artist">
      <ArtistNavbar />
      <div>This is the artists page</div>
    </AdminLayout>
  );
}