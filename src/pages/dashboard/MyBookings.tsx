import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { mockBookings } from "@/data/mock";
import { useAuth } from "@/contexts/AuthContext";

const MyBookings = () => {
  const { user } = useAuth();

  const userBookings = mockBookings.filter(booking => {
    if (user?.user_type === 'customer') {
      return booking.customer.id === user.id;
    }
    if (user?.user_type === 'seller') {
      return booking.seller.id === user.id;
    }
    return false;
  });

  const upcomingBookings = userBookings.filter(b => new Date(b.booking_date) >= new Date() && (b.status === 'confirmed' || b.status === 'pending'));
  const pastBookings = userBookings.filter(b => new Date(b.booking_date) < new Date() || b.status === 'completed' || b.status === 'cancelled');

  const getStatusVariant = (status: 'confirmed' | 'pending' | 'completed' | 'cancelled') => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'completed': return 'secondary';
      case 'pending': return 'outline';
      case 'cancelled': return 'destructive';
    }
  };

  const renderTable = (bookings: typeof mockBookings, emptyMessage: string) => {
    if (bookings.length === 0) {
      return <p className="text-center text-muted-foreground py-8">{emptyMessage}</p>;
    }
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>{user?.user_type === 'seller' ? 'Customer' : 'Provider'}</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map(booking => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium">{booking.service.title}</TableCell>
              <TableCell>{new Date(booking.booking_date).toLocaleDateString()}</TableCell>
              <TableCell>{user?.user_type === 'seller' ? booking.customer.name : booking.seller.name}</TableCell>
              <TableCell className="text-right">
                <Badge variant={getStatusVariant(booking.status)} className="capitalize">{booking.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
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
            {renderTable(upcomingBookings, "You have no upcoming bookings.")}
          </TabsContent>
          <TabsContent value="past">
            {renderTable(pastBookings, "You have no past bookings.")}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MyBookings;