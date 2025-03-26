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
  }

  type Artist {
    id: ID!
    name: String!
    metrics: [Metric!]
    topTracks: [Track!]
    videos: [Video!]
    similarArtists: [SimilarArtist!]
  }

  type Query {
    artist(id: ID!): Artist
  }
`;

// Define your resolvers
const resolvers = {
  Query: {
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
          similar_artist:artists!inner(
            id,
            name
          ),
          similarity_score
        `)
        .eq('artist_id', id)
        .order('similarity_score', { ascending: false })
        .limit(5);

      if (similarArtistsError) throw new Error('Failed to fetch similar artists');

      // Map the joined data
      const topTracks = artistTracks?.map(at => at.track) || [];
      const videos = artistVideos?.map(av => av.video)
        .sort((a, b) => {
          const viewCountA = parseInt(a.view_count) || 0;
          const viewCountB = parseInt(b.view_count) || 0;
          return viewCountB - viewCountA;
        }) || [];

      // Map similar artists data
      const mappedSimilarArtists = (similarArtists || []).map(sa => ({
        id: sa.similar_artist[0].id,
        name: sa.similar_artist[0].name,
        similarity_score: sa.similarity_score
      }));

      const result: ArtistData = {
        ...artist,
        metrics: metrics || [],
        topTracks,
        videos,
        similarArtists: mappedSimilarArtists
      };

      // Cache the complete result
      await setCachedData(getCacheKey.artist(id), result, CACHE_TTL.ARTIST);

      return result;
    },
  },
};

// Create Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Create and export the API route handler
const handler = startServerAndCreateNextHandler(server);

export { handler as GET, handler as POST }; 