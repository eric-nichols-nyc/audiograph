"use client";

import { useEffect, useState, useMemo } from "react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import { formatNumber } from "@/utils/formatNumber";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useYouTubePlayer } from "@/components/features/youtube/youtube-player";
import { PlayCircle } from "lucide-react";

// Define the Video type based on your database schema
interface Video {
  id: string;
  video_id: string;
  title: string;
  view_count: string;
  daily_view_count: string;
  published_at: string;
  thumbnail_url: string;
  platform: string;
  artist_videos: {
    artist_id: string;
    artists: {
      id: string;
      name: string;
      slug: string;
      image_url: string;
    };
  }[];
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const { setVideo } = useYouTubePlayer();

  useEffect(() => {
    async function fetchVideos() {
      try {
        const supabase = createBrowserSupabase();

        // Fetch videos with artist information
        const { data, error } = await supabase
          .from("videos")
          .select(
            `
            *,
            artist_videos!inner (
              artist_id,
              artists!inner (
                id,
                name,
                slug,
                image_url
              )
            )
          `
          )
          .order("view_count", { ascending: false })
          .limit(100);

        if (error) {
          console.error("Error fetching videos:", error);
          setError(error.message);
          return;
        }

        console.log("Videos data from database:", data);
        setVideos(data || []);
      } catch (err) {
        console.error("Error in fetchVideos:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, []);

  // Define columns for the table
  const columnHelper = createColumnHelper<Video>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("thumbnail_url", {
        header: "Thumbnail",
        cell: (info) => (
          <div className="relative w-24 h-14 rounded overflow-hidden">
            <Image
              src={info.getValue() || "/placeholder-thumbnail.jpg"}
              alt="Video thumbnail"
              fill
              className="object-cover"
            />
          </div>
        ),
      }),
      columnHelper.accessor("title", {
        header: "Title",
        cell: (info) => (
          <div
            className="font-medium max-w-xs truncate"
            title={info.getValue()}
          >
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.accessor("artist_videos", {
        header: "Artist",
        cell: (info) => {
          const artist = info.getValue()[0]?.artists;
          return artist ? (
            <div className="flex items-center gap-2">
              {artist.image_url && (
                <div className="relative w-6 h-6 rounded-full overflow-hidden">
                  <Image
                    src={artist.image_url}
                    alt={artist.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <span>{artist.name}</span>
            </div>
          ) : (
            "Unknown Artist"
          );
        },
      }),
      columnHelper.accessor("view_count", {
        header: "Views",
        cell: (info) => formatNumber(parseInt(info.getValue() || "0")),
      }),
      columnHelper.accessor("daily_view_count", {
        header: "Daily Views",
        cell: (info) => formatNumber(parseInt(info.getValue() || "0")),
      }),
      columnHelper.accessor("published_at", {
        header: "Published",
        cell: (info) => {
          const date = info.getValue();
          return date
            ? formatDistanceToNow(new Date(date), { addSuffix: true })
            : "Unknown";
        },
      }),
      columnHelper.accessor("video_id", {
        header: "Actions",
        cell: (info) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setVideo(info.getValue())}
            className="flex items-center gap-1"
          >
            <PlayCircle className="h-4 w-4" />
            <span>Play</span>
          </Button>
        ),
      }),
    ],
    [columnHelper, setVideo]
  );

  // Initialize the table
  const table = useReactTable({
    data: videos,
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
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6">Videos</h1>

      {loading ? (
        <div className="bg-muted p-8 rounded-lg text-center max-w-md mx-auto">
          <p className="text-xl mb-4">Loading videos...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 p-8 rounded-lg text-center max-w-md mx-auto">
          <p className="text-xl mb-4 text-red-600">Error loading videos</p>
          <p className="text-muted-foreground">{error}</p>
        </div>
      ) : videos.length === 0 ? (
        <div className="bg-muted p-8 rounded-lg text-center max-w-md mx-auto">
          <p className="text-xl mb-4">No videos found</p>
          <p className="text-muted-foreground">
            We couldn&apos;t find any videos in the database.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Input
              placeholder="Search videos..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
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
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing{" "}
              {table.getState().pagination.pageSize *
                table.getState().pagination.pageIndex +
                1}{" "}
              to{" "}
              {Math.min(
                table.getState().pagination.pageSize *
                  (table.getState().pagination.pageIndex + 1),
                table.getFilteredRowModel().rows.length
              )}{" "}
              of {table.getFilteredRowModel().rows.length} videos
            </div>
            <div className="flex items-center space-x-2">
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
        </div>
      )}
    </div>
  );
}
