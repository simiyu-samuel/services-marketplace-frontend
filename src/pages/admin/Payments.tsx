import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { PaginatedResponse, Payment } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";

const fetchPayments = async (page: number, search: string) => {
  const { data } = await api.get('/admin/payments', { params: { page, search } });
  return data as PaginatedResponse<Payment>;
};

const AdminPayments = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: response, isLoading } = useQuery({
    queryKey: ['admin-payments', page, searchTerm],
    queryFn: () => fetchPayments(page, searchTerm),
    keepPreviousData: true,
  });

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
    setSearchTerm(search);
  };

  const getStatusVariant = (status: Payment['status']) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'outline';
      default: return 'destructive';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Management</CardTitle>
        <CardDescription>View and search all transactions on the platform.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="mb-4">
          <Input 
            placeholder="Search by receipt, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        {isLoading && !response ? (
          <div className="space-y-2"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>
        ) : response && response.data.length > 0 ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {response.data.map(payment => (
                  <TableRow key={payment.id}>
                    <TableCell>{new Date(payment.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{payment.user?.name || 'N/A'}</TableCell>
                    <TableCell className="capitalize">{payment.payment_type.replace('_', ' ')}</TableCell>
                    <TableCell>Ksh {parseFloat(payment.amount).toLocaleString()}</TableCell>
                    <TableCell><Badge variant={getStatusVariant(payment.status)} className="capitalize">{payment.status}</Badge></TableCell>
                    <TableCell>{payment.mpesa_receipt_number || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {response.last_page > 1 && (
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem><PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setPage(p => Math.max(1, p - 1)); }} className={response.current_page === 1 ? 'pointer-events-none opacity-50' : ''} /></PaginationItem>
                    <PaginationItem><PaginationLink>Page {response.current_page} of {response.last_page}</PaginationLink></PaginationItem>
                    <PaginationItem><PaginationNext href="#" onClick={(e) => { e.preventDefault(); setPage(p => Math.min(response.last_page, p + 1)); }} className={response.current_page === response.last_page ? 'pointer-events-none opacity-50' : ''} /></PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-muted-foreground py-8">No payments found.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminPayments;