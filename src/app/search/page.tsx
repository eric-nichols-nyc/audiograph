import { AdminLayout } from "@/components/features/admin-layout";
import { ArtistsList } from "@/components/features/artists/ArtistsList";

export default function SearchPage() {
  return (
    <AdminLayout title="Artists">
      <div className="flex min-h-screen flex-col">
        <ArtistsList />
      </div>
    </AdminLayout>
  );
}