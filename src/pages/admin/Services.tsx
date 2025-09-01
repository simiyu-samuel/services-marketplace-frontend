import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { PaginatedResponse, Service } from "@/types";
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
  Settings,
  Search, 
  Filter, 
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  MoreVertical,
  RefreshCw,
  Star,
  MapPin,
  DollarSign,
  Clock,
  User
} from 'lucide-react';
import ModernPageHeader from '@/components/dashboard/ModernPageHeader';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatServicePrice } from "@/lib/utils";

// --- Type Definitions ---
interface ServiceFilters {
  category: string;
  status: string;
  featured: string;
  search: string;
  page: number;
}

const fetchServices = async (filters?: Partial<ServiceFilters>) => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.append(key, value.toString());
      }
    });
  }
  const { data } = await api.get(`/admin/services?${params.toString()}`);
  return data as PaginatedResponse<Service>;
};

const updateServiceStatus = async ({ id, is_active }: { id: number, is_active: boolean }) => {
  await api.put(`/admin/services/${id}`, { is_active });
};

const updateServiceAction = async ({ id, action, value }: { id: number, action: string, value?: any }) => {
  switch (action) {
    case 'approve':
      await api.put(`/admin/services/${id}`, { is_active: true });
      break;
    case 'suspend':
      await api.put(`/admin/services/${id}`, { is_active: false });
      break;
    case 'toggleFeatured':
      await api.put(`/admin/services/${id}`, { featured: value });
      break;
    default:
      throw new Error('Invalid action');
  }
};

const AdminServices = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<ServiceFilters>({
    category: 'all',
    status: 'all',
    featured: 'all',
    search: '',
    page: 1,
  });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionDetails, setActionDetails] = useState<{ serviceId: number | null; action: string; service?: Service }>({ serviceId: null, action: '' });

  const { data: response, isLoading, refetch } = useQuery({
    queryKey: ['admin-services', filters],
    queryFn: () => fetchServices(filters),
  });

  const statusMutation = useMutation({
    mutationFn: updateServiceStatus,
    onSuccess: () => {
      toast.success("Service status updated.");
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
    },
    onError: () => {
      toast.error("Failed to update service status.");
    },
  });

  const actionMutation = useMutation({
    mutationFn: updateServiceAction,
    onSuccess: () => {
      toast.success("Action completed successfully");
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      closeConfirmationDialog();
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Action failed';
      toast.error(errorMessage);
      closeConfirmationDialog();
    },
  });

  const handleStatusChange = (service: Service, checked: boolean) => {
    statusMutation.mutate({ id: service.id, is_active: checked });
  };

  // --- Event Handlers ---
  const handleFilterChange = (key: keyof Omit<ServiceFilters, 'page'>, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };
  
  const openConfirmationDialog = (serviceId: number, action: string, service?: Service) => {
    setActionDetails({ serviceId, action, service });
    setConfirmDialogOpen(true);
  };

  const closeConfirmationDialog = () => {
    setConfirmDialogOpen(false);
    setActionDetails({ serviceId: null, action: '' });
  };

  // --- Action Logic ---
  const confirmAction = async () => {
    if (!actionDetails.serviceId || !actionDetails.service) return;

    const { serviceId, action, service } = actionDetails;
    let value;

    if (action === 'toggleFeatured') {
      value = !service.featured;
    }

    actionMutation.mutate({ id: serviceId, action, value });
  };

  // --- UI Rendering Helpers ---
  const getStatusBadge = (service: Service) => {
    if (service.is_active) {
      return (
        <Badge className="gap-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700">
          <CheckCircle className="h-3 w-3" />
          Active
        </Badge>
      );
    } else {
      return (
        <Badge variant="destructive" className="gap-1">
          <Ban className="h-3 w-3" />
          Suspended
        </Badge>
      );
    }
  };

  const renderServiceCards = () => {
    if (isLoading) {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      );
    }

    if (!response?.data || response.data.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="bg-muted/30 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Settings className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No services found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {response.data.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/20 hover:border-l-primary">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg text-foreground line-clamp-1">
                        {service.title}
                      </h3>
                      {service.featured && (
                        <Badge variant="secondary" className="gap-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700">
                          <Star className="h-3 w-3" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {service.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {formatServicePrice(service.min_price, service.max_price)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {service.rating || 0}/5
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8 border border-background">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${service.user.name}`} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {service.user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{service.user.name}</p>
                      <p className="text-xs text-muted-foreground">{service.user.email}</p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ID: #{service.id}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-2">
                    {getStatusBadge(service)}
                    <Badge variant="outline" className="gap-1 text-xs capitalize">
                      {service.category}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Created: {new Date(service.created_at).toLocaleDateString()}
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
                      
                      {service.is_active ? (
                        <DropdownMenuItem 
                          onClick={() => openConfirmationDialog(service.id, 'suspend', service)}
                          className="gap-2 text-destructive"
                        >
                          <Ban className="h-4 w-4" />
                          Suspend
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem 
                          onClick={() => openConfirmationDialog(service.id, 'approve', service)}
                          className="gap-2 text-green-600"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Approve
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuItem 
                        onClick={() => openConfirmationDialog(service.id, 'toggleFeatured', service)}
                        className="gap-2"
                      >
                        <Star className="h-4 w-4" />
                        {service.featured ? 'Remove Featured' : 'Make Featured'}
                      </DropdownMenuItem>
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
          title="Service Management" 
          description="Manage platform services, approvals, and moderation"
          icon={Settings}
          badge={{
            text: `${response?.meta?.total || response?.data?.length || 0} Services`,
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
                <div className="bg-green-500/10 p-2 rounded-lg">
                  <Filter className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">Filters & Search</CardTitle>
                  <CardDescription>Filter services by category, status, or search by title</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search services..." 
                    value={filters.search} 
                    onChange={(e) => handleFilterChange('search', e.target.value)} 
                    className="pl-10"
                  />
                </div>
                
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
                
                {/* Status Filter */}
                <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                
                {/* Featured Filter */}
                <Select value={filters.featured} onValueChange={(value) => handleFilterChange('featured', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Services" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    <SelectItem value="true">Featured Only</SelectItem>
                    <SelectItem value="false">Non-Featured</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {renderServiceCards()}
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
                    Showing {response.meta.per_page * (response.meta.current_page - 1) + 1} to {Math.min(response.meta.per_page * response.meta.current_page, response.meta.total)} of {response.meta.total} services
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
                {actionDetails.action === 'approve' && 'Approve Service'}
                {actionDetails.action === 'suspend' && 'Suspend Service'}
                {actionDetails.action === 'toggleFeatured' && 'Toggle Featured Status'}
              </DialogTitle>
              <DialogDescription>
                {actionDetails.action === 'approve' && 'Are you sure you want to approve this service?'}
                {actionDetails.action === 'suspend' && 'Are you sure you want to suspend this service? Users will not be able to book it.'}
                {actionDetails.action === 'toggleFeatured' && 'Are you sure you want to change the featured status of this service?'}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={closeConfirmationDialog}>
                Cancel
              </Button>
              <Button type="button" onClick={confirmAction}>
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminServices;