import 'server-only';

// import { SpotifyArtist, SpotifyTrack } from '@/types/spotify';
import { env } from '@/env.mjs';
import { SpotifyApiTrack } from '@/types/track';
import { Artist } from '@/types/artist';
import * as redis from '@/lib/redis';

export class SpotifyService {
  private clientId = env.NEXT_PUBLIC_SPOTIFY_ID;
  private clientSecret = env.NEXT_PUBLIC_SPOTIFY_SECRET;

  private getAccessToken = async (): Promise<string> => {
    const cacheKey = 'spotify:access_token';
    const cachedToken = await redis.get<string>(cacheKey);

    if (cachedToken) {
      return cachedToken;
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${this.clientId}:${this.clientSecret}`
        ).toString('base64')}`,
      },
      body: 'grant_type=client_credentials',
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error('Failed to get access token');
    }

    // Cache token for 50 minutes (tokens expire after 1 hour)
    await redis.set(cacheKey, data.access_token, 3000);
    return data.access_token;
  };

  /**
   * Searches for artists in Spotify given a query string.
   */
  public searchArtist = async (query: string): Promise<Artist[]> => {
    const cacheKey = `spotify:search:${query}`;
    const cachedResult = await redis.get<Artist[]>(cacheKey);

    if (cachedResult) {
      return cachedResult;
    }

    const accessToken = await this.getAccessToken();
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        query
      )}&type=artist&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to search artists');
    }

    const data = await response.json();
    const artists = data.artists.items;

    // Cache for 1 hour
    await redis.set(cacheKey, artists, 3600);
    return artists;
  };

  public getArtist = async (id: string): Promise<Artist> => {
    const cacheKey = `spotify:artist:${id}`;
    const cachedArtist = await redis.get<Artist>(cacheKey);

    if (cachedArtist) {
      return cachedArtist;
    }

    const accessToken = await this.getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get artist');
    }

    const artist = await response.json();

    // Cache for 1 hour
    await redis.set(cacheKey, artist, 3600);
    return artist;
  };

  public getArtistData = async (spotify_id: string) => {
    const cacheKey = `spotify:artist:${spotify_id}:data`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const accessToken = await this.getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/artists/${spotify_id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get artist data');
    }

    const data = await response.json();

    // Cache for 1 hour
    await redis.set(cacheKey, data, 3600);
    return data;
  };

  public getTracks = async (trackIds: string[]) => {
    const cacheKey = `spotify:tracks:${trackIds.join(',')}`;
    const cachedTracks = await redis.get(cacheKey);

    if (cachedTracks) {
      return cachedTracks;
    }

    const accessToken = await this.getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/tracks?ids=${trackIds.join(',')}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get tracks');
    }

    const data = await response.json();
    const tracks = data.tracks || [];

    // Cache for 1 hour
    await redis.set(cacheKey, tracks, 3600);
    return tracks;
  };

  public getTrackImage = async (trackId: string) => {
    const cacheKey = `spotify:track:${trackId}:image`;
    const cachedImage = await redis.get<string>(cacheKey);

    if (cachedImage) {
      return cachedImage;
    }

    const accessToken = await this.getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get track');
    }

    const data = await response.json();
    const imageUrl = data.album.images[0]?.url;

    if (imageUrl) {
      // Cache for 1 hour
      await redis.set(cacheKey, imageUrl, 3600);
    }

    return imageUrl;
  };

  public getTrackData = async (trackId: string) => {
    const cacheKey = `spotify:track:${trackId}:data`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const accessToken = await this.getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get track data');
    }

    const data = await response.json();

    // Cache for 1 hour
    await redis.set(cacheKey, data, 3600);
    return data;
  };

  public getArtistTopTracks = async (id: string, market: string = 'US'): Promise<SpotifyApiTrack[]> => {
    const cacheKey = `spotify:artist:${id}:top-tracks`;
    const cachedTracks = await redis.get<SpotifyApiTrack[]>(cacheKey);

    if (cachedTracks) {
      return cachedTracks;
    }

    const accessToken = await this.getAccessToken();
    const response = await fetch(
      `https://api.spotify.com/v1/artists/${id}/top-tracks?market=${market}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get top tracks');
    }

    const data = await response.json();
    const tracks = data.tracks;

    // Cache for 1 hour
    await redis.set(cacheKey, tracks, 3600);
    return tracks;
  };
}