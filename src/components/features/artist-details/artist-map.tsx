'use client';

import React, { useState } from 'react';
import ArtistLocationMap from '@/components/artist-location-map';
import { useArtistLocations } from '@/hooks/useArtistLocations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function ArtistMap() {
  const [artistSlug] = useState<string>('the-weeknd');

  const {
    data: locations,
    isLoading,
    error,
    refetch,
  } = useArtistLocations({
    artistSlug,
    enabled: true,
  });

  // Format artist name for display
  const formattedArtistName = artistSlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Artist Location Analytics</h1>

      <p className="mb-6 text-gray-600">
        This map shows the top locations where{' '}
        {formattedArtistName}
        &apos;s music is being streamed, based on YouTube view data. The size of each marker represents
        the relative number of views from that location.
      </p>

      {isLoading ? (
        <div className="flex justify-center items-center h-[500px] border rounded-lg">
          <p className="text-lg">Loading location data...</p>
        </div>
      ) : error ? (
        <div className="p-4 border border-red-300 bg-red-50 rounded-lg">
          <p className="text-red-500">Error loading location data: {error.message}</p>
          <Button onClick={() => refetch()} className="mt-2">
            Retry
          </Button>
        </div>
      ) : locations && locations.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cities List Column - Takes up 1/3 of the space on large screens */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Top Listener Cities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {locations.map((location, index) => (
                    <div key={index} className="flex items-center p-3 border rounded-md hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold mr-3">
                        {location.rank}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{location.title}</div>
                      </div>
                      <Badge variant="secondary">{location.views}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Map Column - Takes up 2/3 of the space on large screens */}
          <div className="lg:col-span-2">
            <ArtistLocationMap
              artistName={formattedArtistName}
              locations={locations}
            />
          </div>
        </div>
      ) : (
        <div className="p-4 border border-yellow-300 bg-yellow-50 rounded-lg">
          <p className="text-yellow-700">No location data available for this artist.</p>
          <p className="text-sm text-yellow-600 mt-1">
            Try searching for &quot;the-weeknd&quot; to see sample data.
          </p>
        </div>
      )}
    </div>
  );
}
