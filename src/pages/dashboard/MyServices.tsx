import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { mockServices } from "@/data/mock";
import { useAuth } from "@/contexts/AuthContext";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { showError } from "@/utils/toast";

const MyServices = () => {
  // In a real app, you'd fetch services for the logged-in user.
  // Here, we'll just mock it by assuming the seller is "Glamour Nails" (ID 101).
  const sellerServices = mockServices.filter(s => s.seller.id === 101);

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
                <TableCell>Ksh {service.price.toLocaleString()}</TableCell>
                <TableCell><Badge>Active</Badge></TableCell>
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
      </CardContent>
    </Card>
  );
};

export default MyServices;