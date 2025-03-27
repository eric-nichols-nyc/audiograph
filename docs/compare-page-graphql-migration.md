# Compare Page GraphQL Migration

## Overview

This document outlines the step-by-step process of migrating the compare page components from direct Supabase queries to GraphQL, with a focus on using a flexible URL structure for comparing different entity types.

## 1. URL Structure Change

### Current Implementation

- Uses artist IDs in search params: `?entity1=<artistId>&entity2=<artistId>`
- Limited to comparing artists only
- Not descriptive of the entity type being compared

### New Implementation

- Flexible URL structure: `?type=<entityType>&entity1=<slug>&entity2=<slug>`
- Supports multiple entity types:
  ```typescript
  // Examples:
  /compare?type=artists&entity1=taylor-swift&entity2=ed-sheeran
  /compare?type=tracks&entity1=anti-hero&entity2=shape-of-you
  /compare?type=videos&entity1=shake-it-off&entity2=thinking-out-loud
  ```
- Uses slugs for reliable entity identification
- SEO-friendly and readable

## 2. GraphQL Schema Updates

```graphql
# Shared interface for comparable entities
interface Comparable {
  id: ID!
  name: String!
  slug: String!
}

type Artist implements Comparable {
  id: ID!
  name: String!
  slug: String!
  metrics: [ArtistMetric!]!
}

type Track implements Comparable {
  id: ID!
  name: String!
  slug: String!
  artist: Artist!
  streamMetrics: [StreamMetric!]!
}

type Video implements Comparable {
  id: ID!
  name: String!
  slug: String!
  artist: Artist!
  viewMetrics: [ViewMetric!]!
}

type Query {
  compareEntities(type: EntityType!, slugs: [String!]!): [Comparable!]!
}

enum EntityType {
  ARTISTS
  TRACKS
  VIDEOS
}
```

## 3. Migration Steps

1. **Update CompareContainer Component**

   - Add entity type state management
   - Update URL parameter handling for type and slugs
   - Create type-specific comparison views

   ```typescript
   const [entityType, setEntityType] = useState<EntityType>("ARTISTS");
   const [entity1Slug, setEntity1Slug] = useState<string>();
   const [entity2Slug, setEntity2Slug] = useState<string>();
   ```

2. **Create GraphQL Query**

   - Create query in `src/graphql/queries/compare.ts`
   - Use artist names/slugs as parameters

   ```graphql
   query CompareEntities($type: EntityType!, $slugs: [String!]!) {
     compareEntities(type: $type, slugs: $slugs) {
       id
       name
       slug
       ... on Artist {
         metrics {
           platform
           value
           metric_type
         }
       }
       ... on Track {
         artist {
           name
         }
         streamMetrics {
           platform
           value
           date
         }
       }
       ... on Video {
         artist {
           name
         }
         viewMetrics {
           platform
           value
           date
         }
       }
     }
   }
   ```

3. **Update Resolver**

   - Add compareEntities resolver with type-based logic
   - Handle entity lookup by type and slug
   - Implement proper error handling for:
     - Invalid entity type
     - Entity not found
     - Invalid combinations

4. **Update EntitySelect Component** (renamed from ArtistSelect)

   - Make component type-aware
   - Update dropdown to show entity-specific details
   - Add filtering by entity type
   - Handle entity search based on type

5. **Create New Hook**
   - Create `useCompareEntitiesGraphQL` hook
   - Handle entity type and URL parameters
   - Manage loading and error states
   - Format data based on entity type

## 4. Implementation Order

1. First: Update URL structure and CompareContainer
2. Second: Create GraphQL schema with entity types
3. Third: Update EntitySelect component
4. Fourth: Create type-specific comparison views

## 5. Considerations

1. **Entity Type Handling**

   - Clear separation between different entity types
   - Type-specific comparison logic
   - Proper type validation

2. **URL Structure**

   - Clear indication of what's being compared
   - Easy to parse and generate
   - Handles special characters in slugs

3. **Component Architecture**

   - Reusable comparison components
   - Type-specific visualizations
   - Shared metrics handling

4. **User Experience**
   - Clear entity type selection
   - Intuitive switching between types
   - Proper error handling for invalid combinations

Would you like to start with implementing any of these steps? I recommend beginning with the URL structure update in the CompareContainer component.

## 6. ArtistSelect Component Changes

### Current Implementation

```typescript
interface ArtistSelectProps {
  position: 1 | 2;
  selectedId?: string;
  otherSelectedId?: string;
  onSelect: (artistId: string) => void;
  onClear: () => void;
  sticky?: boolean;
}
```

### New Implementation

```typescript
interface ArtistSelectProps {
  position: 1 | 2;
  selectedSlug?: string;
  otherSelectedSlug?: string;
  onSelect: (slug: string) => void;
  onClear: () => void;
  sticky?: boolean;
}
```

### Required Changes

1. **Props Update**

   - Rename `selectedId` to `selectedSlug`
   - Rename `otherSelectedId` to `otherSelectedSlug`
   - Update `onSelect` callback to pass slug instead of ID

2. **Artist Selection Logic**

   ```typescript
   // Change from
   const selectedArtist = selectedId
     ? artists?.find((a) => a.id.toLowerCase() === selectedId.toLowerCase())
     : null;

   // To
   const selectedArtist = selectedSlug
     ? artists?.find((a) => a.slug.toLowerCase() === selectedSlug.toLowerCase())
     : null;
   ```

3. **Available Artists Filter**

   ```typescript
   // Change from
   const availableArtists =
     artists?.filter(
       (artist) =>
         !otherSelectedId ||
         artist.id.toLowerCase() !== otherSelectedId.toLowerCase()
     ) || [];

   // To
   const availableArtists =
     artists?.filter(
       (artist) =>
         !otherSelectedSlug ||
         artist.slug.toLowerCase() !== otherSelectedSlug.toLowerCase()
     ) || [];
   ```

4. **Artist Selection Handler**

   ```typescript
   // Change from
   const handleArtistSelect = (artist: Artist) => {
     onSelect(artist.id);
     setIsFocused(false);
     setSearchQuery("");
   };

   // To
   const handleArtistSelect = (artist: Artist) => {
     onSelect(artist.slug);
     setIsFocused(false);
     setSearchQuery("");
   };
   ```

### Parent Component Updates

The CompareContainer will need to:

1. Store slugs instead of IDs in state
2. Update URL parameters with slugs
3. Pass slugs to ArtistSelect components

### Type Updates

Ensure the Artist type includes the slug field:

```typescript
interface Artist {
  id: string;
  name: string;
  slug: string;
  // ... other fields
}
```

Would you like me to proceed with implementing these changes to the ArtistSelect component?
