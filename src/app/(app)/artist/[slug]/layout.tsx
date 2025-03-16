import { ArtistProvider } from "@/providers/artist-provider";
import { ArtistNavbar } from "@/components/features/artist-details/artist-navbar";
import { notFound } from "next/navigation";
import { getArtistWithPlatformIds } from "@/actions/artist";

export default async function ArtistLayout({
    params,
    children
}: {
    params: Promise<{ slug: string }>,
    children: React.ReactNode
}) {
    const { slug } = await params;

    try {
        // Fetch artist data directly
        const artist = await getArtistWithPlatformIds(slug);
        console.log('Artist:', artist);
        if (!artist) {
            notFound();
        }

        return (
            <div className="flex flex-col w-full min-h-screen">
                <ArtistProvider initialArtist={artist}>
                    <ArtistNavbar />
                    <div className="flex-1 overflow-auto">
                        {children}
                    </div>
                </ArtistProvider>
            </div>
        );
    } catch (error) {
        console.error('Error loading artist:', error);
        notFound();
    }
}    