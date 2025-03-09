import { AdminLayout } from '@/components/features/admin-layout';
import { getArtistBySlug } from '@/actions/artists/artist';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// Mock data for tour dates - in a real app, this would come from an API
const mockTourDates = [
  {
    id: '1',
    date: '2024-06-15',
    venue: 'Madison Square Garden',
    city: 'New York',
    country: 'USA',
    ticketsSold: 18500,
    capacity: 20000,
    status: 'upcoming'
  },
  {
    id: '2',
    date: '2024-06-18',
    venue: 'TD Garden',
    city: 'Boston',
    country: 'USA',
    ticketsSold: 15800,
    capacity: 19600,
    status: 'upcoming'
  },
  {
    id: '3',
    date: '2024-06-22',
    venue: 'United Center',
    city: 'Chicago',
    country: 'USA',
    ticketsSold: 21000,
    capacity: 23500,
    status: 'upcoming'
  },
  {
    id: '4',
    date: '2024-05-10',
    venue: 'The O2',
    city: 'London',
    country: 'UK',
    ticketsSold: 20000,
    capacity: 20000,
    status: 'completed'
  },
  {
    id: '5',
    date: '2024-05-14',
    venue: 'AccorHotels Arena',
    city: 'Paris',
    country: 'France',
    ticketsSold: 18500,
    capacity: 20300,
    status: 'completed'
  },
];

export default async function ArtistTourPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { artist } = await getArtistBySlug(slug);
  
  const upcomingShows = mockTourDates.filter(show => show.status === 'upcoming');
  const completedShows = mockTourDates.filter(show => show.status === 'completed');
  
  const totalTicketsSold = mockTourDates.reduce((sum, show) => sum + show.ticketsSold, 0);
  const totalCapacity = mockTourDates.reduce((sum, show) => sum + show.capacity, 0);
  const averageAttendance = Math.round((totalTicketsSold / totalCapacity) * 100);

  return (
    <AdminLayout title={`${artist?.name || 'Artist'} Tour`}>
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Shows</CardTitle>
              <CardDescription>All tour dates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockTourDates.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Shows</CardTitle>
              <CardDescription>Scheduled performances</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingShows.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Tickets Sold</CardTitle>
              <CardDescription>Across all shows</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTicketsSold.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
              <CardDescription>Percentage of capacity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageAttendance}%</div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tour Dates</CardTitle>
            <CardDescription>Scheduled performances for {artist?.name}</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingShows.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Venue</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Tickets Sold</TableHead>
                    <TableHead className="text-right">Capacity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingShows.map((show) => (
                    <TableRow key={show.id}>
                      <TableCell className="font-medium">
                        {new Date(show.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{show.venue}</TableCell>
                      <TableCell>{show.city}, {show.country}</TableCell>
                      <TableCell className="text-right">{show.ticketsSold.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        {show.ticketsSold === show.capacity ? (
                          <Badge>Sold Out</Badge>
                        ) : (
                          `${show.capacity.toLocaleString()}`
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-6 text-center text-muted-foreground">
                No upcoming tour dates scheduled
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Past Tour Dates</CardTitle>
            <CardDescription>Completed performances</CardDescription>
          </CardHeader>
          <CardContent>
            {completedShows.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Venue</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Attendance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedShows.map((show) => (
                    <TableRow key={show.id}>
                      <TableCell className="font-medium">
                        {new Date(show.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{show.venue}</TableCell>
                      <TableCell>{show.city}, {show.country}</TableCell>
                      <TableCell className="text-right">
                        {Math.round((show.ticketsSold / show.capacity) * 100)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-6 text-center text-muted-foreground">
                No past tour dates available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
} 