import { ArtistProvider } from "@/providers/artist-provider";
import { QueryClient } from "@tanstack/react-query";
import { getArtist } from "@/actions/artist";
import { ArtistNavbar } from "@/components/features/artist-details/artist-navbar";

export default async function ArtistLayout({
    params,
    children
}: {
    params: Promise<{ slug: string }>,
    children: React.ReactNode
}) {

    const { slug } = await params;

    // prefetch the artist data with useQuery
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
        queryKey: ['artist', slug],
        queryFn: () => getArtist(slug),
    });

    // Get the prefetched data from the cache
    const artist = queryClient.getQueryData(['artist', slug]);

    return (
        <div className="flex flex-col w-full min-h-screen">
            <ArtistProvider initialArtist={artist}>
                <ArtistNavbar artist={artist} />
                <div className="flex-1 overflow-auto">
                    {children}
                </div>
            </ArtistProvider>
        </div>
    )
}    