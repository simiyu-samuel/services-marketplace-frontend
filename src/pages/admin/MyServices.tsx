import React, { useState } from 'react'; // Removed useEffect
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Service } from '@/types';
import { showSuccess, showError } from "@/utils/toast";
import { filterAdminServices } from "@/utils/serviceFilters";
import { handleServiceDisplayError, createServiceDisplayError } from "@/utils/errorHandling";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { MoreHorizontal, PlusCircle, Edit, AlertCircle, RefreshCw, Star } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth
import { formatServicePrice } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const fetchAdminServices = async (adminId: string) => {
  try {
    const { data } = await api.get('/services', {
      params: { 'filter[user_id]': adminId }
    });
    console.log("services data:", data); // Log the full data object for inspection
    // The API returns a pagination object, with the services array inside the 'data' property
    return data.data as Service[];
  } catch (error) {
    const serviceError = createServiceDisplayError(
      'API_ERROR',
      'Failed to fetch admin services from API',
      error,
      'fetchAdminServices'
    );
    handleServiceDisplayError(serviceError);
    throw error;
  }
};

const deleteService = async (id: number) => {
  await api.delete(`/services/${id}`);
};

const updateServiceStatus = async ({ id, is_active }: { id: number, is_active: boolean }) => {
  await api.put(`/services/${id}`, { is_active });
};

const updateServiceFeatured = async ({ id, is_featured }: { id: number, is_featured: boolean }) => {
  await api.put(`/services/${id}`, { is_featured });
};

const MyServices = () => {
  // Removed services state and loading state, directly using useQuery's data and isLoading
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const { user } = useAuth(); // Get the user from AuthContext
  const isAdmin = user?.user_type === 'admin'; // Check if the user is an admin

  // const adminId = 'YOUR_ADMIN_USER_ID'; // TODO: Replace with actual admin ID
  const adminId = user?.id?.toString(); // Get the admin ID from the user object

  const { data: adminServices, isLoading, refetch, error } = useQuery<Service[]>({
    queryKey: ['admin-services', adminId],
    queryFn: () => fetchAdminServices(adminId!), // Use non-null assertion
    enabled: !!adminId,
    retry: (failureCount, error) => {
      // Only retry on network errors, not on auth errors
      if (error && 'response' in error && (error as any).response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      showSuccess("Service deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      refetch();
      setIsDeleteDialogOpen(false);
      setSelectedService(null);
    },
    onError: () => {
      showError("Failed to delete service.");
    },
  });

  const statusMutation = useMutation({
    mutationFn: updateServiceStatus,
    onSuccess: () => {
      showSuccess("Service status updated.");
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      refetch();
    },
    onError: () => {
      showError("Failed to update status.");
    },
  });

  const featuredMutation = useMutation({
    mutationFn: updateServiceFeatured,
    onSuccess: () => {
      showSuccess("Service featured status updated.");
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      refetch();
    },
    onError: () => {
      showError("Failed to update featured status.");
    },
  });

  const handleDeleteClick = (service: Service) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedService) {
      deleteMutation.mutate(selectedService.id);
    }
  };


  const filteredServices = adminServices ? filterAdminServices(
    adminServices, 
    adminId!, 
    { enableLogging: true, fallbackToAll: false }
  ) : [];

  // Error state handling
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Admin Services</CardTitle>
          <CardDescription>Manage your admin service listings.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load services. Please check your connection and try again.
            </AlertDescription>
          </Alert>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
            <Button asChild>
              <Link to="/admin/my-services/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Service
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Admin ID not available state
  if (!adminId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Admin Services</CardTitle>
          <CardDescription>Manage your admin service listings.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Unable to load admin information. Please refresh the page or log in again.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>My Admin Services</CardTitle>
          <CardDescription>Manage your admin service listings.</CardDescription>
        </div>
        <Button asChild>
          <Link to="/admin/my-services/create" className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Create New Service
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-40" />
            </div>
            <div className="border rounded-lg">
              <div className="border-b p-4">
                <div className="flex space-x-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border-b p-4 last:border-b-0">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : filteredServices.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                {isAdmin && <TableHead>Featured</TableHead>}
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {service.is_featured && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                      {service.title}
                    </div>
                  </TableCell>
                  <TableCell>{service.category}</TableCell>
                  <TableCell>{formatServicePrice(service.min_price, service.max_price)}</TableCell>
                  <TableCell>
                    <Switch
                      checked={service.is_active}
                      onCheckedChange={(checked) => statusMutation.mutate({ id: service.id, is_active: checked })}
                      disabled={statusMutation.isPending}
                      aria-label="Toggle service status"
                    />
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      <Switch
                        checked={service.is_featured || false}
                        onCheckedChange={(checked) => featuredMutation.mutate({ id: service.id, is_featured: checked })}
                        disabled={featuredMutation.isPending}
                        aria-label="Toggle featured status"
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigate(`/admin/my-services/${service.id}/edit`)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteClick(service)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <PlusCircle className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No services created yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              You haven't created any admin services yet. Create your first service to start managing your offerings.
            </p>
            <Button asChild size="lg">
              <Link to="/admin/my-services/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Your First Service
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the service "{selectedService?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default MyServices;
