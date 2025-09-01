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
import { MoreHorizontal, Calendar, Clock, CheckCircle, XCircle, User, Phone, Mail, MapPin, Filter } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ModernPageHeader from "@/components/dashboard/ModernPageHeader";

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const renderBookingCards = (bookings: Booking[], emptyMessage: string) => {
    if (isLoading && !response) {
      return (
        <div className="grid gap-4 mt-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      );
    }
    
    if (bookings.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="bg-muted/30 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      );
    }
    
    return (
      <div className="grid gap-4 mt-6">
        {bookings.map((booking, index) => {
          const otherUser = user?.user_type === 'seller' ? booking.customer : booking.seller;
          return (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/20 hover:border-l-primary">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                        <AvatarImage src={otherUser.profile_image || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {otherUser.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg text-foreground">{booking.service.title}</h3>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <User className="h-4 w-4" />
                              <span>{user?.user_type === 'seller' ? 'Customer' : 'Provider'}: {otherUser.name}</span>
                            </div>
                          </div>
                          
                          <Badge 
                            variant={getStatusVariant(booking.status)} 
                            className="capitalize gap-1 font-medium"
                          >
                            {getStatusIcon(booking.status)}
                            {booking.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                          <div className="flex items-center space-x-2 text-sm">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="font-medium">Date:</span>
                            <span>{new Date(booking.appointment_date).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-sm">
                            <Clock className="h-4 w-4 text-primary" />
                            <span className="font-medium">Time:</span>
                            <span>{new Date(booking.appointment_date).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</span>
                          </div>
                        </div>

                        {booking.notes && (
                          <div className="bg-muted/30 p-3 rounded-lg mb-4">
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">Notes:</span> {booking.notes}
                            </p>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            Booking ID: #{booking.id}
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="gap-2">
                                <MoreHorizontal className="h-4 w-4" />
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {user?.user_type === 'seller' && booking.status === 'pending' && (
                                <>
                                  <DropdownMenuItem 
                                    onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                                    className="gap-2"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                    Confirm
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-destructive gap-2" 
                                    onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                                  >
                                    <XCircle className="h-4 w-4" />
                                    Cancel
                                  </DropdownMenuItem>
                                </>
                              )}
                              {user?.user_type === 'seller' && booking.status === 'confirmed' && (
                                <DropdownMenuItem 
                                  onClick={() => handleStatusUpdate(booking.id, 'completed')}
                                  className="gap-2"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  Mark as Completed
                                </DropdownMenuItem>
                              )}
                              {user?.user_type === 'customer' && (booking.status === 'pending' || booking.status === 'confirmed') && (
                                <DropdownMenuItem 
                                  className="text-destructive gap-2" 
                                  onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                                >
                                  <XCircle className="h-4 w-4" />
                                  Cancel Booking
                                </DropdownMenuItem>
                              )}
                              {!(user?.user_type === 'seller' && (booking.status === 'pending' || booking.status === 'confirmed')) && 
                               !(user?.user_type === 'customer' && (booking.status === 'pending' || booking.status === 'confirmed')) && (
                                <DropdownMenuItem disabled>
                                  No actions available
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <ModernPageHeader 
          title="My Bookings" 
          description="Manage your appointments and view booking history"
          icon={Calendar}
          badge={{
            text: `${userBookings.length} Total`,
            variant: "secondary"
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-card border-border shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Appointment History</CardTitle>
                  <CardDescription>Track and manage all your bookings</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <span>Upcoming</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
                      <span>Past</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="upcoming" className="gap-2">
                    <Clock className="h-4 w-4" />
                    Upcoming ({upcomingBookings.length})
                  </TabsTrigger>
                  <TabsTrigger value="past" className="gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Past ({pastBookings.length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="upcoming" className="space-y-4">
                  {renderBookingCards(upcomingBookings, "You have no upcoming bookings.")}
                </TabsContent>
                
                <TabsContent value="past" className="space-y-4">
                  {renderBookingCards(pastBookings, "You have no past bookings.")}
                </TabsContent>
              </Tabs>
              
              {/* Pagination */}
              {response && response.last_page > 1 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 flex justify-center"
                >
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#" 
                          onClick={(e) => { 
                            e.preventDefault(); 
                            setPage(p => Math.max(1, p - 1)); 
                          }} 
                          className={response.current_page === 1 ? 'pointer-events-none opacity-50' : ''} 
                        />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink className="bg-primary/10 text-primary font-medium">
                          Page {response.current_page} of {response.last_page}
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext 
                          href="#" 
                          onClick={(e) => { 
                            e.preventDefault(); 
                            setPage(p => Math.min(response.last_page, p + 1)); 
                          }} 
                          className={response.current_page === response.last_page ? 'pointer-events-none opacity-50' : ''} 
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Confirmation Dialog */}
        <AlertDialog open={dialogState.isOpen} onOpenChange={(isOpen) => setDialogState(prev => ({ ...prev, isOpen }))}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-destructive" />
                Cancel Appointment?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This will cancel the appointment and notify all parties involved. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmStatusUpdate} 
                disabled={mutation.isPending}
                className="bg-destructive hover:bg-destructive/90"
              >
                {mutation.isPending ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Confirm Cancellation
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default MyBookings;