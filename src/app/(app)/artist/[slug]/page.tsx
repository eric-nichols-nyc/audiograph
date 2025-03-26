import { redirect } from "next/navigation";

export default async function ArtistSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/artist/${slug}/overview`);
}
