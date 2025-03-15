import Image from "next/image";
import { Play } from "lucide-react";
import { CompareBarChart } from "./bar-chart";
export function VideoContainer() {
    return (
        <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <Play className="text-red-600 mr-2" /> Most Viewed YouTube Video Alltime
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left artist video */}
                <div className="space-y-4">
                    <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
                        <Image
                            src="/placeholder.svg?height=300&width=500"
                            alt="Video thumbnail"
                            width={500}
                            height={300}
                            className="object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center">
                                <Play className="h-6 w-6 text-black" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                            <p className="text-white font-medium">David Guetta - Titanium ft. Sia</p>
                        </div>
                    </div>
                </div>

                {/* Right artist video */}
                <div className="space-y-4">
                    <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
                        <Image
                            src="/placeholder.svg?height=300&width=500"
                            alt="Video thumbnail"
                            width={500}
                            height={300}
                            className="object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center">
                                <Play className="h-6 w-6 text-black" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                            <p className="text-white font-medium">Calvin Harris - This Is What You Came For ft. Rihanna</p>
                        </div>
                    </div>
                </div>

            </div>
            <CompareBarChart />

        </div>
    )
}