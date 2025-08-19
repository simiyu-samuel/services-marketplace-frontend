import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/api'; // Assuming a pre-configured axios instance
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
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

// --- Type Definitions ---
interface User {
  id: number;
  name: string;
  email: string;
  user_type: string;
  is_active: boolean;
  deleted_at: string | null;
  // Add any other user fields you need, like seller_package
}

interface Pagination {
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

interface UserApiResponse {
  data: User[];
  meta: Pagination; // Assuming pagination data is in a 'meta' object
}

interface UserFilters {
  user_type: string;
  is_active: string; // Use string to accommodate 'true', 'false', and ''
  search: string;
  trashed: boolean;
  page: number;
}

// --- Component ---
const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<UserFilters>({
    user_type: '',
    is_active: '',
    search: '',
    trashed: false,
    page: 1,
  });
  const [password, setPassword] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionDetails, setActionDetails] = useState<{ userId: number | null; action: string; passwordRequired: boolean }>({ userId: null, action: '', passwordRequired: false });

  // Assume the logged-in admin's ID is available, e.g., from an auth context
  const loggedInAdminId = 1;

  // --- Data Fetching ---
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: filters.page.toString(),
        search: filters.search,
        user_type: filters.user_type,
        is_active: filters.is_active,
        trashed: String(filters.trashed),
      });

      const response = await apiClient.get<UserApiResponse>(`/admin/users?${params.toString()}`);
      setUsers(response.data.data);
      setPagination(response.data.meta);
    } catch (error) {
      toast.error('Failed to fetch users. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // --- Event Handlers ---
  const handleFilterChange = (key: keyof Omit<UserFilters, 'page'>, value: string | boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 })); // Reset to page 1 on filter change
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };
  
  const openConfirmationDialog = (userId: number, action: string, passwordRequired: boolean) => {
    setActionDetails({ userId, action, passwordRequired });
    setConfirmDialogOpen(true);
  };

  const closeConfirmationDialog = () => {
    setConfirmDialogOpen(false);
    setPassword('');
    setActionDetails({ userId: null, action: '', passwordRequired: false });
  };

  // --- Action Logic ---
  const confirmAction = async () => {
    if (!actionDetails.userId) return;

    try {
      let response;
      const { userId, action, passwordRequired } = actionDetails;
      const user = users.find(u => u.id === userId);

      switch (action) {
        case 'activateDeactivate':
          if (user) {
            response = await apiClient.put(`/admin/users/${userId}`, { is_active: !user.is_active });
          }
          break;
        case 'deleteSoft':
          response = await apiClient.delete(`/admin/users/${userId}`, { data: { admin_password: password } });
          break;
        case 'restore':
          response = await apiClient.post(`/admin/users/${userId}/restore`);
          break;
        case 'forceDelete':
          response = await apiClient.delete(`/admin/users/${userId}/force-delete`, { data: { admin_password: password } });
          break;
        default:
          throw new Error('Invalid action');
      }

      toast.success(response.data.message);
      fetchUsers(); // Re-fetch users to update the list
      closeConfirmationDialog();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An unknown error occurred.';
      toast.error(`Action failed: ${errorMessage}`);
      // Don't close dialog if a password was required, to allow retry
      if (!actionDetails.passwordRequired) {
        closeConfirmationDialog();
      }
    }
  };

  // --- UI Rendering Helpers ---
  const getUserStatusBadge = (user: User) => {
    if (user.deleted_at) {
      return <Badge variant="outline">Deleted</Badge>;
    }
    return user.is_active ? <Badge>Active</Badge> : <Badge variant="destructive">Inactive</Badge>;
  };

  const getActionButtons = (user: User) => {
    const isSelf = user.id === loggedInAdminId;
    return (
      <div className="flex space-x-2">
        {user.deleted_at === null ? (
          <>
            <Button variant="outline" size="sm" onClick={() => openConfirmationDialog(user.id, 'activateDeactivate', false)} disabled={isSelf}>
              {user.is_active ? 'Deactivate' : 'Activate'}
            </Button>
            <Button variant="destructive" size="sm" onClick={() => openConfirmationDialog(user.id, 'deleteSoft', true)} disabled={isSelf}>
              Delete
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" size="sm" onClick={() => openConfirmationDialog(user.id, 'restore', false)}>
              Restore
            </Button>
            <Button variant="destructive" size="sm" onClick={() => openConfirmationDialog(user.id, 'forceDelete', true)} disabled={isSelf}>
              Force Delete
            </Button>
          </>
        )}
      </div>
    );
  };
  
  // --- JSX ---
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin User Management</h1>

      {/* Filter Controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <Input placeholder="Search users..." value={filters.search} onChange={(e) => handleFilterChange('search', e.target.value)} className="max-w-sm" />
          <select value={filters.user_type} onChange={(e) => handleFilterChange('user_type', e.target.value)} className="p-2 border rounded">
            <option value="">All Types</option>
            <option value="admin">Admin</option>
            <option value="seller">Seller</option>
            <option value="customer">Customer</option>
          </select>
          <select value={filters.is_active} onChange={(e) => handleFilterChange('is_active', e.target.value)} className="p-2 border rounded">
            <option value="">All Statuses</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="showDeleted" checked={filters.trashed} onCheckedChange={(checked) => handleFilterChange('trashed', !!checked)} />
          <label htmlFor="showDeleted">Show Deleted Users</label>
        </div>
      </div>

      {/* User Table */}
      {loading ? (
        <div>Loading users...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.user_type}</TableCell>
                <TableCell>{getUserStatusBadge(user)}</TableCell>
                <TableCell>{getActionButtons(user)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Pagination Controls */}
      {pagination && pagination.last_page > 1 && (
        <div className="flex justify-end items-center space-x-2 mt-4">
            <Button onClick={() => handlePageChange(filters.page - 1)} disabled={filters.page <= 1}>Previous</Button>
            <span>Page {pagination.current_page} of {pagination.last_page}</span>
            <Button onClick={() => handlePageChange(filters.page + 1)} disabled={filters.page >= pagination.last_page}>Next</Button>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {actionDetails.action === 'deleteSoft' && 'Confirm Deletion'}
              {actionDetails.action === 'forceDelete' && 'Confirm Permanent Deletion'}
              {actionDetails.action === 'restore' && 'Confirm Restore'}
              {actionDetails.action === 'activateDeactivate' && 'Confirm Status Change'}
            </DialogTitle>
            <DialogDescription>
              {actionDetails.action === 'activateDeactivate' && 'Are you sure you want to change this user\'s status?'}
              {actionDetails.action === 'deleteSoft' && 'This will deactivate the user\'s account. You can restore it later. Please enter your password to confirm.'}
              {actionDetails.action === 'restore' && 'Are you sure you want to restore this user\'s account?'}
              {actionDetails.action === 'forceDelete' && 'This action is irreversible and will permanently delete the user. Please enter your password to confirm.'}
            </DialogDescription>
          </DialogHeader>
          {actionDetails.passwordRequired && (
            <div className="grid gap-4 py-4">
              <label htmlFor="password">Admin Password</label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={closeConfirmationDialog}>Cancel</Button>
            <Button type="button" onClick={confirmAction} disabled={actionDetails.passwordRequired && !password}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsersPage;
