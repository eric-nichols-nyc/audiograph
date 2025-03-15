"use client"

import Image from "next/image";
import { Play } from "lucide-react";
import { CompareBarChart } from "./bar-chart";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { formatNumber } from "@/utils/number-format";
import { Video } from "@/types/videos";

type VideoResponse = {
    id: string;
    video_id: string;
    title: string;
    view_count: number;
    daily_view_count: number;
    published_at: string;
    thumbnail_url: string;
    artist_videos: Array<{
        artist_id: string;
        artists: {
            name: string;
        }[];
    }>;
}

export function VideoContainer() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();

    const entity1 = searchParams.get('entity1');
    const entity2 = searchParams.get('entity2');

    useEffect(() => {
        async function fetchMostViewedVideos() {
            if (!entity1 || !entity2) return;

            setIsLoading(true);
            setError(null);

            try {
                const supabase = createBrowserSupabase();

                console.log('Fetching videos for artists:', { entity1, entity2 });

                // Get top video for first artist
                const { data: data1, error: error1 } = await supabase
                    .from('videos')
                    .select(`
                        id,
                        video_id,
                        title,
                        view_count,
                        daily_view_count,
                        published_at,
                        thumbnail_url,
                        artist_videos!inner (
                            artist_id,
                            artists!inner (
                                name
                            )
                        )
                    `)
                    .eq('artist_videos.artist_id', entity1)
                    .order('view_count', { ascending: false })
                    .limit(1)
                    .single();

                // Get top video for second artist
                const { data: data2, error: error2 } = await supabase
                    .from('videos')
                    .select(`
                        id,
                        video_id,
                        title,
                        view_count,
                        daily_view_count,
                        published_at,
                        thumbnail_url,
                        artist_videos!inner (
                            artist_id,
                            artists!inner (
                                name
                            )
                        )
                    `)
                    .eq('artist_videos.artist_id', entity2)
                    .order('view_count', { ascending: false })
                    .limit(1)
                    .single();

                console.log('Database response:', { data1, error1, data2, error2 });

                if (error1 || error2) throw error1 || error2;

                if (!data1 || !data2) {
                    setError("Could not find videos for both artists");
                    return;
                }

                const formattedVideos = [data1, data2].map((record: VideoResponse) => ({
                    id: record.id,
                    video_id: record.video_id,
                    title: record.title,
                    view_count: record.view_count,
                    daily_view_count: record.daily_view_count,
                    published_at: record.published_at,
                    thumbnail_url: record.thumbnail_url,
                    views: record.view_count,
                    artist_name: record.artist_videos[0].artists[0].name
                }));

                console.log('Formatted videos:', formattedVideos);

                setVideos(formattedVideos);
            } catch (err) {
                console.error('Error fetching videos:', err);
                setError('Failed to load videos');
            } finally {
                setIsLoading(false);
            }
        }

        fetchMostViewedVideos();
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

    return (
        <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {videos.map(video => (
                    <div key={video.id} className="space-y-4">
                        <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-lg group cursor-pointer hover:ring-2 hover:ring-red-600 transition-all duration-200">
                            <Image
                                src={video.thumbnail_url}
                                alt={video.title}
                                fill
                                className="object-cover transform hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                                quality={95}
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-200" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-16 w-16 bg-white/90 rounded-full flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform duration-200">
                                    <Play className="h-8 w-8 text-black" fill="black" />
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6">
                                <p className="text-white font-semibold text-lg line-clamp-2 mb-2">{video.title}</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-white/90 text-sm">
                                        {formatNumber(video.view_count)} views
                                    </p>
                                    <span className="text-white/60">•</span>
                                    <p className="text-white/90 text-sm">
                                        {video.artist_name}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {videos.length === 2 && (
                <div className="mt-8">
                    <CompareBarChart
                        data={[
                            {
                                name: videos[0].artist_name,
                                value: videos[0].view_count,
                                color: "rgb(239, 68, 68)" // red-600
                            },
                            {
                                name: videos[1].artist_name,
                                value: videos[1].view_count,
                                color: "rgb(59, 130, 246)" // blue-500
                            }
                        ]}
                        title="Video Views Comparison"
                        valueFormatter={(value) => `${formatNumber(value)} views`}
                    />
                </div>
            )}
        </div>
    );
}