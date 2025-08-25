import React, { useState } from 'react'; // Removed useEffect
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Service } from '@/types';
import { showSuccess, showError } from "@/utils/toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { MoreHorizontal } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth

const fetchAdminServices = async (adminId: string) => {
  const { data } = await api.get('admin/services', {
    params: { 'user_id': adminId }
  });
  console.log("services data:", data); // Log the full data object for inspection
  // The API returns a pagination object, with the services array inside the 'data' property
  return data.data as Service[];
};

const deleteService = async (id: number) => {
  await api.delete(`/services/${id}`);
};

const updateServiceStatus = async ({ id, is_active }: { id: number, is_active: boolean }) => {
  await api.put(`/services/${id}`, { is_active });
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

  const { data: adminServices, isLoading, refetch } = useQuery<Service[]>({
    queryKey: ['admin-services', adminId],
    queryFn: () => fetchAdminServices(adminId!), // Use non-null assertion
    enabled: !!adminId,
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

  const handleDeleteClick = (service: Service) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedService) {
      deleteMutation.mutate(selectedService.id);
    }
  };


  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">My Admin Services</h1>
      <Link to="/admin/my-services/create" className="mb-4 inline-block">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add New Admin Service
        </button>
      </Link>
      {isLoading ? (
        <Skeleton className="h-10 w-full" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              {/* <TableHead><span className="sr-only">Actions</span></TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {adminServices && Array.isArray(adminServices) && adminServices
              .filter(service => service.user_id === parseInt(adminId!)) // Filter services by adminId
              .map((service) => (
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
                  {/* <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /><span className="sr-only">Actions</span></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigate(`/admin/my-services/${service.id}/edit`)}>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteClick(service)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell> */}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
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
    </div>
  );
};

export default MyServices;
