import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Settings,
  PlusCircle, 
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Star,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  Crown,
  Activity
} from "lucide-react";
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { PaginatedResponse, Service, SellerDashboardStats } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { packageConfigs } from '@/config/packageConfig';
import { formatServicePrice } from "@/lib/utils";
import { motion } from 'framer-motion';
import ModernPageHeader from '@/components/dashboard/ModernPageHeader';

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
      toast.success("Service deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ['my-services'] });
      queryClient.invalidateQueries({ queryKey: ['sellerInsights'] });
      setIsDeleteDialogOpen(false);
      setSelectedService(null);
    },
    onError: () => {
      toast.error("Failed to delete service.");
    },
  });

  const statusMutation = useMutation({
    mutationFn: updateServiceStatus,
    onSuccess: () => {
      toast.success("Service status updated.");
      queryClient.invalidateQueries({ queryKey: ['my-services'] });
    },
    onError: () => {
      toast.error("Failed to update status.");
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

  // --- UI Rendering Helpers ---
  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="gap-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700">
        <CheckCircle className="h-3 w-3" />
        Active
      </Badge>
    ) : (
      <Badge variant="outline" className="gap-1 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600">
        <XCircle className="h-3 w-3" />
        Inactive
      </Badge>
    );
  };

  const renderServiceCards = () => {
    if (isLoading) {
      return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-80 w-full rounded-xl" />
          ))}
        </div>
      );
    }

    if (!sellerServices || sellerServices.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="bg-muted/30 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Settings className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No services yet</h3>
          <p className="text-muted-foreground mb-4">Create your first service to start earning.</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-block">
                  <Button asChild disabled={isAddServiceDisabled}>
                    <Link to="/dashboard/services/new" className={isAddServiceDisabled ? "pointer-events-none" : ""}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Your First Service
                    </Link>
                  </Button>
                </div>
              </TooltipTrigger>
              {isAddServiceDisabled && (
                <TooltipContent>
                  Upgrade your package to add services.
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    }

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sellerServices.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/20 hover:border-l-primary group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg text-foreground line-clamp-2">
                        {service.title}
                      </h3>
                      {service.featured && (
                        <Badge variant="secondary" className="gap-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700">
                          <Star className="h-3 w-3" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-2">
                    {getStatusBadge(service.is_active)}
                    <Badge variant="outline" className="gap-1 text-xs capitalize">
                      {service.category}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-lg font-semibold text-green-600 mb-1">
                      <DollarSign className="h-4 w-4" />
                      {formatServicePrice(service.min_price, service.max_price)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ID: #{service.id}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <Switch
                      checked={service.is_active}
                      onCheckedChange={(checked) => statusMutation.mutate({ id: service.id, is_active: checked })}
                      disabled={statusMutation.isPending}
                      size="sm"
                      aria-label="Toggle service status"
                    />
                    <span className="text-sm text-muted-foreground">
                      {service.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Created {new Date(service.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/services/${service.id}`)}
                      className="gap-1"
                    >
                      <Eye className="h-3 w-3" />
                      View
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => navigate(`/dashboard/services/${service.id}/edit`)}
                          className="gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Edit Service
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => navigate(`/services/${service.id}`)}
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View Public Page
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteClick(service)}
                          className="gap-2 text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete Service
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  };

  if (user?.user_type !== 'seller') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <Card>
            <CardHeader><CardTitle>My Services</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground">This page is for sellers to manage their services.</p></CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="max-w-7xl">
        <ModernPageHeader 
          title="My Services" 
          description="Manage and track your service listings"
          icon={Settings}
          badge={{
            text: `${sellerServices?.length || 0} Services`,
            variant: "secondary"
          }}
          actions={[
            {
              label: isAddServiceDisabled ? `Limit Reached (${activeServicesCount}/${serviceLimitDisplay})` : "Create New Service",
              onClick: () => !isAddServiceDisabled && navigate('/dashboard/services/new'),
              variant: "default",
              icon: PlusCircle,
              disabled: isAddServiceDisabled
            }
          ]}
        />

        {/* Package Limit Warning */}
        {isAddServiceDisabled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 dark:bg-amber-900/20 p-2 rounded-full">
                    <Crown className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-800 dark:text-amber-200">Service Limit Reached</h3>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      You've reached your service limit ({activeServicesCount}/{serviceLimitDisplay}). 
                      <Link to="/dashboard/billing" className="underline font-medium hover:text-amber-800 dark:hover:text-amber-200">
                        Upgrade your package
                      </Link> to add more services.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Services Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {renderServiceCards()}
        </motion.div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-destructive" />
                Delete Service?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the service 
                <span className="font-semibold">"{ selectedService?.title}"</span> and remove all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteMutation.isPending}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDelete} 
                disabled={deleteMutation.isPending}
                className="bg-destructive hover:bg-destructive/90"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete Service"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default MyServices;
