import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MetricItem = ({ label, value, subLabel, color = "#E5234A" }) => (
    <div className="rounded-md bg-zinc-900 p-4 mb-3 flex flex-1">
        <div className="flex justify-between items-center">
            <div>
                <p className="text-zinc-200 font-medium">{label}</p>
                <p className="text-xs text-zinc-400">{subLabel}</p>
            </div>
            <p className="text-2xl font-bold" style={{ color }}>{value}</p>
        </div>
    </div>
);

// Default YouTube icon
const DefaultYouTubeIcon = ({ color }) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ color }}
    >
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="currentColor" />
    </svg>
);

export const PerformanceCard = ({
    color = "#E5234A",
    title = "YouTube Performance",
    icon,
    metrics = [
        { label: "Video Likes", value: "80.6M", subLabel: "Current" },
        { label: "Subscribers", value: "104M", subLabel: "Total" },
        { label: "Channel Views", value: "92%", subLabel: "Current" },
    ]
}) => {
    // Use provided icon or default
    const IconComponent = icon || (() => <DefaultYouTubeIcon color={color} />);

    return (
        <div className="w-full mx-auto">
            <Card className="bg-zinc-950 border-zinc-800 text-white">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <IconComponent />
                        {title}
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
                                color={color}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
