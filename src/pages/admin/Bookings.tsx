import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { PaginatedResponse, Booking } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const fetchBookings = async () => {
  const { data } = await api.get('/admin/appointments');
  return data as PaginatedResponse<Booking>;
};

const AdminBookings = () => {
  const { data: response, isLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: fetchBookings,
  });

  const getStatusVariant = (status: Booking['status']) => {
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
        <CardTitle>Booking Management</CardTitle>
        <CardDescription>View all appointments on the platform.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {response?.data.map(booking => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.service.title}</TableCell>
                  <TableCell>{booking.customer.name}</TableCell>
                  <TableCell>{booking.seller.name}</TableCell>
                  <TableCell>{new Date(booking.appointment_date).toLocaleDateString()}</TableCell>
                  <TableCell><Badge variant={getStatusVariant(booking.status)} className="capitalize">{booking.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminBookings;