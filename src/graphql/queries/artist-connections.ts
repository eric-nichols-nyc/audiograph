import { gql } from '@apollo/client';

export interface SimilarArtist {
    id: string;
    name: string;
    image_url: string | null;
    genres: string[];
    similarity_score: number;
}

export interface ArtistConnection {
    artist: {
        id: string;
        name: string;
    };
    similarArtists: SimilarArtist[];
}

export interface GetArtistConnectionsData {
    artistConnections: ArtistConnection[];
}

export interface GetArtistConnectionsVars {
    ids: string[];
}

export const GET_ARTIST_CONNECTIONS = gql`
  query GetArtistConnections($ids: [ID!]!) {
    artistConnections(ids: $ids) {
      artist {
        id
        name
      }
      similarArtists {
        id
        name
        image_url
        genres
        similarity_score
      }
    }
  }
`; 