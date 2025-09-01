import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { PaginatedResponse, Booking } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { 
  Calendar,
  Search, 
  Filter, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical,
  RefreshCw,
  DollarSign,
  User,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import ModernPageHeader from '@/components/dashboard/ModernPageHeader';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// --- Type Definitions ---
interface BookingFilters {
  status: string;
  category: string;
  search: string;
  date_from: string;
  date_to: string;
  page: number;
}

const fetchBookings = async (filters?: Partial<BookingFilters>) => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.append(key, value.toString());
      }
    });
  }
  const { data } = await api.get(`/admin/appointments?${params.toString()}`);
  return data as PaginatedResponse<Booking>;
};

const updateBookingStatus = async ({ id, status }: { id: number, status: string }) => {
  await api.put(`/admin/bookings/${id}`, { status });
};

const AdminBookings = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<BookingFilters>({
    status: 'all',
    category: 'all',
    search: '',
    date_from: '',
    date_to: '',
    page: 1,
  });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionDetails, setActionDetails] = useState<{ bookingId: number | null; action: string; booking?: Booking }>({ bookingId: null, action: '' });

  const { data: response, isLoading, refetch } = useQuery({
    queryKey: ['admin-bookings', filters],
    queryFn: () => fetchBookings(filters),
  });

  const statusMutation = useMutation({
    mutationFn: updateBookingStatus,
    onSuccess: () => {
      toast.success("Booking status updated successfully");
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      closeConfirmationDialog();
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to update booking status';
      toast.error(errorMessage);
      closeConfirmationDialog();
    },
  });

  // --- Event Handlers ---
  const handleFilterChange = (key: keyof Omit<BookingFilters, 'page'>, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };
  
  const openConfirmationDialog = (bookingId: number, action: string, booking?: Booking) => {
    setActionDetails({ bookingId, action, booking });
    setConfirmDialogOpen(true);
  };

  const closeConfirmationDialog = () => {
    setConfirmDialogOpen(false);
    setActionDetails({ bookingId: null, action: '' });
  };

  // --- Action Logic ---
  const confirmAction = async () => {
    if (!actionDetails.bookingId) return;

    const { bookingId, action } = actionDetails;
    let status = '';

    switch (action) {
      case 'confirm':
        status = 'confirmed';
        break;
      case 'complete':
        status = 'completed';
        break;
      case 'cancel':
        status = 'cancelled';
        break;
      default:
        return;
    }

    statusMutation.mutate({ id: bookingId, status });
  };

  // --- UI Rendering Helpers ---
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="gap-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case 'confirmed':
        return (
          <Badge className="gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-700">
            <CheckCircle className="h-3 w-3" />
            Confirmed
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="gap-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700">
            <CheckCircle className="h-3 w-3" />
            Completed
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            {status}
          </Badge>
        );
    }
  };

  const renderBookingCards = () => {
    if (isLoading) {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-80 w-full rounded-xl" />
          ))}
        </div>
      );
    }

    if (!response?.data || response.data.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="bg-muted/30 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {response.data.map((booking, index) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/20 hover:border-l-primary">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground line-clamp-1 mb-2">
                      {booking.service.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(booking.appointment_date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {booking.appointment_time || 'TBD'}
                      </span>
                    </div>
                    {booking.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <MapPin className="h-3 w-3" />
                        <span className="line-clamp-1">{booking.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="mb-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Customer</p>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8 border border-background">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${booking.customer.name}`} />
                      <AvatarFallback className="bg-blue-500/10 text-blue-500 text-xs">
                        {booking.customer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{booking.customer.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {booking.customer.email}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seller Info */}
                <div className="mb-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Service Provider</p>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8 border border-background">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${booking.seller.name}`} />
                      <AvatarFallback className="bg-purple-500/10 text-purple-500 text-xs">
                        {booking.seller.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{booking.seller.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {booking.seller.email}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-2">
                    {getStatusBadge(booking.status)}
                    <Badge variant="outline" className="gap-1 text-xs capitalize">
                      {booking.service.category}
                    </Badge>
                  </div>
                  <div className="text-right">
                    {booking.total_amount && (
                      <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                        <DollarSign className="h-3 w-3" />
                        ${booking.total_amount}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      ID: #{booking.id}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Booked: {new Date(booking.created_at).toLocaleDateString()}
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2">
                        <Eye className="h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      
                      {booking.status === 'pending' && (
                        <DropdownMenuItem 
                          onClick={() => openConfirmationDialog(booking.id, 'confirm', booking)}
                          className="gap-2 text-blue-600"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Confirm
                        </DropdownMenuItem>
                      )}
                      
                      {booking.status === 'confirmed' && (
                        <DropdownMenuItem 
                          onClick={() => openConfirmationDialog(booking.id, 'complete', booking)}
                          className="gap-2 text-green-600"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Mark Complete
                        </DropdownMenuItem>
                      )}
                      
                      {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        <DropdownMenuItem 
                          onClick={() => openConfirmationDialog(booking.id, 'cancel', booking)}
                          className="gap-2 text-destructive"
                        >
                          <XCircle className="h-4 w-4" />
                          Cancel
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  };
  
  // --- JSX ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <ModernPageHeader 
          title="Booking Management" 
          description="Monitor and manage all platform bookings and transactions"
          icon={Calendar}
          badge={{
            text: `${response?.meta?.total || response?.data?.length || 0} Bookings`,
            variant: "secondary"
          }}
          actions={[
            {
              label: "Refresh",
              onClick: () => refetch(),
              variant: "outline",
              icon: RefreshCw
            }
          ]}
        />

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-card border-border shadow-lg mb-8">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-500/10 p-2 rounded-lg">
                  <Filter className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">Filters & Search</CardTitle>
                  <CardDescription>Filter bookings by status, category, date, or search</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search bookings..." 
                    value={filters.search} 
                    onChange={(e) => handleFilterChange('search', e.target.value)} 
                    className="pl-10"
                  />
                </div>
                
                {/* Status Filter */}
                <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                
                {/* Category Filter */}
                <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                    <SelectItem value="beauty">Beauty</SelectItem>
                    <SelectItem value="tutoring">Tutoring</SelectItem>
                    <SelectItem value="fitness">Fitness</SelectItem>
                    <SelectItem value="tech">Technology</SelectItem>
                  </SelectContent>
                </Select>
                
                {/* Date From */}
                <Input 
                  type="date"
                  placeholder="From Date" 
                  value={filters.date_from} 
                  onChange={(e) => handleFilterChange('date_from', e.target.value)} 
                />
                
                {/* Date To */}
                <Input 
                  type="date"
                  placeholder="To Date" 
                  value={filters.date_to} 
                  onChange={(e) => handleFilterChange('date_to', e.target.value)} 
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bookings Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {renderBookingCards()}
        </motion.div>

        {/* Pagination */}
        {response?.meta && response.meta.last_page > 1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex justify-center"
          >
            <Card className="bg-card border-border shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-center space-x-4">
                  <Button 
                    onClick={() => handlePageChange(filters.page - 1)} 
                    disabled={filters.page <= 1}
                    variant="outline"
                    size="sm"
                  >
                    Previous
                  </Button>
                  <div className="bg-primary/10 px-4 py-2 rounded-lg">
                    <span className="text-sm font-medium text-primary">
                      Page {response.meta.current_page} of {response.meta.last_page}
                    </span>
                  </div>
                  <Button 
                    onClick={() => handlePageChange(filters.page + 1)} 
                    disabled={filters.page >= response.meta.last_page}
                    variant="outline"
                    size="sm"
                  >
                    Next
                  </Button>
                </div>
                <div className="text-center mt-2">
                  <span className="text-xs text-muted-foreground">
                    Showing {response.meta.per_page * (response.meta.current_page - 1) + 1} to {Math.min(response.meta.per_page * response.meta.current_page, response.meta.total)} of {response.meta.total} bookings
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Confirmation Dialog */}
        <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {actionDetails.action === 'confirm' && 'Confirm Booking'}
                {actionDetails.action === 'complete' && 'Complete Booking'}
                {actionDetails.action === 'cancel' && 'Cancel Booking'}
              </DialogTitle>
              <DialogDescription>
                {actionDetails.action === 'confirm' && 'Are you sure you want to confirm this booking?'}
                {actionDetails.action === 'complete' && 'Are you sure you want to mark this booking as completed?'}
                {actionDetails.action === 'cancel' && 'Are you sure you want to cancel this booking? This action cannot be undone.'}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={closeConfirmationDialog}>
                Cancel
              </Button>
              <Button 
                type="button" 
                onClick={confirmAction}
                variant={actionDetails.action === 'cancel' ? 'destructive' : 'default'}
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminBookings;