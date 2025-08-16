import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { mockBookings } from "@/data/mock";
import { cn } from "@/lib/utils";

const MyBookings = () => {
  const upcomingBookings = mockBookings.filter(b => new Date(b.booking_date) >= new Date() && (b.status === 'confirmed' || b.status === 'pending'));
  const pastBookings = mockBookings.filter(b => new Date(b.booking_date) < new Date() || b.status === 'completed' || b.status === 'cancelled');

  const getStatusVariant = (status: 'confirmed' | 'pending' | 'completed' | 'cancelled') => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'completed': return 'secondary';
      case 'pending': return 'outline';
      case 'cancelled': return 'destructive';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Bookings</CardTitle>
        <CardDescription>View your upcoming and past appointments.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upcoming">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingBookings.map(booking => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.service.title}</TableCell>
                    <TableCell>{new Date(booking.booking_date).toLocaleDateString()}</TableCell>
                    <TableCell>{booking.seller.name}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={getStatusVariant(booking.status)} className="capitalize">{booking.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="past">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pastBookings.map(booking => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.service.title}</TableCell>
                    <TableCell>{new Date(booking.booking_date).toLocaleDateString()}</TableCell>
                    <TableCell>{booking.seller.name}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={getStatusVariant(booking.status)} className="capitalize">{booking.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MyBookings;