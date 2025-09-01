import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Contact, PaginatedResponse } from "@/types";
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
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
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
  MessageSquare,
  Search, 
  Filter, 
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  MoreVertical,
  RefreshCw,
  Mail,
  Phone,
  User,
  Calendar,
  Reply
} from 'lucide-react';
import ModernPageHeader from '@/components/dashboard/ModernPageHeader';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// --- Type Definitions ---
interface ContactFilters {
  status: string;
  priority: string;
  category: string;
  search: string;
  page: number;
}

const fetchContacts = async (filters?: Partial<ContactFilters>): Promise<PaginatedResponse<Contact>> => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.append(key, value.toString());
      }
    });
  }
  const { data } = await api.get(`/admin/contacts?${params.toString()}`);
  return data;
};

const fetchContact = async (id: number): Promise<Contact> => {
  const { data } = await api.get(`/admin/contacts/${id}`);
  return data;
};

const respondToContact = async ({ id, admin_response }: { id: number, admin_response: string }) => {
  const { data } = await api.post(`/admin/contacts/${id}/respond`, { admin_response });
  return data.contact;
};

const updateContactStatus = async ({ id, status }: { id: number, status: string }) => {
  await api.put(`/admin/contacts/${id}`, { status });
};

const AdminContacts = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<ContactFilters>({
    status: 'all',
    priority: 'all',
    category: 'all',
    search: '',
    page: 1,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [responseText, setResponseText] = useState("");

  const { data: contactsResponse, isLoading: isLoadingContacts, refetch } = useQuery({
    queryKey: ['admin-contacts', filters],
    queryFn: () => fetchContacts(filters),
  });

  const statusMutation = useMutation({
    mutationFn: updateContactStatus,
    onSuccess: () => {
      toast.success("Contact status updated successfully");
      queryClient.invalidateQueries({ queryKey: ['admin-contacts'] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to update contact status';
      toast.error(errorMessage);
    },
  });

  const responseMutation = useMutation({
    mutationFn: respondToContact,
    onSuccess: () => {
      toast.success("Response sent successfully!");
      queryClient.invalidateQueries({ queryKey: ['admin-contacts'] });
      setReplyDialogOpen(false);
      setResponseText('');
      setSelectedContact(null);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to send response';
      toast.error(errorMessage);
    }
  });

  // --- Event Handlers ---
  const handleFilterChange = (key: keyof Omit<ContactFilters, 'page'>, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const openViewDialog = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDialogOpen(true);
    // Mark as read if it's unread
    if (contact.status === 'unread') {
      statusMutation.mutate({ id: contact.id, status: 'read' });
    }
  };

  const openReplyDialog = (contact: Contact) => {
    setSelectedContact(contact);
    setResponseText(contact.admin_response || '');
    setReplyDialogOpen(true);
  };

  const handleSendResponse = () => {
    if (selectedContact && responseText.trim()) {
      responseMutation.mutate({ id: selectedContact.id, admin_response: responseText });
    }
  };

  const updateStatus = (contactId: number, status: string) => {
    statusMutation.mutate({ id: contactId, status });
  };

  // --- UI Rendering Helpers ---
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unread':
        return (
          <Badge className="gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-700">
            <AlertCircle className="h-3 w-3" />
            Unread
          </Badge>
        );
      case 'read':
        return (
          <Badge variant="outline" className="gap-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700">
            <Eye className="h-3 w-3" />
            Read
          </Badge>
        );
      case 'responded':
        return (
          <Badge className="gap-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700">
            <Reply className="h-3 w-3" />
            Responded
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

  const renderContactCards = () => {
    if (isLoadingContacts) {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full rounded-xl" />
          ))}
        </div>
      );
    }

    if (!contactsResponse?.data || contactsResponse.data.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="bg-muted/30 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <MessageSquare className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No contacts found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {contactsResponse.data.map((contact, index) => (
          <motion.div
            key={contact.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className={`hover:shadow-lg transition-all duration-300 border-l-4 cursor-pointer ${
              contact.status === 'unread' 
                ? 'border-l-blue-500 bg-blue-50/30 dark:bg-blue-900/10' 
                : 'border-l-primary/20 hover:border-l-primary'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground line-clamp-1 mb-2">
                      {contact.subject}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                      {contact.message}
                    </p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{contact.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {contact.email}
                      </div>
                      {contact.phone_number && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {contact.phone_number}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-2">
                    {getStatusBadge(contact.status)}
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">
                      ID: #{contact.id}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(contact.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => openViewDialog(contact)}
                        className="gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View Full Message
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem 
                        onClick={() => openReplyDialog(contact)}
                        className="gap-2 text-blue-600"
                      >
                        <Reply className="h-4 w-4" />
                        Reply
                      </DropdownMenuItem>
                      
                      {contact.status !== 'responded' && (
                        <DropdownMenuItem 
                          onClick={() => updateStatus(contact.id, 'responded')}
                          className="gap-2 text-green-600"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Mark Responded
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
          title="Contact Management" 
          description="Manage customer inquiries, support requests, and feedback"
          icon={MessageSquare}
          badge={{
            text: `${contactsResponse?.meta?.total || contactsResponse?.data?.length || 0} Messages`,
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
                <div className="bg-purple-500/10 p-2 rounded-lg">
                  <Filter className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">Filters & Search</CardTitle>
                  <CardDescription>Filter contacts by status or search</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search contacts..." 
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
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="responded">Responded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contacts Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {renderContactCards()}
        </motion.div>

        {/* Pagination */}
        {contactsResponse?.meta && contactsResponse.meta.last_page > 1 && (
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
                      Page {contactsResponse.meta.current_page} of {contactsResponse.meta.last_page}
                    </span>
                  </div>
                  <Button 
                    onClick={() => handlePageChange(filters.page + 1)} 
                    disabled={filters.page >= contactsResponse.meta.last_page}
                    variant="outline"
                    size="sm"
                  >
                    Next
                  </Button>
                </div>
                <div className="text-center mt-2">
                  <span className="text-xs text-muted-foreground">
                    Showing {contactsResponse.meta.per_page * (contactsResponse.meta.current_page - 1) + 1} to {Math.min(contactsResponse.meta.per_page * contactsResponse.meta.current_page, contactsResponse.meta.total)} of {contactsResponse.meta.total} contacts
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* View Contact Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Contact Details
              </DialogTitle>
            </DialogHeader>
            {selectedContact && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    <p className="font-medium">{selectedContact.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="font-medium">{selectedContact.email}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Subject</label>
                  <p className="font-medium">{selectedContact.subject}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Message</label>
                  <div className="bg-muted/30 p-4 rounded-lg mt-2">
                    <p className="text-sm whitespace-pre-wrap">{selectedContact.message}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {getStatusBadge(selectedContact.status)}
                </div>

                {selectedContact.admin_response && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Previous Response</label>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mt-2">
                      <p className="text-sm">{selectedContact.admin_response}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setIsDialogOpen(false)}>
                Close
              </Button>
              {selectedContact && (
                <Button 
                  type="button" 
                  onClick={() => {
                    setIsDialogOpen(false);
                    openReplyDialog(selectedContact);
                  }}
                >
                  Reply
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reply Dialog */}
        <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Reply className="h-5 w-5" />
                Reply to {selectedContact?.name}
              </DialogTitle>
              <DialogDescription>
                Send a reply to this contact inquiry
              </DialogDescription>
            </DialogHeader>
            {selectedContact && (
              <div className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">Original Subject: {selectedContact.subject}</p>
                  <p className="text-sm text-muted-foreground line-clamp-3">{selectedContact.message}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Your Reply</label>
                  <Textarea
                    placeholder="Type your reply here..."
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    className="mt-2 min-h-[120px]"
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setReplyDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="button" 
                onClick={handleSendResponse}
                disabled={!responseText.trim() || responseMutation.isPending}
              >
                {responseMutation.isPending ? 'Sending...' : 'Send Reply'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminContacts;