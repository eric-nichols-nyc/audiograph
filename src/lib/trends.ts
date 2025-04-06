/**
 * Basic structure for a single metric data point
 */
interface MetricPoint {
    value: number;
    date: string;
}

interface TrendResult {
    trend: number;
    startDate: string;
    endDate: string;
    startValue: number;
    endValue: number;
    message: string;
    isComplete: boolean;  // Indicates if we had data for the full period
    dataPointCount: number;  // How many data points were available
}

/**
 * Calculates the basic trend for Spotify followers over a specific time period
 * 
 * @param dataPoints - Array of metric points with values and dates
 * @param daysToAnalyze - Number of days to analyze (default 28)
 * @returns TrendResult object containing the trend calculation and metadata
 */
export function calculateSpotifyFollowersTrend(
    dataPoints: MetricPoint[],
    daysToAnalyze: number = 28
): TrendResult {
    // 1. Make sure we have at least 2 points to calculate a trend
    if (dataPoints.length < 2) {
        return {
            trend: 0,
            startDate: "",
            endDate: "",
            startValue: 0,
            endValue: 0,
            message: "Not enough data points to calculate trend",
            isComplete: false,
            dataPointCount: dataPoints.length
        };
    }

    // 2. Sort data points by date (oldest first)
    const sortedPoints = [...dataPoints].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // 3. Use the actual data points to determine the date range
    const lastPoint = sortedPoints[sortedPoints.length - 1];
    const firstPoint = sortedPoints[0];

    // 4. Calculate the trend
    const trend = lastPoint.value - firstPoint.value;

    // 5. Check if we have complete data
    const daysCovered = Math.ceil(
        (new Date(lastPoint.date).getTime() - new Date(firstPoint.date).getTime())
        / (1000 * 60 * 60 * 24)
    );
    // Consider data complete if it covers at least 90% of the analysis period
    const isComplete = daysCovered >= (daysToAnalyze - 3);

    // 6. Return trend data with completeness information
    return {
        trend,
        startDate: firstPoint.date,
        endDate: lastPoint.date,
        startValue: firstPoint.value,
        endValue: lastPoint.value,
        message: trend > 0 ? "Gaining followers" : trend < 0 ? "Losing followers" : "No change",
        isComplete,
        dataPointCount: sortedPoints.length
    };
} 