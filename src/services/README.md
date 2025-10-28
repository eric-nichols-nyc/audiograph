# Spotify Service

The Spotify service provides a robust interface for interacting with the Spotify Web API, including caching capabilities using Redis for improved performance and reduced API calls.

## Features

- Artist search and retrieval
- Top tracks fetching
- Track information and images
- Redis caching for all operations
- Automatic token management and caching

## Configuration

### Environment Variables

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
REDIS_URL=redis://localhost:6379
```

### Redis Caching

All API responses are cached using Redis with the following TTLs:

- Access Token: 50 minutes (tokens expire after 1 hour)
- Artist Data: 1 hour
- Track Data: 1 hour
- Search Results: 1 hour

Cache keys follow this pattern:

- `spotify:access_token` - Spotify API access token
- `spotify:artist:{id}` - Artist data
- `spotify:artist:{id}:top-tracks` - Artist's top tracks
- `spotify:search:{query}` - Search results
- `spotify:formatted-tracks:{id}` - Formatted track data

## Usage

### Basic Usage

```typescript
import { SpotifyService } from "@/services/spotify-service";

const spotify = new SpotifyService();

// Search for artists
const artists = await spotify.searchArtist("Queen");

// Get artist details
const artist = await spotify.getArtist("0TnOYISbd1XYRBk9myaseg");

// Get artist's top tracks
const tracks = await spotify.getArtistTopTracks("0TnOYISbd1XYRBk9myaseg");
```

### With Formatted Tracks

```typescript
import { getTopTracks } from "@/actions/spotify";

// Get formatted tracks with additional metadata
const formattedTracks = await getTopTracks("0TnOYISbd1XYRBk9myaseg");
```

## Error Handling

The service includes comprehensive error handling:

- Failed API requests throw descriptive errors
- Cache misses are logged for debugging
- Network errors are caught and logged
- Invalid responses are properly handled

## Redis Implementation

### Cache Operations

```typescript
// Get cached data
const data = await redis.get<T>(key);

// Cache data with TTL
await redis.set(key, value, ttl);

// Delete cached data
await redis.del(key);

// Invalidate by pattern
await redis.invalidateByPattern("spotify:artist:*");
```

### Benefits Over unstable_cache

1. **Persistence**: Data survives server restarts
2. **Shared Cache**: Works across multiple server instances
3. **Fine-grained Control**: Custom TTLs and invalidation
4. **Monitoring**: Better visibility into cache operations
5. **Pattern-based Invalidation**: Clear related cache entries

## Best Practices

1. Always check cache before making API calls
2. Use appropriate TTLs based on data freshness requirements
3. Implement proper error handling
4. Log cache hits/misses for monitoring
5. Use type-safe operations with generics
6. Follow consistent cache key patterns

## Development

To run locally:

1. Install Redis (`brew install redis` on macOS)
2. Start Redis server (`redis-server`)
3. Set environment variables
4. Run the application
