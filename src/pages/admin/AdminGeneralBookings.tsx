import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';
import { format } from 'date-fns';
import { Loader2, Eye, Edit, Trash2, CheckCircle, XCircle, Clock, UserPlus } from 'lucide-react';

interface GeneralBooking {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  preferred_date_time: string;
  message: string;
  status: 'pending' | 'assigned' | 'rejected' | 'completed';
  admin_notes?: string;
  assigned_seller_id?: number;
  assigned_seller?: {
    id: number;
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

interface Seller {
  id: number;
  name: string;
  email: string;
}

const statusColors: Record<GeneralBooking['status'], 'yellow' | 'blue' | 'red' | 'green'> = {
  pending: 'yellow',
  assigned: 'blue',
  rejected: 'red',
  completed: 'green',
};

const AdminGeneralBookings = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<GeneralBooking | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<GeneralBooking>>({});

  const { data: bookingsData, isLoading: isLoadingBookings } = useQuery({
    queryKey: ['adminGeneralBookings', { search, statusFilter, page }],
    queryFn: async () => {
      const response = await api.get('/admin/general-bookings', {
        params: { search, status: statusFilter === 'all' ? undefined : statusFilter, page },
      });
      return response.data;
    },
  });

  const { data: sellers, isLoading: isLoadingSellers } = useQuery({
    queryKey: ['sellers'],
    queryFn: async () => {
      const response = await api.get('/admin/users', { params: { user_type: 'seller' } }); // Assuming sellers can be fetched from /admin/users with a filter
      return response.data.data; // Assuming the response structure is { data: [...] }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const updateBookingMutation = useMutation({
    mutationFn: (updatedBooking: Partial<GeneralBooking>) =>
      api.put(`/admin/general-bookings/${selectedBooking?.id}`, updatedBooking),
    onSuccess: (response) => {
      toast({
        title: 'Success',
        description: response.data.message,
      });
      queryClient.invalidateQueries({ queryKey: ['adminGeneralBookings'] });
      setIsEditModalOpen(false);
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update booking.',
        variant: 'destructive',
      });
    },
  });

  const deleteBookingMutation = useMutation({
    mutationFn: () => api.delete(`/admin/general-bookings/${selectedBooking?.id}`),
    onSuccess: (response) => {
      toast({
        title: 'Success',
        description: response.data.message,
      });
      queryClient.invalidateQueries({ queryKey: ['adminGeneralBookings'] });
      setIsDeleteModalOpen(false);
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete booking.',
        variant: 'destructive',
      });
    },
  });

  const handleViewDetails = (booking: GeneralBooking) => {
    setSelectedBooking(booking);
    setIsViewModalOpen(true);
  };

  const handleEditBooking = (booking: GeneralBooking) => {
    setSelectedBooking(booking);
    setEditFormData({
      status: booking.status,
      admin_notes: booking.admin_notes || '',
      assigned_seller_id: booking.assigned_seller_id || undefined,
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteBooking = (booking: GeneralBooking) => {
    setSelectedBooking(booking);
    setIsDeleteModalOpen(true);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleEditFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBookingMutation.mutate(editFormData);
  };

  const getStatusIcon = (status: GeneralBooking['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'assigned':
        return <UserPlus className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">General Booking Management</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Search by name, email, phone, message..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoadingBookings ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Preferred Date/Time</TableHead>
                <TableHead>Message Excerpt</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Seller</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookingsData?.data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">No general bookings found.</TableCell>
                </TableRow>
              ) : (
                bookingsData?.data?.map((booking: GeneralBooking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.customer_name}</TableCell>
                    <TableCell>{booking.customer_phone}</TableCell>
                    <TableCell>{booking.customer_email}</TableCell>
                    <TableCell>
                      {booking.preferred_date_time
                        ? format(new Date(booking.preferred_date_time), 'PPP HH:mm')
                        : 'N/A'}
                    </TableCell>
                    <TableCell>{booking.message ? booking.message.substring(0, 50) + '...' : 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={statusColors[booking.status]}>
                        {getStatusIcon(booking.status)} {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{booking.assigned_seller?.name || 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetails(booking)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditBooking(booking)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteBooking(booking)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex justify-end space-x-2 mt-4">
        <Button
          variant="outline"
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page * bookingsData?.per_page >= bookingsData?.total}
        >
          Next
        </Button>
      </div>

      {/* View Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>Full details of the general appointment request.</DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Name:</Label>
                <span className="col-span-3">{selectedBooking.customer_name}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Phone:</Label>
                <span className="col-span-3">{selectedBooking.customer_phone}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Email:</Label>
                <span className="col-span-3">{selectedBooking.customer_email}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Preferred Date/Time:</Label>
                <span className="col-span-3">
                  {selectedBooking.preferred_date_time
                    ? format(new Date(selectedBooking.preferred_date_time), 'PPP HH:mm')
                    : 'N/A'}
                </span>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Message:</Label>
                <span className="col-span-3 whitespace-pre-wrap">{selectedBooking.message}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Status:</Label>
                <Badge variant={statusColors[selectedBooking.status]} className="col-span-3 w-fit">
                  {getStatusIcon(selectedBooking.status)} {selectedBooking.status}
                </Badge>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Assigned Seller:</Label>
                <span className="col-span-3">{selectedBooking.assigned_seller?.name || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Admin Notes:</Label>
                <span className="col-span-3 whitespace-pre-wrap">{selectedBooking.admin_notes || 'N/A'}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Booking Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
            <DialogDescription>Update the status, assigned seller, or admin notes for this booking.</DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <form onSubmit={handleEditFormSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Status</Label>
                <Select
                  value={editFormData.status}
                  onValueChange={(value) => setEditFormData((prev) => ({ ...prev, status: value as GeneralBooking['status'] }))}
                >
                  <SelectTrigger id="status" className="col-span-3">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="assigned_seller_id" className="text-right">Assign Seller</Label>
                <Select
                  value={editFormData.assigned_seller_id?.toString() || '0'}
                  onValueChange={(value) => setEditFormData((prev) => ({ ...prev, assigned_seller_id: value === '0' ? undefined : Number(value) }))}
                  disabled={isLoadingSellers}
                >
                  <SelectTrigger id="assigned_seller_id" className="col-span-3">
                    <SelectValue placeholder="Select Seller" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Unassign</SelectItem>
                    {sellers?.map((seller: Seller) => (
                      <SelectItem key={seller.id} value={seller.id.toString()}>
                        {seller.name} ({seller.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="admin_notes" className="text-right pt-2">Admin Notes</Label>
                <Textarea
                  id="admin_notes"
                  value={editFormData.admin_notes}
                  onChange={handleEditFormChange}
                  className="col-span-3"
                  rows={4}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={updateBookingMutation.isPending}>
                  {updateBookingMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Booking Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the general booking request.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => deleteBookingMutation.mutate()}
              disabled={deleteBookingMutation.isPending}
            >
              {deleteBookingMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminGeneralBookings;
