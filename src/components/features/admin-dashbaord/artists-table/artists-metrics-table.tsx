"use client"
import { useState, useMemo } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MetricDisplay } from './metrics-data';
import { ArtistMetric , Artist } from '@/types/artist';


interface ArtistMetricsTableProps {
  initialArtists: Artist[];
  artistMetrics: Record<string, ArtistMetric[]>;
}

// Define the combined data type
interface ArtistWithMetrics {
  id: string;
  name: string;
  imageUrl: string;
  genres: string[];
  country: string;
  spotifyFollowers: {
    current: number;
    change: number;
    percentChange: number;
  };
  monthlyListeners: {
    current: number;
    change: number;
    percentChange: number;
  };
  youtubeSubscribers: {
    current: number;
    change: number;
    percentChange: number;
  };
  instagramFollowers: {
    current: number;
    change: number;
    percentChange: number;
  };
  popularity: {
    current: number;
    change: number;
    percentChange: number;
  };
}

export function ArtistMetricsTable({ initialArtists, artistMetrics }: ArtistMetricsTableProps) {
  console.log('artistMetrics = ', artistMetrics);
  // State for table
  const [artists] = useState(initialArtists);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  // Combine the data
   // Combine the data for display
   const data = useMemo(() => {

    const getMetricWithChange = (artistId: string, platform: string, metricType: string) => {
      const metrics = artistMetrics[artistId] || [];
      
      // Filter metrics for this specific platform and type, sorted by date (newest first)
      const filteredMetrics = metrics
        .filter(m => m.platform === platform && m.metric_type === metricType)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      if (filteredMetrics.length === 0) {
        return { current: 0, change: 0, percentChange: 0 };
      }
      
      // Current value is the most recent
      const current = filteredMetrics[0].value;
      
      // If we have older metrics, calculate change
      if (filteredMetrics.length > 1) {
        const oldest = filteredMetrics[filteredMetrics.length - 1].value;
        const change = current - oldest;
        const percentChange = oldest > 0 ? (change / oldest) * 100 : 0;
        
        return { current, change, percentChange };
      }
      
      // No change data available
      return { current, change: 0, percentChange: 0 };
    };
    return artists.map(artist => ({
      id: artist.id,
      name: artist.name,
      imageUrl: artist.image_url,
      genres: artist.genres,
      country: artist.country,
      spotifyFollowers: getMetricWithChange(artist.id, 'spotify', 'followers'),
      monthlyListeners: getMetricWithChange(artist.id, 'spotify', 'monthly_listeners'),
      youtubeSubscribers: getMetricWithChange(artist.id, 'youtube', 'subscribers'),
      instagramFollowers: getMetricWithChange(artist.id, 'instagram', 'followers'),
      popularity: getMetricWithChange(artist.id, 'spotify', 'popularity'),
    }));
  }, [artists, artistMetrics]);


  
  const columnHelper = createColumnHelper<ArtistWithMetrics>();
  
  // Define columns
  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: 'Artist',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('spotifyFollowers', {
      header: 'Spotify Followers',
      cell: info => <MetricDisplay value={info.getValue()} />,
    }),
    columnHelper.accessor('monthlyListeners', {
      header: 'Monthly Listeners',
      cell: info => <MetricDisplay value={info.getValue()} />,
    }),
    columnHelper.accessor('youtubeSubscribers', {
      header: 'YouTube Subscribers',
      cell: info => <MetricDisplay value={info.getValue()} />,
    }),
    columnHelper.accessor('instagramFollowers', {
      header: 'Instagram Followers',
      cell: info => <MetricDisplay value={info.getValue()} />,
    }),
    columnHelper.accessor('popularity', {
      header: 'Popularity',
      cell: info => <MetricDisplay value={info.getValue()} />,
    }),
  ], [columnHelper]);
  
  // Initialize the table
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search artists..."
          value={globalFilter ?? ''}
          onChange={e => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
