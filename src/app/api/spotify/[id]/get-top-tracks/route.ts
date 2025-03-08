// app/api/artists/[artistId]/top-tracks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createSpotifyService } from '@/services/spotify-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Get market from searchParams (optional)
    const searchParams = request.nextUrl.searchParams;
    const market = searchParams.get('market') || 'US';
    
    // Create the Spotify service
    const spotifyService = createSpotifyService();
    
    // Get the top tracks
    const topTracks = await spotifyService.getArtistTopTracks(id, market);
    
    // Return the data
    return NextResponse.json({ tracks: topTracks }, { status: 200 });
  } catch (error) {
    console.error('Error fetching artist top tracks:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch artist top tracks' },
      { status: 500 }
    );
  }
}