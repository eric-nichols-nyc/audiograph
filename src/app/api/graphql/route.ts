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

  type Artist {
    id: ID!
    name: String!
    metrics: [Metric!]
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

            return {
                ...artist,
                metrics: metrics || [],
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