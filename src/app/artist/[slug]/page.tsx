import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/auth/server';

export default async function ArtistSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  // Check if user is authenticated
  const user = await getUser();

  // Get the slug from params
  const { slug } = await params;

  // If user is not authenticated, redirect to sign-in
  if (!user) {
    redirect('/sign-in?callbackUrl=' + encodeURIComponent(`/artist/${slug}/overview`));
  }

  // If user is authenticated, redirect to the overview page
  redirect(`/artist/${slug}/overview`);
}