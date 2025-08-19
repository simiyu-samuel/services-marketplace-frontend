import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { PaginatedResponse, Service, SellerDashboardStats } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { packageConfigs } from '@/config/packageConfig'; // Import packageConfigs

const fetchMyServices = async (sellerId: number) => {
  const { data } = await api.get('/services', {
    params: { 'filter[user_id]': sellerId }
  });
  return (data as PaginatedResponse<Service>).data;
};

const deleteService = async (id: number) => {
  await api.delete(`/services/${id}`);
};

const updateServiceStatus = async ({ id, is_active }: { id: number, is_active: boolean }) => {
  await api.put(`/services/${id}`, { is_active });
};

const fetchSellerInsights = async () => {
  const { data } = await api.get('/seller/dashboard/insights');
  return data.data;
};

const MyServices = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const { data: sellerServices, isLoading } = useQuery<Service[]>({
    queryKey: ['my-services', user?.id],
    queryFn: () => fetchMyServices(user!.id),
    enabled: user?.user_type === 'seller' && !!user?.id,
  });

  const { data: insights, isLoading: isInsightsLoading } = useQuery<SellerDashboardStats>({
    queryKey: ['sellerInsights', user?.id],
    queryFn: fetchSellerInsights,
    enabled: user?.user_type === 'seller' && !!user?.id,
  });

  const activeServicesCount = insights?.active_services_count ?? 0;
  const currentPackageKey = user?.seller_package;
  const serviceLimit = currentPackageKey ? packageConfigs.seller_packages[currentPackageKey as keyof typeof packageConfigs.seller_packages]?.services_limit : null;
  const isAddServiceDisabled = serviceLimit !== null && activeServicesCount >= serviceLimit;
  const serviceLimitDisplay = serviceLimit === null ? 'Unlimited' : serviceLimit;

  const deleteMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      showSuccess("Service deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ['my-services'] });
      // Refetch seller insights to update active_services_count
      queryClient.invalidateQueries({ queryKey: ['sellerInsights'] });
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
      queryClient.invalidateQueries({ queryKey: ['my-services'] });
    },
    onError: () => {
      showError("Failed to update status.");
      // Optimistic update reversal would happen here if implemented
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

  if (user?.user_type !== 'seller') {
    return (
      <Card>
        <CardHeader><CardTitle>My Services</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground">This page is for sellers to manage their services.</p></CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>My Services</CardTitle>
            <CardDescription>Manage your service listings.</CardDescription>
          </div>
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="inline-block">
                    <Button asChild disabled={isAddServiceDisabled} aria-label={isAddServiceDisabled ? "Service limit reached" : undefined}>
                      <Link to="/dashboard/services/new" className={isAddServiceDisabled ? "pointer-events-none" : ""}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create New Service
                      </Link>
                    </Button>
                  </div>
                </TooltipTrigger>
                {isAddServiceDisabled && (
                  <TooltipContent>
                    Upgrade your package to add more services.
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
            {isAddServiceDisabled && (
              <p className="text-sm text-destructive mt-2">
                Service Limit Reached: {activeServicesCount}/{serviceLimitDisplay}.
              </p>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>
          ) : sellerServices && sellerServices.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sellerServices.map(service => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.title}</TableCell>
                    <TableCell>{service.category}</TableCell>
                    <TableCell>Ksh {parseFloat(service.price).toLocaleString()}</TableCell>
                    <TableCell>
                      <Switch
                        checked={service.is_active}
                        onCheckedChange={(checked) => statusMutation.mutate({ id: service.id, is_active: checked })}
                        disabled={statusMutation.isPending}
                        aria-label="Toggle service status"
                      />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /><span className="sr-only">Toggle menu</span></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => navigate(`/dashboard/services/${service.id}/edit`)}>Edit</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteClick(service)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">You haven't created any services yet.</p>
          )}
        </CardContent>
      </Card>
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
    </>
  );
};

export default MyServices;
