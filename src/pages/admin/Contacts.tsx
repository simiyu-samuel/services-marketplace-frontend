import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Contact, PaginatedResponse } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { showSuccess, showError } from "@/utils/toast";
import { Skeleton } from "@/components/ui/skeleton";

const fetchContacts = async (): Promise<PaginatedResponse<Contact>> => {
  const { data } = await api.get('/admin/contacts');
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

const AdminContacts = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
  const [responseText, setResponseText] = useState("");

  const { data: contactsResponse, isLoading: isLoadingContacts } = useQuery({
    queryKey: ['admin-contacts'],
    queryFn: fetchContacts,
  });

  const { data: selectedContact, isLoading: isLoadingSelected } = useQuery({
    queryKey: ['admin-contact', selectedContactId],
    queryFn: () => fetchContact(selectedContactId!),
    enabled: !!selectedContactId,
    onSuccess: (data) => {
      setResponseText(data.admin_response || "");
      // Invalidate list to update status from 'unread' to 'read'
      queryClient.invalidateQueries({ queryKey: ['admin-contacts'] });
    }
  });

  const mutation = useMutation({
    mutationFn: respondToContact,
    onSuccess: () => {
      showSuccess("Response sent successfully!");
      queryClient.invalidateQueries({ queryKey: ['admin-contacts'] });
      setIsDialogOpen(false);
    },
    onError: () => {
      showError("Failed to send response.");
    }
  });

  const handleViewClick = (contact: Contact) => {
    setSelectedContactId(contact.id);
    setIsDialogOpen(true);
  };

  const handleSendResponse = () => {
    if (selectedContactId) {
      mutation.mutate({ id: selectedContactId, admin_response: responseText });
    }
  };

  const getStatusVariant = (status: Contact['status']) => {
    switch (status) {
      case 'unread': return 'default';
      case 'read': return 'secondary';
      case 'responded': return 'outline';
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Contact Messages</CardTitle>
          <CardDescription>View and respond to inquiries from users.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>From</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingContacts ? (
                <TableRow><TableCell colSpan={5}><Skeleton className="h-10 w-full" /></TableCell></TableRow>
              ) : (
                contactsResponse?.data.map(contact => (
                  <TableRow key={contact.id} className={contact.status === 'unread' ? 'font-bold' : ''}>
                    <TableCell>{new Date(contact.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{contact.name}</TableCell>
                    <TableCell>{contact.subject}</TableCell>
                    <TableCell><Badge variant={getStatusVariant(contact.status)} className="capitalize">{contact.status}</Badge></TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleViewClick(contact)}>View / Respond</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          {isLoadingSelected || !selectedContact ? (
            <div className="p-8"><Skeleton className="h-48 w-full" /></div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>{selectedContact.subject}</DialogTitle>
                <DialogDescription>From: {selectedContact.name} ({selectedContact.email})</DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="p-4 bg-muted rounded-lg"><p className="text-sm">{selectedContact.message}</p></div>
                <div>
                  <Label htmlFor="response" className="font-semibold">Your Response</Label>
                  <Textarea id="response" rows={5} className="mt-2" value={responseText} onChange={(e) => setResponseText(e.target.value)} placeholder="Type your response here..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Close</Button>
                <Button onClick={handleSendResponse} disabled={mutation.isPending}>
                  {mutation.isPending ? "Sending..." : "Send Response"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminContacts;