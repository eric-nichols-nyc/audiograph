# Migrating Compare Artists Page to GraphQL

This document outlines the migration of the artist comparison functionality from REST API calls to GraphQL.

## Overview

The compare artists page allows users to compare metrics between two artists. The migration involved:

1. Creating a new GraphQL query for fetching artist metrics
2. Implementing a GraphQL resolver for artist lookups by slugs
3. Creating React hooks for data fetching and transformation

## GraphQL Schema Changes

Added new types and queries to the GraphQL schema:

```graphql
type Query {
  artistsBySlugs(slugs: [String!]!): [Artist!]!
}

type Artist {
  id: ID!
  name: String!
  slug: String!
  metrics: [Metric!]!
}

type Metric {
  platform: String!
  metric_type: String!
  value: Float!
  date: String!
}
```

## Implementation Details

### 1. GraphQL Query

Created a new query in `src/graphql/queries/compare-metrics.ts`:

```typescript
export const COMPARE_METRICS = gql`
  query CompareArtistMetrics($slugs: [String!]!) {
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

### 2. React Hooks

Created two hooks for data fetching and transformation:

#### Base Hook (`useCompareArtistsGraphQL`)

- Handles the GraphQL query execution
- Manages loading and error states
- Provides basic data validation

```typescript
export function useCompareArtistsGraphQL(slugs: string[] = []) {
  const shouldSkip = !slugs.length || slugs.some((slug) => !slug);
  return useQuery(COMPARE_METRICS, {
    variables: { slugs },
    skip: shouldSkip,
  });
}
```

#### Chart Hook (`useCompareMetricsChart`)

- Gets artist slugs from URL parameters
- Transforms GraphQL data into chart-friendly format
- Handles metric aggregation and comparison

### 3. Component Updates

The `HorizontalStackedChartGraphQL` component now:

- Uses the new hooks for data fetching
- Displays loading and error states
- Renders comparison metrics in a stacked bar chart format

## Benefits

1. **Single Request**: All artist data is fetched in one GraphQL query
2. **Type Safety**: Full TypeScript support through GraphQL codegen
3. **Flexible Data Requirements**: Easy to modify data requirements without backend changes
4. **Reduced Data Transfer**: Only necessary fields are requested

## Future Improvements

1. Implement caching strategy for frequently compared artists
2. Add error boundaries for better error handling
3. Consider implementing batch loading for multiple artist comparisons
4. Add real-time updates for live metric changes

## Migration Steps

To migrate existing components:

1. Replace REST API calls with the new GraphQL hooks
2. Update components to handle the new data structure
3. Remove old REST-based code and endpoints
4. Update tests to reflect new GraphQL implementation

## Testing

Test the migration by:

1. Comparing different artists
2. Checking loading states
3. Verifying error handling
4. Ensuring metric calculations are accurate
5. Testing URL parameter handling
