export type MonthlyListenersDataPoint = {
    date: string;
    listeners: number;
};

// Sample data for monthly listeners over time
export const monthlyListenersData: MonthlyListenersDataPoint[] = [
    { date: "Jan 2023", listeners: 1250000 },
    { date: "Feb 2023", listeners: 1320000 },
    { date: "Mar 2023", listeners: 1450000 },
    { date: "Apr 2023", listeners: 1380000 },
    { date: "May 2023", listeners: 1520000 },
    { date: "Jun 2023", listeners: 1680000 },
    { date: "Jul 2023", listeners: 1750000 },
    { date: "Aug 2023", listeners: 1830000 },
    { date: "Sep 2023", listeners: 1920000 },
    { date: "Oct 2023", listeners: 2050000 },
    { date: "Nov 2023", listeners: 2180000 },
    { date: "Dec 2023", listeners: 2350000 },
    { date: "Jan 2024", listeners: 2420000 },
    { date: "Feb 2024", listeners: 2580000 },
    { date: "Mar 2024", listeners: 2650000 },
];

// Configuration for the chart
export const chartConfig = {
    monthlyListeners: {
        label: "Monthly Listeners",
        theme: {
            light: "#1DB954", // Spotify green
            dark: "#1ED760"   // Slightly brighter Spotify green for dark mode
        }
    }
}; 