import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { gql } from 'graphql-tag';
import { createClient } from '@/lib/supabase/server';
import { getCachedData, setCachedData, CACHE_TTL, getCacheKey } from '@/lib/redis';

interface ArtistData {
  id: string;
  name: string;
  metrics: Array<{
    value: number;
    metric_type: string;
    date: string;
    platform: string;
  }>;
  topTracks: Array<{
    id: string;
    title: string;
    thumbnail_url: string;
    stream_count_total: string;
    platform: string;
    track_id: string;
  }>;
  videos: Array<{
    id: string;
    title: string;
    video_id: string;
    platform: string;
    view_count: string;
    daily_view_count?: string;
    thumbnail_url: string;
    published_at?: string;
  }>;
  similarArtists: Array<{
    id: string;
    name: string;
    similarity_score: number;
  }>;
}

interface ArtistConnection {
  artist: {
    id: string;
    name: string;
    [key: string]: unknown;
  };
  similarArtists: Array<{
    id: string;
    name: string;
    image_url: string | null;
    genres: string[];
    similarity_score: number;
  }>;
}

// Define your GraphQL schema
const typeDefs = gql`
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
    image_url: String
    genres: [String!]!
  }

  type Artist {
    id: ID!
    name: String!
    slug: String!
    metrics: [Metric!]
    topTracks: [Track!]
    videos: [Video!]
    similarArtists(limit: Int): [SimilarArtist!]
  }

  type ArtistConnection {
    artist: Artist!
    similarArtists: [SimilarArtist!]!
  }

  type Query {
    artist(id: ID!): Artist
    artistsBySlugs(slugs: [String!]!): [Artist!]!
    artists(ids: [ID!]!): [Artist!]!
    artistConnections(ids: [ID!]!): [ArtistConnection!]!
  }
`;

// Define your resolvers
const resolvers = {
  Query: {
    artistsBySlugs: async (parent: unknown, { slugs }: { slugs: string[] }) => {
      console.log('GraphQL Resolver - Received slugs:', slugs);
      const supabase = await createClient();

      // First get the artists by slugs
      const { data: artists, error } = await supabase
        .from('artists')
        .select('*')
        .in('slug', slugs);

      console.log('GraphQL Resolver - Artists query result:', artists);
      console.log('GraphQL Resolver - Artists query error:', error);

      if (error) throw new Error('Failed to fetch artists by slugs');
      if (!artists || artists.length === 0) return [];

      // Get metrics for all artists, filtering for Spotify metrics
      const { data: metrics, error: metricsError } = await supabase
        .from('artist_metrics')
        .select('*')
        .in('artist_id', artists.map(a => a.id))
        .eq('platform', 'spotify');

      console.log('GraphQL Resolver - Metrics query result:', metrics);
      console.log('GraphQL Resolver - Metrics query error:', metricsError);

      if (metricsError) throw new Error('Failed to fetch metrics');

      // Map metrics to artists
      const result = artists.map(artist => ({
        ...artist,
        metrics: metrics?.filter(m => m.artist_id === artist.id) || []
      }));

      console.log('GraphQL Resolver - Final result:', result);
      return result;
    },

    artists: async (parent: unknown, { ids }: { ids: string[] }) => {
      const supabase = await createClient();
      const { data: artists, error } = await supabase
        .from('artists')
        .select('*')
        .in('id', ids);

      if (error) throw new Error('Failed to fetch artists by ids');

      // Get metrics for all artists
      const { data: metrics, error: metricsError } = await supabase
        .from('artist_metrics')
        .select('*')
        .in('artist_id', ids);

      if (metricsError) throw new Error('Failed to fetch metrics');

      // Map metrics to artists
      return artists.map(artist => ({
        ...artist,
        metrics: metrics.filter(m => m.artist_id === artist.id)
      }));
    },

    artist: async (parent: unknown, { id }: { id: string }) => {
      // Try to get complete artist data from cache
      const cachedArtist = await getCachedData<ArtistData>(getCacheKey.artist(id));
      if (cachedArtist) {
        return cachedArtist;
      }

      const supabase = await createClient();

      // Get artist details
      const { data: artist, error: artistError } = await supabase
        .from('artists')
        .select('*')
        .eq('id', id)
        .single();

      if (artistError) throw new Error('Artist not found');

      // Get artist metrics
      const { data: metrics, error: metricsError } = await supabase
        .from('artist_metrics')
        .select('*')
        .eq('artist_id', id);

      if (metricsError) throw new Error('Failed to fetch metrics');

      // Get top tracks
      const { data: artistTracks, error: tracksError } = await supabase
        .from('artist_tracks')
        .select(`
          *,
          track:tracks(*)
        `)
        .eq('artist_id', id)
        .order('stream_count_total', { foreignTable: 'tracks', ascending: false })
        .limit(10);

      if (tracksError) throw new Error('Failed to fetch tracks');

      // Get videos through the junction table - limit to 3
      const { data: artistVideos, error: videosError } = await supabase
        .from('artist_videos')
        .select(`
          *,
          video:videos(
            id,
            title,
            video_id,
            platform,
            view_count,
            daily_view_count,
            thumbnail_url,
            published_at
          )
        `)
        .eq('artist_id', id)
        .order('view_count', { foreignTable: 'videos', ascending: false })
        .limit(3);

      if (videosError) throw new Error('Failed to fetch videos');

      // Get similar artists
      const { data: similarArtists, error: similarArtistsError } = await supabase
        .from('similar_artists')
        .select(`
          artist2_id,
          similarity_score,
          similar_artist:artists!similar_artists_artist2_id_fkey(
            id,
            name,
            image_url,
            genres
          )
        `)
        .eq('artist1_id', id)
        .order('similarity_score', { ascending: false })
        .limit(5);

      console.log('DEBUG - Raw similar artists query result:', JSON.stringify(similarArtists, null, 2));

      if (similarArtistsError) {
        console.error('Similar artists error:', similarArtistsError);
        throw new Error('Failed to fetch similar artists');
      }

      // Map similar artists data
      const transformedSimilarArtists = (similarArtists as unknown as Array<{
        artist2_id: string;
        similarity_score: number;
        similar_artist: {
          id: string;
          name: string;
          image_url: string | null;
          genres: string[];
        };
      }>).map(sa => ({
        id: sa.similar_artist.id,
        name: sa.similar_artist.name,
        image_url: sa.similar_artist.image_url,
        genres: sa.similar_artist.genres || [],
        similarity_score: sa.similarity_score
      }));

      console.log('Mapped similar artists:', JSON.stringify(transformedSimilarArtists, null, 2));

      // Map the joined data
      const topTracks = artistTracks?.map(at => at.track) || [];
      const videos = artistVideos?.map(av => av.video)
        .sort((a, b) => {
          const viewCountA = parseInt(a.view_count) || 0;
          const viewCountB = parseInt(b.view_count) || 0;
          return viewCountB - viewCountA;
        }) || [];

      const result: ArtistData = {
        ...artist,
        metrics: metrics || [],
        topTracks,
        videos,
        similarArtists: transformedSimilarArtists
      };

      // Cache the complete result
      await setCachedData(getCacheKey.artist(id), result, CACHE_TTL.ARTIST);

      return result;
    },

    artistConnections: async (_parent: unknown, { ids }: { ids: string[] }): Promise<ArtistConnection[]> => {
      console.log('GraphQL Resolver - artistConnections called with ids:', ids);
      const supabase = await createClient();

      // Get the artists first
      const { data: artists, error: artistsError } = await supabase
        .from('artists')
        .select('*')
        .in('id', ids);

      if (artistsError) {
        console.error('Failed to fetch artists:', artistsError);
        throw new Error('Failed to fetch artists');
      }

      if (!artists) {
        return [];
      }

      // For each artist, get their similar artists
      const connections = await Promise.all(artists.map(async (artist) => {
        // Try to get from cache first
        const cacheKey = `similar_artists:${artist.id}`;
        const cachedSimilarArtists = await getCachedData<ArtistConnection['similarArtists']>(cacheKey);

        if (cachedSimilarArtists) {
          return {
            artist,
            similarArtists: cachedSimilarArtists
          };
        }

        // If not in cache, fetch from database
        const { data: similarArtists, error: similarError } = await supabase
          .from('similar_artists')
          .select(`
            artist2_id,
            similarity_score,
            similar_artist:artists!similar_artists_artist2_id_fkey(
              id,
              name,
              image_url,
              genres
            )
          `)
          .eq('artist1_id', artist.id)
          .order('similarity_score', { ascending: false })
          .limit(5);

        if (similarError) {
          console.error('Failed to fetch similar artists:', similarError);
          throw new Error('Failed to fetch similar artists');
        }

        if (!similarArtists) {
          return {
            artist,
            similarArtists: []
          };
        }

        // Transform the data to match our schema
        const transformedSimilarArtists = (similarArtists as unknown as Array<{
          artist2_id: string;
          similarity_score: number;
          similar_artist: {
            id: string;
            name: string;
            image_url: string | null;
            genres: string[];
          };
        }>).map(sa => ({
          id: sa.similar_artist.id,
          name: sa.similar_artist.name,
          image_url: sa.similar_artist.image_url,
          genres: sa.similar_artist.genres || [],
          similarity_score: sa.similarity_score
        }));

        // Cache the results
        await setCachedData(cacheKey, transformedSimilarArtists, CACHE_TTL.ARTIST);

        return {
          artist,
          similarArtists: transformedSimilarArtists
        };
      }));

      console.log('GraphQL Resolver - artistConnections returning connections:', connections);
      return connections;
    },
  },
  Artist: {
    videos: async (parent: { id: string }) => {
      const supabase = await createClient();
      const { data: videos, error } = await supabase
        .from('videos')
        .select('id, title, thumbnail_url, view_count')
        .eq('artist_id', parent.id)
        .order('view_count', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching videos:', error);
        throw new Error('Failed to fetch videos');
      }

      return videos || [];
    }
  }
};

// 1. Create Apollo Server instance
// This sets up a new GraphQL server with our schema and resolvers
const server = new ApolloServer({
  typeDefs,  // The GraphQL schema
  resolvers, // The functions that resolve the schema fields
});

// 2. Create the Next.js API route handler
// startServerAndCreateNextHandler does several things:
// - Initializes the Apollo Server
// - Creates a handler compatible with Next.js Edge Runtime
// - Sets up proper request/response handling
// - Handles CORS and other HTTP concerns
const handler = startServerAndCreateNextHandler(server);

// 3. Export the handler for both GET and POST methods
// This allows the GraphQL endpoint to handle:
// - GET requests (typically for introspection queries)
// - POST requests (for actual GraphQL operations)
// The endpoint will be available at /api/graphql
export { handler as GET, handler as POST };

// Flow of a GraphQL request:
// 1. Client sends request to /api/graphql
// 2. Next.js routes the request to this handler
// 3. startServerAndCreateNextHandler processes the request
// 4. Apollo Server executes the GraphQL operation
// 5. Resolvers fetch data from Supabase/Redis
// 6. Results are sent back to the client 