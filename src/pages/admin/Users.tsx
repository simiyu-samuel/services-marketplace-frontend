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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  Users as UsersIcon, 
  Search, 
  Filter, 
  UserCheck, 
  UserX, 
  Trash2, 
  RotateCcw, 
  Shield, 
  User, 
  Crown,
  RefreshCw,
  Eye,
  MoreVertical
} from 'lucide-react';
import ModernPageHeader from '@/components/dashboard/ModernPageHeader';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

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
    user_type: 'all',
    is_active: 'all',
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
        user_type: filters.user_type === 'all' ? '' : filters.user_type,
        is_active: filters.is_active === 'all' ? '' : filters.is_active,
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
  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case 'admin': return <Shield className="h-4 w-4" />;
      case 'seller': return <Crown className="h-4 w-4" />;
      case 'customer': return <User className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getUserStatusBadge = (user: User) => {
    if (user.deleted_at) {
      return (
        <Badge variant="outline" className="gap-1 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600">
          <Trash2 className="h-3 w-3" />
          Deleted
        </Badge>
      );
    }
    return user.is_active ? (
      <Badge className="gap-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700">
        <UserCheck className="h-3 w-3" />
        Active
      </Badge>
    ) : (
      <Badge variant="destructive" className="gap-1">
        <UserX className="h-3 w-3" />
        Inactive
      </Badge>
    );
  };

  const getUserTypeBadge = (userType: string) => {
    const colors = {
      admin: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-700',
      seller: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-700',
      customer: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-700'
    };

    return (
      <Badge variant="outline" className={`gap-1 capitalize ${colors[userType as keyof typeof colors] || colors.customer}`}>
        {getUserTypeIcon(userType)}
        {userType}
      </Badge>
    );
  };

  const renderUserCards = () => {
    if (loading) {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      );
    }

    if (users.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="bg-muted/30 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <UsersIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No users found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user, index) => {
          const isSelf = user.id === loggedInAdminId;
          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/20 hover:border-l-primary">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                          {user.name}
                          {isSelf && <Badge variant="secondary" className="text-xs">You</Badge>}
                        </h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="space-y-2">
                      {getUserTypeBadge(user.user_type)}
                      {getUserStatusBadge(user)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ID: #{user.id}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      {user.deleted_at ? (
                        <span className="text-destructive">Deleted User</span>
                      ) : (
                        <span>Active Account</span>
                      )}
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {user.deleted_at === null ? (
                          <>
                            <DropdownMenuItem 
                              onClick={() => openConfirmationDialog(user.id, 'activateDeactivate', false)} 
                              disabled={isSelf}
                              className="gap-2"
                            >
                              {user.is_active ? (
                                <>
                                  <UserX className="h-4 w-4" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <UserCheck className="h-4 w-4" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => openConfirmationDialog(user.id, 'deleteSoft', true)} 
                              disabled={isSelf}
                              className="gap-2 text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </>
                        ) : (
                          <>
                            <DropdownMenuItem 
                              onClick={() => openConfirmationDialog(user.id, 'restore', false)}
                              className="gap-2"
                            >
                              <RotateCcw className="h-4 w-4" />
                              Restore
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => openConfirmationDialog(user.id, 'forceDelete', true)} 
                              disabled={isSelf}
                              className="gap-2 text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                              Force Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    );
  };
  
  // --- JSX ---
  return (
    <div className="space-y-6">
      <div className="max-w-7xl">
        <ModernPageHeader 
          title="User Management" 
          description="Manage platform users, roles, and permissions"
          icon={UsersIcon}
          badge={{
            text: `${pagination?.total || users.length} Users`,
            variant: "secondary"
          }}
          actions={[
            {
              label: "Refresh",
              onClick: () => fetchUsers(),
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
                <div className="bg-blue-500/10 p-2 rounded-lg">
                  <Filter className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">Filters & Search</CardTitle>
                  <CardDescription>Filter users by type, status, or search by name/email</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search users..." 
                    value={filters.search} 
                    onChange={(e) => handleFilterChange('search', e.target.value)} 
                    className="pl-10"
                  />
                </div>
                
                {/* User Type Filter */}
                <Select value={filters.user_type} onValueChange={(value) => handleFilterChange('user_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All User Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="seller">Seller</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                  </SelectContent>
                </Select>
                
                {/* Status Filter */}
                <Select value={filters.is_active} onValueChange={(value) => handleFilterChange('is_active', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                
                {/* Show Deleted Toggle */}
                <div className="flex items-center space-x-2 bg-muted/30 p-3 rounded-lg">
                  <Checkbox 
                    id="showDeleted" 
                    checked={filters.trashed} 
                    onCheckedChange={(checked) => handleFilterChange('trashed', !!checked)} 
                  />
                  <label htmlFor="showDeleted" className="text-sm font-medium cursor-pointer">
                    Show Deleted Users
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Users Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {renderUserCards()}
        </motion.div>

        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
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
                      Page {pagination.current_page} of {pagination.last_page}
                    </span>
                  </div>
                  <Button 
                    onClick={() => handlePageChange(filters.page + 1)} 
                    disabled={filters.page >= pagination.last_page}
                    variant="outline"
                    size="sm"
                  >
                    Next
                  </Button>
                </div>
                <div className="text-center mt-2">
                  <span className="text-xs text-muted-foreground">
                    Showing {pagination.per_page * (pagination.current_page - 1) + 1} to {Math.min(pagination.per_page * pagination.current_page, pagination.total)} of {pagination.total} users
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
    </div>
  );
};

export default AdminUsersPage;
