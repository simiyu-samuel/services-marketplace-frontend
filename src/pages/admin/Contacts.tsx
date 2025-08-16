import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { mockContacts } from "@/data/mock";
import { Contact } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { showSuccess } from "@/utils/toast";

// Simulate an API call
const fetchContacts = async (): Promise<Contact[]> => {
  return new Promise(resolve => setTimeout(() => resolve(mockContacts), 500));
};

const AdminContacts = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [responseText, setResponseText] = useState("");

  const { data: contacts, isLoading } = useQuery({
    queryKey: ['admin-contacts'],
    queryFn: fetchContacts,
  });

  const handleViewClick = (contact: Contact) => {
    setSelectedContact(contact);
    setResponseText(contact.admin_response || "");
    setIsDialogOpen(true);
  };

  const handleSendResponse = () => {
    console.log("Sending response to:", selectedContact?.email, "Response:", responseText);
    showSuccess("Response sent successfully!");
    // Here you would typically have a mutation to update the contact status and response
    setIsDialogOpen(false);
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
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center">Loading messages...</TableCell></TableRow>
              ) : (
                contacts?.map(contact => (
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
          <DialogHeader>
            <DialogTitle>{selectedContact?.subject}</DialogTitle>
            <DialogDescription>
              From: {selectedContact?.name} ({selectedContact?.email})
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">{selectedContact?.message}</p>
            </div>
            <div>
              <Label htmlFor="response" className="font-semibold">Your Response</Label>
              <Textarea 
                id="response" 
                rows={5} 
                className="mt-2"
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Type your response here..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Close</Button>
            <Button onClick={handleSendResponse}>Send Response</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminContacts;