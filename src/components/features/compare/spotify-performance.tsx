import { CompareBarChart } from "./bar-chart";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getSpotifyData } from "@/actions/compare";

type SpotifyMetrics = {
    name: string;
    popularity: number;
    monthly_listeners: number;
    followers: number;
    total_streams: number;
}

export function SpotifyPerformance() {
    const searchParams = useSearchParams();
    const entity1 = searchParams.get('entity1');
    const entity2 = searchParams.get('entity2');
    const [artist1Data, setArtist1Data] = useState<SpotifyMetrics | null>(null);
    const [artist2Data, setArtist2Data] = useState<SpotifyMetrics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSpotifyData() {
            if (!entity1 || !entity2) return;

            setIsLoading(true);
            setError(null);

            try {
                const [artist1Metrics, artist2Metrics] = await Promise.all([
                    getSpotifyData(entity1),
                    getSpotifyData(entity2)
                ]);
                console.log('artist1Metrics', artist1Metrics);
                console.log('artist2Metrics', artist2Metrics);

                setArtist1Data(artist1Metrics);
                setArtist2Data(artist2Metrics);
            } catch (error) {
                console.error('Error fetching Spotify data:', error);
                setError('Failed to load Spotify metrics');
            } finally {
                setIsLoading(false);
            }
        }

        fetchSpotifyData();
    }, [entity1, entity2]);

    if (!entity1 || !entity2) return null;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[300px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 p-4 text-center">
                {error}
            </div>
        );
    }

    if (!artist1Data || !artist2Data) {
        return (
            <div className="text-red-500 p-4 text-center">
                Could not load Spotify metrics for both artists
            </div>
        );
    }

    return (
        <div className="bg-background p-6 rounded-lg w-full mx-auto">
            {/* Current Stats */}
            <div className="mb-10">
                <div className="mb-8">
                    <CompareBarChart
                        data={[
                            {
                                name: artist1Data.name,
                                value: artist1Data.popularity,
                                color: "rgb(34, 197, 94)" // Bright green
                            },
                            {
                                name: artist2Data.name,
                                value: artist2Data.popularity,
                                color: "rgb(134, 239, 172)" // Muted green
                            }
                        ]}
                        title="Artist Popularity"
                        valueFormatter={(value) => `${value}`}
                    />
                </div>
                <div className="mb-8">
                    <CompareBarChart
                        data={[
                            {
                                name: artist1Data.name,
                                value: artist1Data.total_streams,
                                color: "rgb(34, 197, 94)" // Bright green
                            },
                            {
                                name: artist2Data.name,
                                value: artist2Data.total_streams,
                                color: "rgb(134, 239, 172)" // Muted green
                            }
                        ]}
                        title="Total Streams"
                        valueFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                    />
                </div>
                <div className="mb-8">
                    <CompareBarChart
                        data={[
                            {
                                name: artist1Data.name,
                                value: artist1Data.monthly_listeners,
                                color: "rgb(34, 197, 94)" // Bright green
                            },
                            {
                                name: artist2Data.name,
                                value: artist2Data.monthly_listeners,
                                color: "rgb(134, 239, 172)" // Muted green
                            }
                        ]}
                        title="Monthly Listeners"
                        valueFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                    />
                </div>
                <div className="mb-8">
                    <CompareBarChart
                        data={[
                            {
                                name: artist1Data.name,
                                value: artist1Data.followers,
                                color: "rgb(34, 197, 94)" // Bright green
                            },
                            {
                                name: artist2Data.name,
                                value: artist2Data.followers,
                                color: "rgb(134, 239, 172)" // Muted green
                            }
                        ]}
                        title="Spotify Followers"
                        valueFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between text-blue-500 text-sm">
                <a href="#" className="hover:underline">
                    Check Artist&apos;s Analytics
                </a>
                <a href="#" className="hover:underline">
                    Check Artist&apos;s Analytics
                </a>
            </div>
        </div>
    );
}

