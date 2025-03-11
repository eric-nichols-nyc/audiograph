import { ArrowDown, ArrowUp, Play } from "lucide-react"
import Image from "next/image"

export function SpotifyPerformance() {
    return (
        <div className="bg-gray-50 p-6 rounded-lg max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
                <div className="w-5 h-5 bg-green-500 rounded-full"></div>
                <h1 className="text-gray-600 text-xl font-medium">Spotify Performance</h1>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
                {/* Rankings Section */}
                <div className="flex justify-center items-center gap-16 mb-10">
                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                            <span>Spotify rank</span>
                            <ArrowUp className="w-4 h-4 text-green-500" />
                            <span className="text-green-500 font-medium">5</span>
                        </div>
                        <span className="text-5xl font-bold">14</span>
                    </div>

                    <div className="flex flex-col items-start">
                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                            <span className="text-red-500 font-medium">-</span>
                            <ArrowDown className="w-4 h-4 text-red-500" />
                            <span>Spotify rank</span>
                        </div>
                        <span className="text-5xl font-bold text-gray-400">33</span>
                    </div>
                </div>

                {/* Pop Rankings */}
                <div className="flex justify-center items-center gap-16 mb-10">
                    <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-sm">Pop</span>
                            <span className="font-semibold">10</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-sm">Mainstream Pop</span>
                            <span className="font-semibold">12</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-start gap-2">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">19</span>
                            <span className="text-gray-500 text-sm">Pop</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">23</span>
                            <span className="text-gray-500 text-sm">Mainstream Pop</span>
                        </div>
                    </div>
                </div>

                {/* Current Stats */}
                <div className="mb-10">
                    <h2 className="text-center font-semibold text-lg mb-6">Current Stats</h2>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-right font-semibold">110M</div>
                        <div className="text-center text-gray-500 text-sm">Monthly Listeners</div>
                        <div className="text-left font-semibold">60.8M</div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="relative h-6">
                            <div className="absolute inset-0 bg-green-500 rounded-full"></div>
                        </div>
                        <div></div>
                        <div className="relative h-6">
                            <div className="absolute inset-0 bg-green-200 rounded-full"></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-right font-semibold">N/A</div>
                        <div className="text-center text-gray-500 text-sm">Playlists Reach</div>
                        <div className="text-left font-semibold">N/A</div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-right font-semibold">33.3M</div>
                        <div className="text-center text-gray-500 text-sm">Followers</div>
                        <div className="text-left font-semibold">35.3M</div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="relative h-6">
                            <div className="absolute inset-0 bg-green-200 rounded-full"></div>
                        </div>
                        <div></div>
                        <div className="relative h-6">
                            <div className="absolute inset-0 bg-green-500 rounded-full"></div>
                        </div>
                    </div>
                </div>

                {/* Performance Past 3 Months */}
                <div className="mb-10">
                    <h2 className="text-center font-semibold text-lg mb-6">Performance Past 3 Months</h2>
                    <p className="text-center text-gray-500">No Spotify statistics for these artists.</p>
                </div>

                {/* Current Top Track */}
                <div className="mb-10">
                    <h2 className="text-center font-semibold text-lg mb-6">Current Top Track</h2>

                    <div className="flex justify-center gap-8">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Image
                                    src="/placeholder.svg?height=60&width=60"
                                    alt="Die With A Smile"
                                    width={60}
                                    height={60}
                                    className="rounded"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded">
                                    <div className="bg-white rounded-full p-1">
                                        <Play className="w-4 h-4 text-black" fill="currentColor" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="font-medium text-sm">Die With A Smile</p>
                                <p className="text-gray-500 text-xs">Lady Gaga, Bruno Mars</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Image
                                    src="/placeholder.svg?height=60&width=60"
                                    alt="Last Friday Night"
                                    width={60}
                                    height={60}
                                    className="rounded"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded">
                                    <div className="bg-white rounded-full p-1">
                                        <Play className="w-4 h-4 text-black" fill="currentColor" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="font-medium text-sm">Last Friday Night (T.G.I.F.)</p>
                                <p className="text-gray-500 text-xs">Katy Perry</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Stats */}
                <div className="mb-6">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-right font-semibold">291.7M</div>
                        <div className="text-center text-gray-500 text-sm">Streams Past Month</div>
                        <div className="text-left font-semibold">27.4M</div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="relative h-6">
                            <div className="absolute inset-0 bg-green-500 rounded-full"></div>
                        </div>
                        <div></div>
                        <div className="relative h-6">
                            <div className="absolute inset-0 bg-green-200 rounded-full w-[20%]"></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-right font-semibold">N/A</div>
                        <div className="text-center text-gray-500 text-sm">Playlist Reach</div>
                        <div className="text-left font-semibold">330.4K</div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div></div>
                        <div></div>
                        <div className="relative h-6">
                            <div className="absolute inset-0 bg-green-500 rounded-full"></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-right font-semibold">N/A</div>
                        <div className="text-center text-gray-500 text-sm">Active Playlists</div>
                        <div className="text-left font-semibold">7</div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div></div>
                        <div></div>
                        <div className="relative h-6">
                            <div className="absolute inset-0 bg-green-500 rounded-full"></div>
                        </div>
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
        </div>
    )
}

