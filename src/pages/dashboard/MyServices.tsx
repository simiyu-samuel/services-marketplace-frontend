import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { showError } from "@/utils/toast";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { PaginatedResponse, Service } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

const fetchMyServices = async (sellerId: number) => {
  const { data } = await api.get('/services', { 
    params: { 'filter[seller_id]': sellerId } 
  });
  return (data as PaginatedResponse<Service>).data;
};

const MyServices = () => {
  const { user } = useAuth();
  const { data: sellerServices, isLoading } = useQuery<Service[]>({
    queryKey: ['my-services', user?.id],
    queryFn: () => fetchMyServices(user!.id),
    enabled: user?.user_type === 'seller' && !!user?.id,
  });

  if (user?.user_type !== 'seller') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Services</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This page is for sellers to manage their services.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>My Services</CardTitle>
          <CardDescription>Manage your service listings.</CardDescription>
        </div>
        <Button onClick={() => showError("Feature coming soon!")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Service
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : sellerServices && sellerServices.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sellerServices.map(service => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.title}</TableCell>
                  <TableCell>{service.category}</TableCell>
                  <TableCell>Ksh {parseFloat(service.price).toLocaleString()}</TableCell>
                  <TableCell><Badge>{service.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => showError("Feature coming soon!")}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => showError("Feature coming soon!")}>Pause</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => showError("Feature coming soon!")}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-muted-foreground py-8">You haven't created any services yet.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default MyServices;