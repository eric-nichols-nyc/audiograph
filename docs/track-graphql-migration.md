# Track GraphQL Migration

## Overview

This document outlines the steps to migrate the track-related features from REST to GraphQL, specifically focusing on the `MusicStreaming` component.

## Database Structure

- `tracks` table: Contains track information (title, platform ID, thumbnail, stream counts)
- `artist_tracks` table: Junction table linking artists to tracks with additional metadata

## Migration Steps

### Step 1: Add Track Type and Query to GraphQL Schema

1. Add Track type to schema:

```graphql
type Track {
  id: ID!
  title: String!
  thumbnail_url: String!
  stream_count_total: String!
  platform: String!
  track_id: String!
}

extend type Artist {
  topTracks: [Track!]
}
```

2. Update resolver to join artist_tracks with tracks and return top 10 by stream count:

```typescript
// In resolver
const { data: tracks } = await supabase
  .from("artist_tracks")
  .select(
    `
    *,
    track:tracks(*)
  `
  )
  .eq("artist_id", id)
  .order("stream_count_total", { foreignTable: "tracks", ascending: false })
  .limit(10);
```

3. Test query in Apollo Studio:

```graphql
query GetArtistTracks($id: ID!) {
  artist(id: $id) {
    id
    name
    topTracks {
      id
      title
      thumbnail_url
      stream_count_total
    }
  }
}
```

### Step 2: Update MusicStreaming Component

1. Move the GraphQL query to a separate file for reusability:

   - Create `src/graphql/queries/tracks.ts`
   - Move the `GET_ARTIST_TRACKS` query there
   - Add proper TypeScript types for the response

2. Update the `MusicStreaming` component:

   - Remove TanStack Query import and hook
   - Remove Spotify-specific logic
   - Use Apollo Client's `useQuery` with our GraphQL query
   - Map the GraphQL response to match the component's expected format:
     ```typescript
     {
       id: track.id,
       title: track.title,
       artist: data.artist.name,
       streams: track.stream_count_total,
       image: track.thumbnail_url
     }
     ```

3. Test the migration:
   - Verify loading states work
   - Verify error handling works
   - Verify track data displays correctly
   - Verify image thumbnails load properly
