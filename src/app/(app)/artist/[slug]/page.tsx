import { redirect } from "next/navigation";

export default async function ArtistSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Check if user is authenticated
  // Get the slug from params
  const { slug } = await params;

  // If user is authenticated, redirect to the overview page
  redirect(`/artist/${slug}/overview`);
}
