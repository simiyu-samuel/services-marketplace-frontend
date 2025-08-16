import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { PaginatedResponse, Payment } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const fetchPayments = async (page: number) => {
  const { data } = await api.get('/payments/history', { params: { page } });
  return data.payments as PaginatedResponse<Payment>;
};

const PaymentHistory = () => {
  const [page, setPage] = useState(1);

  const { data: response, isLoading } = useQuery({
    queryKey: ['payments', page],
    queryFn: () => fetchPayments(page),
    keepPreviousData: true,
  });

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
        <CardTitle>Payment History</CardTitle>
        <CardDescription>A record of all your transactions on the platform.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && !response ? (
          <div className="space-y-2"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>
        ) : response && response.data.length > 0 ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
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
          <p className="text-center text-muted-foreground py-8">You have no payment history.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentHistory;