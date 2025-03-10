"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { monthlyListenersData } from './points';

const formatNumber = (num) => {
    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`;
    }
    return num;
};


const TimeRangeSelector = ({ selectedRange, onRangeChange, color = "#E5234A" }) => {
    const ranges = [
        { value: "1m", label: "1m" },
        { value: "3m", label: "3m" },
        { value: "6m", label: "6m" },
        { value: "ytd", label: "YTD" },
        { value: "1y", label: "1y" },
        { value: "all", label: "All" },
    ];

    return (
        <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground mr-2">Zoom</span>
            {ranges.map((range) => (
                <button
                    key={range.value}
                    onClick={() => onRangeChange(range.value)}
                    className={`px-2 py-1 text-xs rounded-md ${selectedRange === range.value
                        ? "text-white"
                        : "text-muted-foreground hover:bg-muted"
                        }`}
                    style={{ backgroundColor: selectedRange === range.value ? color : 'transparent' }}
                >
                    {range.label}
                </button>
            ))}
        </div>
    );
};

// Default YouTube SVG icon
const DefaultYouTubeIcon = ({ color }) => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill={color}>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
);

export function DailyViews({
    color = "#E5234A",
    title = "Daily Views",
    description = "YouTube daily view count over time",
    svgIcon
}) {
    const [timeRange, setTimeRange] = React.useState("all");

    const filteredData = React.useMemo(() => {
        const now = new Date();
        const data = [...monthlyListenersData];

        switch (timeRange) {
            case "1m":
                const oneMonthAgo = new Date(now);
                oneMonthAgo.setMonth(now.getMonth() - 1);
                return data.filter(item => new Date(item.date) >= oneMonthAgo);
            case "3m":
                const threeMonthsAgo = new Date(now);
                threeMonthsAgo.setMonth(now.getMonth() - 3);
                return data.filter(item => new Date(item.date) >= threeMonthsAgo);
            case "6m":
                const sixMonthsAgo = new Date(now);
                sixMonthsAgo.setMonth(now.getMonth() - 6);
                return data.filter(item => new Date(item.date) >= sixMonthsAgo);
            case "ytd":
                const startOfYear = new Date(now.getFullYear(), 0, 1);
                return data.filter(item => new Date(item.date) >= startOfYear);
            case "1y":
                const oneYearAgo = new Date(now);
                oneYearAgo.setFullYear(now.getFullYear() - 1);
                return data.filter(item => new Date(item.date) >= oneYearAgo);
            case "all":
            default:
                return data;
        }
    }, [timeRange]);

    // Find min and max for better chart scaling
    const maxListeners = Math.max(...filteredData.map(d => d.monthly_listeners));
    const minListeners = Math.min(...filteredData.map(d => d.monthly_listeners));

    // Calculate padding for Y-axis
    const yAxisMax = maxListeners + (maxListeners * 0.1);
    const yAxisMin = Math.max(0, minListeners - (minListeners * 0.1));

    // Use provided SVG icon or default
    const IconComponent = svgIcon || (() => <DefaultYouTubeIcon color={color} />);

    return (
        <Card className="w-full bg-[#121212] text-white border-t-[3px]" style={{ borderTopColor: color }}>
            < CardHeader className="pb-2" >
                <div className="flex items-center justify-between" >
                    <div className="flex items-center space-x-2">
                        <IconComponent />
                        <CardTitle>{title}</CardTitle>
                    </div >
                    <TimeRangeSelector
                        selectedRange={timeRange}
                        onRangeChange={setTimeRange}
                        color={color}
                    />
                </div >
                <CardDescription className="text-gray-400">
                    {description}
                </CardDescription>
            </CardHeader >
            <CardContent>
                <div className="h-[400px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={filteredData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorListeners" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="#9CA3AF"
                                tick={{ fill: '#9CA3AF' }}
                                tickFormatter={(value) => {
                                    const date = new Date(value);
                                    return `${date.toLocaleString('default', { month: 'short' })} '${date.getFullYear().toString().substr(-2)}`;
                                }}
                            />
                            <YAxis
                                domain={[yAxisMin, yAxisMax]}
                                stroke="#9CA3AF"
                                tick={{ fill: '#9CA3AF' }}
                                tickFormatter={formatNumber}
                                width={60}
                            />
                            <Line
                                type="monotone"
                                dataKey="monthly_listeners"
                                stroke={color}
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 6, fill: color, stroke: "#121212", strokeWidth: 2 }}
                                fillOpacity={1}
                                fill="url(#colorListeners)"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-6 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg uppercase text-gray-400 text-sm">Current</h3>
                        <div className="text-4xl font-bold" style={{ color }}>
                            {formatNumber(filteredData[filteredData.length - 1]?.monthly_listeners || 0)}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card >
    );
} 