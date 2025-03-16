import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Video } from '@/types/video';
interface VideoCardProps {
    video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
    return (
        <Card className="overflow-hidden">
            <div className="aspect-video relative">
                <Image
                    fill
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded capitalize">
                    {video.platform}
                </div>
            </div>
            <CardContent className="p-4">
                <h3 className="font-medium line-clamp-1">{video.title}</h3>
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                    <span>{new Date(video.published_at).toLocaleDateString()}</span>
                    <div className="flex gap-3">
                        <span>{video.view_count.toLocaleString()} views</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 