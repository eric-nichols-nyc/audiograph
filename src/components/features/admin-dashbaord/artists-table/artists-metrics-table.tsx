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
  type ColumnDef,
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
import { ArtistMetric , Artist } from '@/types/artist';

// Define the combined data type
interface ArtistWithMetrics {
  id: string;
  name: string;
  imageUrl: string;
  genres: string[];
  country: string;
  spotifyFollowers?: number;
  monthlyListeners?: number;
  youtubeSubscribers?: number;
  instagramFollowers?: number;
  popularity?: number;
}

interface ArtistMetricsTableProps {
  initialArtists: Artist[];
  artistMetrics: Record<string, ArtistMetric[]>;
}

export function ArtistMetricsTable({ initialArtists, artistMetrics }: ArtistMetricsTableProps) {
  console.log('metrics data ', artistMetrics);
  // State for table
  const [artists] = useState(initialArtists);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');





  // Combine the data
   // Combine the data for display
   const data = useMemo(() => {

      // Get the most recent metric value for an artist
  const getLatestMetric = (artistId: string, platform: string, metricType: string): number => {
    const metrics = artistMetrics[artistId] || [];
    const metric = metrics.find(m => m.platform === platform && m.metric_type === metricType);
    return metric?.value || 0;
  };
    return artists.map(artist => ({
      id: artist.id,
      name: artist.name,
      imageUrl: artist.image_url,
      genres: artist.genres,
      country: artist.country,
      spotifyFollowers: getLatestMetric(artist.id, 'spotify', 'followers'),
      monthlyListeners: getLatestMetric(artist.id, 'spotify', 'monthly_listeners'),
      youtubeSubscribers: getLatestMetric(artist.id, 'youtube', 'subscribers'),
      instagramFollowers: getLatestMetric(artist.id, 'instagram', 'followers'),
      popularity: getLatestMetric(artist.id, 'spotify', 'popularity'),
    }));
  }, [artists, artistMetrics]);


  
  const columnHelper = createColumnHelper<ArtistWithMetrics>();
  
  // Define columns
  const columns = useMemo<ColumnDef<ArtistWithMetrics, any>[]>(() => [
    columnHelper.accessor('name', {
      header: 'Artist',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('spotifyFollowers', {
      header: 'Spotify Followers',
      cell: info => info.getValue()?.toLocaleString() || 'N/A',
    }),
    columnHelper.accessor('monthlyListeners', {
      header: 'Monthly Listeners',
      cell: info => info.getValue()?.toLocaleString() || 'N/A',
    }),
    columnHelper.accessor('youtubeSubscribers', {
      header: 'YouTube Subscribers',
      cell: info => info.getValue()?.toLocaleString() || 'N/A',
    }),
    columnHelper.accessor('instagramFollowers', {
      header: 'Instagram Followers',
      cell: info => info.getValue()?.toLocaleString() || 'N/A',
    }),
    columnHelper.accessor('popularity', {
      header: 'Popularity',
      cell: info => info.getValue() || 'N/A',
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