import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Booking, PaginatedResponse } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { MoreHorizontal } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

const fetchBookings = async (page: number) => {
  const { data } = await api.get('/appointments', { params: { page } });
  return data as PaginatedResponse<Booking>;
};

const updateBookingStatus = async ({ id, status }: { id: number, status: string }) => {
  const { data } = await api.put(`/appointments/${id}`, { status });
  return data.appointment;
};

const MyBookings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [dialogState, setDialogState] = useState({ isOpen: false, bookingId: 0, newStatus: '' });

  const { data: response, isLoading } = useQuery<PaginatedResponse<Booking>>({
    queryKey: ['bookings', page],
    queryFn: () => fetchBookings(page),
    enabled: !!user,
    keepPreviousData: true,
  });

  const mutation = useMutation({
    mutationFn: updateBookingStatus,
    onSuccess: () => {
      showSuccess("Booking status updated successfully!");
      queryClient.invalidateQueries({ queryKey: ['bookings', page] });
    },
    onError: (error: any) => {
      showError(error.response?.data?.message || "Failed to update status.");
    },
    onSettled: () => {
      setDialogState({ isOpen: false, bookingId: 0, newStatus: '' });
    }
  });

  const handleStatusUpdate = (bookingId: number, newStatus: string) => {
    if (newStatus === 'cancelled') {
      setDialogState({ isOpen: true, bookingId, newStatus });
    } else {
      mutation.mutate({ id: bookingId, status: newStatus });
    }
  };

  const confirmStatusUpdate = () => {
    mutation.mutate({ id: dialogState.bookingId, status: dialogState.newStatus });
  };

  const userBookings = response?.data || [];
  const upcomingBookings = userBookings?.filter(b => new Date(b.appointment_date) >= new Date() && (b.status === 'confirmed' || b.status === 'pending')) || [];
  const pastBookings = userBookings?.filter(b => new Date(b.appointment_date) < new Date() || b.status === 'completed' || b.status === 'cancelled') || [];

  const getStatusVariant = (status: 'confirmed' | 'pending' | 'completed' | 'cancelled') => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'completed': return 'secondary';
      case 'pending': return 'outline';
      case 'cancelled': return 'destructive';
    }
  };

  const renderTable = (bookings: Booking[], emptyMessage: string) => {
    if (isLoading && !response) {
      return <div className="space-y-2 mt-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>;
    }
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
            <TableHead>Status</TableHead>
            <TableHead><span className="sr-only">Actions</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map(booking => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium">{booking.service.title}</TableCell>
              <TableCell>{new Date(booking.appointment_date).toLocaleDateString()}</TableCell>
              <TableCell>{user?.user_type === 'seller' ? booking.customer.name : booking.seller.name}</TableCell>
              <TableCell><Badge variant={getStatusVariant(booking.status)} className="capitalize">{booking.status}</Badge></TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {user?.user_type === 'seller' && booking.status === 'pending' && (
                      <>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(booking.id, 'confirmed')}>Confirm</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleStatusUpdate(booking.id, 'cancelled')}>Cancel</DropdownMenuItem>
                      </>
                    )}
                     {user?.user_type === 'seller' && booking.status === 'confirmed' && (
                      <DropdownMenuItem onClick={() => handleStatusUpdate(booking.id, 'completed')}>Mark as Completed</DropdownMenuItem>
                    )}
                    {user?.user_type === 'customer' && (booking.status === 'pending' || booking.status === 'confirmed') && (
                      <DropdownMenuItem className="text-destructive" onClick={() => handleStatusUpdate(booking.id, 'cancelled')}>Cancel Booking</DropdownMenuItem>
                    )}
                    {!(user?.user_type === 'seller' && (booking.status === 'pending' || booking.status === 'confirmed')) && !(user?.user_type === 'customer' && (booking.status === 'pending' || booking.status === 'confirmed')) && (
                      <DropdownMenuItem disabled>No actions available</DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>My Bookings</CardTitle>
          <CardDescription>View your upcoming and past appointments.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upcoming">
            <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="upcoming">Upcoming</TabsTrigger><TabsTrigger value="past">Past</TabsTrigger></TabsList>
            <TabsContent value="upcoming">{renderTable(upcomingBookings, "You have no upcoming bookings.")}</TabsContent>
            <TabsContent value="past">{renderTable(pastBookings, "You have no past bookings.")}</TabsContent>
          </Tabs>
          {response && response.last_page > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem><PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setPage(p => Math.max(1, p - 1)); }} className={response.current_page === 1 ? 'pointer-events-none opacity-50' : ''} /></PaginationItem>
                  <PaginationItem><PaginationLink>Page {response.current_page} of {response.last_page}</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationNext href="#" onClick={(e) => { e.preventDefault(); setPage(p => Math.min(response.last_page, p + 1)); }} className={response.current_page === response.last_page ? 'pointer-events-none opacity-50' : ''} /></PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
      <AlertDialog open={dialogState.isOpen} onOpenChange={(isOpen) => setDialogState(prev => ({ ...prev, isOpen }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This will cancel the appointment. This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Back</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusUpdate} disabled={mutation.isPending}>{mutation.isPending ? "Cancelling..." : "Confirm Cancellation"}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MyBookings;