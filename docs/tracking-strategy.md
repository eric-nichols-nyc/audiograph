# Artist Metrics Tracking Strategy

## Overview

This document outlines our strategy for tracking and analyzing artist metrics across different platforms. We're starting with Spotify followers as our first metric to establish the pattern.

## Spotify Followers Tracking

### Data Structure

The raw data is stored in the `artist_metrics` table with the following relevant fields:

- `artist_id`: The ID of the artist
- `value`: The number of followers
- `metric_type`: "followers"
- `platform`: "spotify"
- `date`: Timestamp of when the metric was recorded

### Trend Calculation Process

1. **Data Retrieval**

   - Query the `artist_metrics` table for a specific artist
   - Filter for `platform = 'spotify'` and `metric_type = 'followers'`
   - Get data points for the desired time period (default: past 28 days)

2. **Data Quality Checks**

   - Ensure at least 2 data points exist for calculation
   - Track how many data points are available in the period
   - Flag if we have complete data for the entire period

3. **Trend Calculation**
   ```typescript
   interface TrendResult {
     trend: number; // Difference between start and end values
     startDate: string; // Start date of analysis period
     endDate: string; // End date of analysis period
     startValue: number; // Initial follower count
     endValue: number; // Final follower count
     message: string; // Human-readable trend description
     isComplete: boolean; // Whether we have full period coverage
     dataPointCount: number; // Number of available data points
   }
   ```

### Example SQL Query

```sql
SELECT value, date
FROM artist_metrics
WHERE artist_id = :artist_id
  AND platform = 'spotify'
  AND metric_type = 'followers'
  AND date >= NOW() - INTERVAL '28 days'
ORDER BY date ASC;
```

### Implementation Notes

- Default analysis period is 28 days
- Trend calculation handles incomplete data gracefully
- Returns metadata about data completeness
- Provides human-readable trend messages

## Next Steps

- Implement basic example with sample data
- Add visualization of trend data
- Expand to other metrics and time periods
- Add more sophisticated trend analysis methods

## Future Considerations

- Expanding to other metrics (monthly listeners, track plays, etc.)
- Adding trend period options (weekly, monthly, quarterly)
- Statistical analysis for more sophisticated trend detection
- Anomaly detection in metric changes
