import { describe, it, expect } from 'vitest';
import { calculateSpotifyFollowersTrend } from '../src/lib/trends';

describe('calculateSpotifyFollowersTrend', () => {
    // Example 1: Complete data for 28 days
    const completeDataExample = [
        { value: 1000, date: '2024-02-01T00:00:00Z' },
        { value: 1100, date: '2024-02-07T00:00:00Z' },
        { value: 1200, date: '2024-02-14T00:00:00Z' },
        { value: 1250, date: '2024-02-21T00:00:00Z' },
        { value: 1300, date: '2024-02-28T00:00:00Z' },
    ];

    // Example 2: Incomplete data (only 2 points)
    const incompleteDataExample = [
        { value: 1000, date: '2024-02-01T00:00:00Z' },
        { value: 1300, date: '2024-02-28T00:00:00Z' },
    ];

    it('should calculate trend correctly with complete data', () => {
        const result = calculateSpotifyFollowersTrend(completeDataExample);

        expect(result).toMatchObject({
            trend: 300,  // 1300 - 1000
            startValue: 1000,
            endValue: 1300,
            startDate: '2024-02-01T00:00:00Z',
            endDate: '2024-02-28T00:00:00Z',
            isComplete: true,
            dataPointCount: 5,
            message: 'Gaining followers'
        });
    });

    it('should handle incomplete data correctly', () => {
        const result = calculateSpotifyFollowersTrend(incompleteDataExample);

        expect(result).toMatchObject({
            trend: 300,  // Same total change
            startValue: 1000,
            endValue: 1300,
            startDate: '2024-02-01T00:00:00Z',
            endDate: '2024-02-28T00:00:00Z',
            isComplete: true,  // Only 2 points instead of full coverage
            dataPointCount: 2,
            message: 'Gaining followers'
        });
    });

    it('should handle empty data array', () => {
        const result = calculateSpotifyFollowersTrend([]);

        expect(result).toMatchObject({
            trend: 0,
            startDate: '',
            endDate: '',
            startValue: 0,
            endValue: 0,
            isComplete: false,
            dataPointCount: 0,
            message: 'Not enough data points to calculate trend'
        });
    });

    it('should handle single data point', () => {
        const result = calculateSpotifyFollowersTrend([
            { value: 1000, date: '2024-02-01T00:00:00Z' }
        ]);

        expect(result).toMatchObject({
            trend: 0,
            startDate: '',
            endDate: '',
            startValue: 0,
            endValue: 0,
            isComplete: false,
            dataPointCount: 1,
            message: 'Not enough data points to calculate trend'
        });
    });
}); 