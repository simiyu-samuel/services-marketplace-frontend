import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { PaginatedResponse, User } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { showSuccess, showError } from "@/utils/toast";
import { Skeleton } from "@/components/ui/skeleton";

const fetchUsers = async () => {
  const { data } = await api.get('/admin/users');
  return data as PaginatedResponse<User>;
};

const updateUserStatus = async ({ id, is_active }: { id: number, is_active: boolean }) => {
  await api.put(`/admin/users/${id}`, { is_active });
};

const AdminUsers = () => {
  const queryClient = useQueryClient();
  const { data: response, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: fetchUsers,
  });

  const mutation = useMutation({
    mutationFn: updateUserStatus,
    onSuccess: () => {
      showSuccess("User status updated.");
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: () => {
      showError("Failed to update user status.");
    },
  });

  const handleStatusChange = (user: User, checked: boolean) => {
    mutation.mutate({ id: user.id, is_active: checked });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>View and manage all users on the platform.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {response?.data.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell><Badge variant="outline" className="capitalize">{user.user_type}</Badge></TableCell>
                  <TableCell>{user.seller_package || 'N/A'}</TableCell>
                  <TableCell>
                    <Switch
                      checked={user.is_active}
                      onCheckedChange={(checked) => handleStatusChange(user, checked)}
                      aria-label="Toggle user status"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminUsers;