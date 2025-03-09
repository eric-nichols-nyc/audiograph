import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MetricItem = ({ label, value, subLabel }) => (
    <div className="rounded-md bg-zinc-900 p-4 mb-3 flex flex-1">
        <div className="flex justify-between items-center">
            <div>
                <p className="text-zinc-200 font-medium">{label}</p>
                <p className="text-xs text-zinc-400">{subLabel}</p>
            </div>
            <p className="text-green-500 text-2xl font-bold">{value}</p>
        </div>
    </div>
);

export const SpotifyPerformanceCard = () => {
    const metrics = [
        { label: "Monthly Listeners", value: "80.6M", subLabel: "Current" },
        { label: "Followers", value: "104M", subLabel: "Total" },
        { label: "Popularity", value: "92%", subLabel: "Current" },
    ];

    return (
        <div className="w-full mx-auto">
            <Card className="bg-zinc-950 border-zinc-800 text-white">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-green-500"
                        >
                            <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" fill="currentColor" />
                            <path d="M16.7839 16.7097C16.6388 16.9505 16.3665 17.0703 16.0843 17.0096C14.0172 16.5327 11.5443 16.4294 9.23633 17.0023C8.92285 17.0849 8.60547 16.9263 8.51221 16.6129C8.41894 16.2993 8.57755 15.982 8.89111 15.8887C11.4453 15.2559 14.158 15.3738 16.4599 15.9101C16.742 15.9708 16.9289 16.4687 16.7839 16.7097ZM17.4846 14.5227C17.3033 14.8166 16.9506 14.9497 16.6567 14.7684C14.256 13.5146 10.9187 13.2297 8.28903 13.9429C7.95703 14.0337 7.61133 13.8435 7.52051 13.5117C7.43066 13.1797 7.62085 12.834 7.95264 12.7432C10.9675 11.9356 14.6606 12.2595 17.4118 13.6949C17.7056 13.8762 17.866 14.2289 17.4846 14.5227ZM17.5711 12.2476C14.6973 10.7908 10.0595 10.6705 7.40136 11.4982C7.00097 11.6068 6.58203 11.3711 6.47339 10.9707C6.36476 10.5703 6.60059 10.1514 7.00097 10.0427C10.0254 9.10986 15.1387 9.25488 18.4541 10.9426C18.8911 11.1729 19.0605 11.6875 18.8301 12.1245C18.5997 12.5615 18.0852 12.7307 17.5711 12.2476Z" fill="#000" />
                        </svg>
                        PERFORMANCE
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-3 max-h-full overflow-y-auto pr-2">
                        {metrics.map((metric, index) => (
                            <MetricItem
                                key={index}
                                label={metric.label}
                                value={metric.value}
                                subLabel={metric.subLabel}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
