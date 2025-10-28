# GraphQL Implementation Documentation

## Overview

This document outlines the GraphQL implementation in the AudioGPraph project, including the schema design, resolver patterns, and caching strategy.

## Migration from REST to GraphQL

### Why GraphQL?

The project was migrated from REST to GraphQL to achieve:

1. **Reduced Network Requests**: Instead of multiple REST endpoints for artist details, metrics, tracks, videos, and similar artists, a single GraphQL query fetches all needed data
2. **Type Safety**: GraphQL's schema provides built-in type checking and documentation
3. **Flexible Data Fetching**: Clients can request exactly the data they need
4. **Improved Caching**: Centralized caching strategy using Redis

### Migration Steps

1. **Schema Definition**:

   - Analyzed existing REST endpoints and data structures
   - Created corresponding GraphQL types
   - Defined relationships between types

2. **Resolver Implementation**:

   - Converted REST endpoint logic to GraphQL resolvers
   - Maintained existing Supabase queries
   - Added Redis caching layer

3. **Client Updates**:

   - Replaced TanStack Query with Apollo Client
   - Updated components to use GraphQL queries
   - Implemented client-side caching

4. **Performance Optimizations**:
   - Added sorting at both database and application levels
   - Implemented data limits (e.g., top 3 videos, top 5 similar artists)
   - Added Redis caching with appropriate TTLs

## Schema Design

The GraphQL schema is defined in `src/app/api/graphql/route.ts` and includes the following types:

```graphql
type Artist {
  id: ID!
  name: String!
  metrics: [Metric!]
  topTracks: [Track!]
  videos: [Video!]
  similarArtists: [SimilarArtist!]
}

type Metric {
  value: Float!
  metric_type: String!
  date: String!
  platform: String!
}

type Track {
  id: ID!
  title: String!
  thumbnail_url: String!
  stream_count_total: String!
  platform: String!
  track_id: String!
}

type Video {
  id: ID!
  title: String!
  video_id: String!
  platform: String!
  view_count: String!
  daily_view_count: String
  thumbnail_url: String!
  published_at: String
}

type SimilarArtist {
  id: ID!
  name: String!
  similarity_score: Float!
}
```

## Resolver Implementation

### Artist Query

The main query resolver fetches artist data from multiple Supabase tables and combines them into a single response. Here's how it works:

1. **Cache Check**:

   - First checks Redis cache for existing artist data
   - Uses the cache key format: `artist:${id}:details`

2. **Data Fetching** (if not cached):

   - Artist details from `artists` table
   - Metrics from `artist_metrics` table
   - Top tracks from `artist_tracks` join with `tracks`
   - Videos from `artist_videos` join with `videos`
   - Similar artists from `similar_artists` join with `artists`

3. **Sorting and Limits**:
   - Top tracks are sorted by `stream_count_total` (descending)
   - Videos are sorted by `view_count` (descending)
   - Similar artists are sorted by `similarity_score` (descending)
   - Tracks are limited to top 10
   - Videos are limited to top 3
   - Similar artists are limited to top 5

### Video Sorting Implementation

Videos are sorted in two stages to ensure reliable ordering:

1. **Database Level**:

   ```typescript
   .order('view_count', { foreignTable: 'videos', ascending: false })
   ```

2. **Application Level**:
   ```typescript
   .sort((a, b) => {
     const viewCountA = parseInt(a.view_count) || 0;
     const viewCountB = parseInt(b.view_count) || 0;
     return viewCountB - viewCountA;
   })
   ```

### Similar Artists Implementation

Similar artists are fetched and sorted by similarity score:

```typescript
.from('similar_artists')
.select(`
  similar_artist:artists(
    id,
    name
  ),
  similarity_score
`)
.eq('artist_id', id)
.order('similarity_score', { ascending: false })
.limit(5)
```

The data is then mapped to match the GraphQL schema:

```typescript
similarArtists?.map((sa) => ({
  id: sa.similar_artist.id,
  name: sa.similar_artist.name,
  similarity_score: sa.similarity_score,
}));
```

## Caching Strategy

### Redis Configuration

The Redis client is configured in `src/lib/redis.ts` using Upstash Redis. Configuration includes:

- TLS support for secure connections
- Connection retry logic
- Singleton pattern to prevent multiple connections

### Cache TTLs

Different data types have different Time To Live (TTL) values:

```typescript
export const CACHE_TTL = {
  ARTIST: 3600, // 1 hour
  METRICS: 300, // 5 minutes
  TRACKS: 1800, // 30 minutes
  VIDEOS: 1800, // 30 minutes
};
```

### Cache Management

Cache utilities are provided in `scripts/cache-utils.ts`:

- `clearArtistCache(artistId)`: Clears cache for a specific artist
- `clearAllArtistsCache()`: Clears all artist caches

To clear the cache:

```bash
npx tsx scripts/clear-cache.ts clearAll          # Clear all caches
npx tsx scripts/clear-cache.ts clearArtist <id>  # Clear specific artist cache
```

## Type Safety

The implementation uses TypeScript interfaces to ensure type safety:

```typescript
interface ArtistData {
  id: string;
  name: string;
  metrics: Array<{...}>;
  topTracks: Array<{...}>;
  videos: Array<{...}>;
  similarArtists: Array<{
    id: string;
    name: string;
    similarity_score: number;
  }>;
}
```

## Environment Configuration

Required environment variables:

- `REDIS_URL`: Upstash Redis REST API URL
- `UPSTASH_REDIS_REST_TOKEN`: Upstash Redis authentication token

## Best Practices

1. **Cache First**: Always check cache before hitting the database
2. **Proper Sorting**: Implement sorting at both database and application levels
3. **Error Handling**: Each database operation includes error checking
4. **Type Safety**: Use TypeScript interfaces for all data structures
5. **Resource Limits**: Implement reasonable limits on data fetching
6. **Cache Invalidation**: Provide tools for managing cache lifecycle

## Testing and Debugging

### Cache Management

To test or debug caching issues:

1. Use the cache utilities to clear specific or all caches
2. Monitor Redis memory usage and hit rates
3. Adjust TTLs based on data freshness requirements

### GraphQL Playground

The GraphQL endpoint at `/api/graphql` provides a playground for:

- Testing queries
- Exploring the schema
- Debugging resolver issues

### Common Issues

1. **Sorting Inconsistencies**:
   - Check both database and application-level sorting
   - Verify data types (string vs number) for sort fields
2. **Cache Misses**:
   - Verify Redis connection
   - Check key formats
   - Monitor TTL values
3. **Performance**:
   - Use the Apollo Client DevTools
   - Monitor query execution times
   - Check cache hit rates
