# Top Connections GraphQL Migration

This document outlines the migration of the Top Connections feature from REST/Redis to GraphQL.

## Current Implementation

The current implementation uses:

- Direct Supabase queries via `getSimilarArtists` function
- Redis caching for similar artists data
- Server actions for data fetching
- Client-side state management with React useState

### Current Data Flow

1. Component gets artist slugs from URL parameters
2. Converts slugs to IDs using `getArtistId`
3. Fetches similar artists using `getSimilarArtists`
4. Manages loading and error states
5. Renders connections in a grid layout

## Migration Plan

### 1. GraphQL Schema Updates

Add the following types and queries to the schema:

```graphql
type SimilarArtist {
  id: ID!
  name: String!
  imageUrl: String!
  genres: [String!]!
  similarityScore: Float!
}

extend type Artist {
  similarArtists(limit: Int): [SimilarArtist!]!
}

extend type Query {
  artistConnections(ids: [ID!]!): [Artist!]!
}
```

### 2. Resolver Implementation

Create a resolver that:

- Accepts an array of artist IDs
- Returns artists with their similar connections
- Maintains the existing caching strategy using Redis

```typescript
const resolvers = {
  Query: {
    artistConnections: async (_: any, { ids }: { ids: string[] }) => {
      return Promise.all(
        ids.map(async (id) => {
          const artist = await getArtistById(id);
          const similarArtists = await getSimilarArtists(id, 5);
          return {
            ...artist,
            similarArtists,
          };
        })
      );
    },
  },
};
```

### 3. New GraphQL Hook

Create a custom hook for the connections query:

```typescript
export function useArtistConnections(artistIds: string[]) {
  const { data, loading, error } = useQuery(GET_ARTIST_CONNECTIONS, {
    variables: { ids: artistIds },
    skip: artistIds.length === 0,
  });

  return {
    artists: data?.artistConnections || [],
    isLoading: loading,
    error,
  };
}
```

### 4. Component Updates

Update the TopConnections component to:

- Use the new GraphQL hook
- Remove direct Supabase queries
- Maintain the same UI structure
- Handle loading and error states consistently

### 5. Testing Steps

1. Verify data consistency

   - Compare response structure
   - Validate similarity scores
   - Check image URLs and genres

2. Performance testing

   - Monitor query execution time
   - Verify caching effectiveness
   - Test with multiple artists

3. Error handling
   - Test invalid artist IDs
   - Verify loading states
   - Check error messages

## Benefits

1. **Reduced Complexity**

   - Single data fetching layer
   - Consistent error handling
   - Simplified state management

2. **Better Performance**

   - Fewer HTTP requests
   - Optimized data fetching
   - Maintained caching strategy

3. **Type Safety**
   - GraphQL schema validation
   - TypeScript integration
   - Consistent data structure

## Migration Steps

1. Implement GraphQL schema changes
2. Create and test resolvers
3. Implement new GraphQL hook
4. Update TopConnections component
5. Test thoroughly
6. Deploy changes
7. Monitor performance
8. Remove old implementation

## Rollback Plan

If issues arise:

1. Keep old implementation files
2. Maintain feature flags
3. Ready to switch back to old implementation
4. Monitor error rates during migration
