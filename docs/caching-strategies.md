# Caching Strategies: Redis vs Next.js unstable_cache

This document explains the differences between Redis and Next.js `unstable_cache` in the context of our `getSimilarArtists` function.

## Current Implementation (Redis)

```typescript
export async function getSimilarArtists(
  artistId: string,
  limit = 10
): Promise<SimilarArtist[]> {
  const cacheKey = `artist:${artistId}:similar:${limit}`;
  const cachedData = await redis.get<SimilarArtist[]>(cacheKey);

  if (cachedData) {
    return cachedData;
  }
  // ... fetch data from Supabase
}
```

### Redis Advantages

1. **Distributed Caching**: Redis is a separate service that can be shared across multiple instances of your application
2. **Persistence**: Data can survive application restarts
3. **Fine-grained Control**:
   - Custom expiration times
   - Manual cache invalidation
   - Memory management
4. **Cross-Request Caching**: Cache is shared across all requests and servers
5. **Rich Data Structures**: Lists, sets, sorted sets, hashes

### Redis Disadvantages

1. **Additional Infrastructure**: Requires setting up and maintaining a Redis server
2. **Network Latency**: Additional network hop to Redis server
3. **Cost**: Hosting a Redis instance adds to infrastructure costs
4. **Complexity**: Need to handle connection management and errors

## Alternative: Next.js unstable_cache

```typescript
import { unstable_cache } from "next/cache";

export const getSimilarArtists = unstable_cache(
  async (artistId: string, limit = 10): Promise<SimilarArtist[]> => {
    const supabase = createBrowserSupabase();
    const { data, error } = await supabase
      .from("artist_similarities")
      .select(/* ... */);

    if (error) return [];
    return data;
  },
  ["similar-artists"],
  {
    revalidate: 3600, // 1 hour
    tags: ["similar-artists"],
  }
);
```

### unstable_cache Advantages

1. **Zero Configuration**: Built into Next.js, no additional services needed
2. **Automatic Cache Management**: Next.js handles cache invalidation
3. **No Additional Cost**: Uses local memory and filesystem
4. **Simpler Implementation**: No need to manage cache keys or handle cache errors
5. **Request Deduplication**: Automatically dedupes identical requests

### unstable_cache Disadvantages

1. **Limited Control**: Less control over cache behavior
2. **Local to Instance**: Cache isn't shared across multiple instances
3. **Unstable API**: As the name suggests, the API might change
4. **Limited Data Types**: Only supports JSON-serializable data
5. **No Manual Invalidation**: Harder to manually invalidate specific cache entries

## When to Use Which

### Use Redis When:

- You need distributed caching across multiple servers
- You require manual cache invalidation
- You need to share cache across different services
- You want fine-grained control over caching behavior
- You're handling sensitive data that needs encryption at rest

### Use unstable_cache When:

- You're building a smaller application
- You don't want to manage additional infrastructure
- You're okay with per-instance caching
- You want simpler implementation
- Your data is JSON-serializable

## Current Choice Explanation

We chose Redis for `getSimilarArtists` because:

1. Similar artists data needs to be shared across all instances
2. We need manual cache invalidation for immediate updates
3. The data structure is complex and needs type safety
4. We want control over cache expiration times
5. The application might scale to multiple instances
