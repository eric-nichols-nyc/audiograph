import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { gql } from 'graphql-tag';
import { createClient } from '@/lib/supabase/server';

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

  type Artist {
    id: ID!
    name: String!
    metrics: [Metric!]
    topTracks: [Track!]
  }

  type Query {
    artist(id: ID!): Artist
  }
`;

// Define your resolvers
const resolvers = {
  Query: {
    artist: async (parent: unknown, { id }: { id: string }) => {
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

      // Map the joined data to our Track type
      const topTracks = artistTracks?.map(at => at.track) || [];

      return {
        ...artist,
        metrics: metrics || [],
        topTracks,
      };
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