# Migrating Most Viewed Videos to GraphQL

This document outlines the migration of the Most Viewed Videos component from REST API to GraphQL.

## Overview

The Most Viewed Videos component displays and compares the most popular YouTube videos between two artists. The migration involved:

1. Adding video-related types to the GraphQL schema
2. Creating a dedicated videos resolver
3. Implementing a React hook for data fetching
4. Updating the component to use GraphQL

## GraphQL Schema Changes

Added video-related types to the schema:

```graphql
type Video {
  id: ID!
  title: String!
  thumbnail_url: String!
  view_count: Int!
}

type Artist {
  # ... existing fields ...
  videos: [Video!]!
}
```

## Implementation Details

### 1. GraphQL Query

Created a new query in `src/graphql/queries/most-viewed-videos.ts`:

```typescript
export const GET_MOST_VIEWED_VIDEOS = gql`
  query GetMostViewedVideos($slugs: [String!]!) {
    artistsBySlugs(slugs: $slugs) {
      id
      name
      videos {
        id
        title
        thumbnail_url
        view_count
      }
    }
  }
`;
```

### 2. Videos Resolver

Implemented a resolver in `src/app/api/graphql/route.ts` to fetch videos from Supabase:

```typescript
Artist: {
  videos: async (parent: { id: string }) => {
    const supabase = await createClient();
    const { data: videos, error } = await supabase
      .from("videos")
      .select("id, title, thumbnail_url, view_count")
      .eq("artist_id", parent.id)
      .order("view_count", { ascending: false })
      .limit(10);

    if (error) throw new Error("Failed to fetch videos");
    return videos || [];
  };
}
```

### 3. React Hook

Created `useMostViewedVideos` hook in `src/hooks/graphql/use-most-viewed-videos.ts`:

```typescript
export function useMostViewedVideos() {
  const searchParams = useSearchParams();
  const artist1 = searchParams.get("artist1");
  const artist2 = searchParams.get("artist2");

  const slugs = [artist1, artist2].filter(Boolean) as string[];
  const { data, loading, error } = useQuery(GET_MOST_VIEWED_VIDEOS, {
    variables: { slugs },
    skip: !slugs.length,
  });

  // Transform data for component
  const videos = !data
    ? []
    : data.artistsBySlugs.map((artist) => ({
        title: artist.videos[0]?.title || "",
        thumbnailUrl: artist.videos[0]?.thumbnail_url || "",
        views: artist.videos[0]?.view_count || 0,
        artistName: artist.name,
      }));

  return { videos, isLoading: loading, error };
}
```

### 4. Component Updates

Updated `MostViewedVideos` component to use the new hook:

```typescript
export function MostViewedVideos() {
  const { videos, isLoading, error } = useMostViewedVideos();

  // ... rest of the component implementation
}
```

## Key Changes

1. **Data Fetching**:

   - Replaced REST API call with GraphQL query
   - Moved data fetching logic to a custom hook
   - Added proper TypeScript interfaces

2. **Error Handling**:

   - Consistent error handling through GraphQL
   - Type-safe error responses
   - Better error messages

3. **Performance**:
   - Reduced data overfetching
   - Optimized query with field selection
   - Ordered videos by view count at the database level

## Benefits

1. **Type Safety**: Full TypeScript support through GraphQL schema
2. **Efficient Data Loading**: Only fetches required fields
3. **Consistent Data Fetching**: Aligned with application's GraphQL architecture
4. **Better Developer Experience**: Autocomplete and type checking
5. **Reduced Network Requests**: Single request for all required data

## Testing

Test the migration by:

1. Comparing videos between two artists
2. Verifying view count comparisons
3. Checking loading states
4. Testing error scenarios
5. Validating thumbnail display

## Future Improvements

1. Add caching for frequently accessed videos
2. Implement pagination for more videos
3. Add video click handling for playback
4. Consider implementing real-time view count updates
