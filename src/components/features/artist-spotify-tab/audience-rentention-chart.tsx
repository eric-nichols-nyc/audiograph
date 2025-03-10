"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { monthlyListenersData } from './points';

const formatNumber = (num: number): string => {
    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
};

interface DataPoint {
    date: string;
    monthly_listeners: number;
}

interface TimeRangeSelectorProps {
    selectedRange: string;
    onRangeChange: (range: string) => void;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ selectedRange, onRangeChange }) => {
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
                        ? "bg-green-500 text-white"
                        : "text-muted-foreground hover:bg-muted"
                        }`}
                >
                    {range.label}
                </button>
            ))}
        </div>
    );
};

export function AudienceRetention() {
    const [timeRange, setTimeRange] = React.useState("all");

    const filteredData = React.useMemo(() => {
        const now = new Date();
        const data: DataPoint[] = [...monthlyListenersData];

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

    return (
        <Card className="w-full bg-[#121212] text-white border-t-[3px] border-t-[#1DB954]">
            < CardHeader className="pb-2" >
                <div className="flex items-center justify-between" >
                    <div className="flex items-center space-x-2">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#1DB954" >
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.371-.694.495-1.055.241-2.886-1.766-6.517-2.166-10.79-1.187-.411.097-.824-.188-.92-.599-.097-.41.188-.824.599-.92 4.692-1.073 8.807-.62 12.045 1.371.362.227.486.694.241 1.055zm1.474-3.267c-.302.464-.863.615-1.327.313-3.301-2.028-8.325-2.614-12.226-1.429-.513.152-1.053-.143-1.205-.656-.151-.513.143-1.053.656-1.205 4.458-1.352 9.994-.686 13.755 1.648.464.302.615.863.313 1.327zm.127-3.403C15.17 8.454 8.804 8.229 5.132 9.36c-.614.19-1.265-.15-1.455-.765-.19-.614.15-1.265.765-1.455 4.277-1.297 11.385-1.047 15.86 1.62.554.329.736 1.045.407 1.599-.33.554-1.045.736-1.599.407z" />
                        </svg >
                        <CardTitle>Monthly Listeners</CardTitle>
                    </div >
                    <TimeRangeSelector
                        selectedRange={timeRange}
                        onRangeChange={setTimeRange}
                    />
                </div >
                <CardDescription className="text-gray-400">
                    Spotify monthly listener count over time
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
                                    <stop offset="5%" stopColor="#1DB954" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#1DB954" stopOpacity={0} />
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
                                stroke="#1DB954"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 6, fill: "#1DB954", stroke: "#121212", strokeWidth: 2 }}
                                fillOpacity={1}
                                fill="url(#colorListeners)"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-6 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg uppercase text-gray-400 text-sm">Current</h3>
                        <div className="text-4xl font-bold text-[#1DB954]">
                            {formatNumber(filteredData[filteredData.length - 1]?.monthly_listeners || 0)}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card >
    );
}

// "use client";

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//     ChartContainer,
//     ChartTooltip,
//     ChartTooltipContent,
// } from "@/components/ui/chart";
// import {
//     Line,
//     LineChart,
//     XAxis,
//     YAxis,
// } from "recharts";
// import { monthlyListenersData, chartConfig } from "@/app/(app)/artist/[slug]/spotify/data";

// export function MonthlyListenersChart() {
//     // Format large numbers with commas
//     const formatNumber = (value: number) => {
//         return new Intl.NumberFormat("en-US").format(value);
//     };

//     return (
//         <Card className="w-full">
//             <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                     <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="24"
//                         height="24"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         className="text-spotify"
//                     >
//                         <circle cx="12" cy="12" r="10" />
//                         <path d="M8 11.2a1 1 0 0 1 1.6-.8l5.8 3.6a1 1 0 0 1 0 1.6l-5.8 3.6a1 1 0 0 1-1.6-.8z" />
//                     </svg>
//                     Spotify Monthly Listeners
//                 </CardTitle>
//                 <CardDescription>
//                     Track the growth of monthly listeners over time
//                 </CardDescription>
//             </CardHeader>
//             <CardContent>
//                 <div className="h-[300px]">
//                     <ChartContainer
//                         config={chartConfig}
//                         className="h-full w-full"
//                     >
//                         <LineChart
//                             data={monthlyListenersData}
//                             margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
//                         >
//                             <XAxis
//                                 dataKey="date"
//                                 tickLine={false}
//                                 axisLine={false}
//                                 tickMargin={10}
//                                 className="text-xs"
//                             />
//                             <YAxis
//                                 tickFormatter={(value) => {
//                                     return `${(value / 1000000).toFixed(1)}M`;
//                                 }}
//                                 tickLine={false}
//                                 axisLine={false}
//                                 tickMargin={10}
//                                 className="text-xs"
//                             />
//                             <ChartTooltip
//                                 content={
//                                     <ChartTooltipContent
//                                         labelFormatter={(label) => `${label}`}
//                                         formatter={(value) => [`${formatNumber(Number(value))} listeners`, "Monthly Listeners"]}
//                                     />
//                                 }
//                             />
//                             <Line
//                                 type="monotone"
//                                 dataKey="listeners"
//                                 name="monthlyListeners"
//                                 strokeWidth={2}
//                                 activeDot={{ r: 6 }}
//                             />
//                         </LineChart>
//                     </ChartContainer>
//                 </div>
//             </CardContent>
//         </Card>
//     );
// } 