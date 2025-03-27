# Migrating Spotify Performance to GraphQL

This document outlines the migration of the Spotify Performance component from REST API to GraphQL.

## Overview

The Spotify Performance component displays and compares various Spotify metrics between two artists, including:

- Artist Popularity
- Total Streams
- Monthly Listeners
- Spotify Followers

The migration involved:

1. Creating a GraphQL query for Spotify metrics
2. Implementing a React hook for data fetching and transformation
3. Updating the component to use GraphQL

## GraphQL Query

Created a new query in `src/graphql/queries/spotify-performance.ts`:

```typescript
export const GET_SPOTIFY_PERFORMANCE = gql`
  query GetSpotifyPerformance($slugs: [String!]!) {
    artistsBySlugs(slugs: $slugs) {
      id
      name
      metrics {
        platform
        metric_type
        value
        date
      }
    }
  }
`;
```

## Implementation Details

### 1. React Hook

Created `useSpotifyPerformance` hook in `src/hooks/graphql/use-spotify-performance.ts`:

```typescript
export function useSpotifyPerformance() {
  const searchParams = useSearchParams();
  const artist1 = searchParams.get("artist1");
  const artist2 = searchParams.get("artist2");

  const slugs = [artist1, artist2].filter(Boolean) as string[];
  const { data, loading, error } = useQuery(GET_SPOTIFY_PERFORMANCE, {
    variables: { slugs },
  });

  // Transform data for component
  const transformArtistData = (artist) => ({
    name: artist.name,
    popularity: getLatestMetric(artist.metrics, "popularity"),
    monthly_listeners: getLatestMetric(artist.metrics, "monthly_listeners"),
    followers: getLatestMetric(artist.metrics, "followers"),
    total_streams: getLatestMetric(artist.metrics, "total_streams"),
  });

  return {
    artist1Data: data?.artistsBySlugs[0]
      ? transformArtistData(data.artistsBySlugs[0])
      : null,
    artist2Data: data?.artistsBySlugs[1]
      ? transformArtistData(data.artistsBySlugs[1])
      : null,
    isLoading: loading,
    error: error?.message || null,
  };
}
```

### 2. Component Updates

Updated `SpotifyPerformance` component to use the new hook:

```typescript
export function SpotifyPerformance() {
  const { artist1Data, artist2Data, isLoading, error } =
    useSpotifyPerformance();

  // ... render logic ...
}
```

## Key Changes

1. **Data Fetching**:

   - Replaced REST API calls with GraphQL query
   - Moved data fetching logic to a custom hook
   - Added proper TypeScript interfaces

2. **Data Transformation**:

   - Added utility function to get latest metrics
   - Filtered metrics by platform and type
   - Maintained the same data structure for the UI

3. **Error Handling**:
   - Consistent error handling through GraphQL
   - Type-safe error responses
   - Better error messages

## Benefits

1. **Type Safety**: Full TypeScript support through GraphQL schema
2. **Efficient Data Loading**: Only fetches required fields
3. **Consistent Data Fetching**: Aligned with application's GraphQL architecture
4. **Better Developer Experience**: Autocomplete and type checking
5. **Reduced Network Requests**: Single request for all metrics

## Testing

Test the migration by:

1. Comparing different artists
2. Verifying all metrics are displayed correctly
3. Checking loading states
4. Testing error scenarios
5. Validating metric calculations

## Future Improvements

1. Add caching for frequently accessed metrics
2. Implement real-time metric updates
3. Add historical data comparison
4. Consider adding more Spotify metrics
