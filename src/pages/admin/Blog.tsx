import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BlogPost, PaginatedResponse } from "@/types";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const fetchBlogPosts = async (page: number): Promise<PaginatedResponse<BlogPost>> => {
  const { data } = await api.get('/admin/blogs', { params: { page } });
  return data;
};

const deleteBlogPost = async (id: number) => {
  await api.delete(`/admin/blogs/${id}`);
};

const AdminBlog = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ['admin-blog-posts', page],
    queryFn: () => fetchBlogPosts(page),
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBlogPost,
    onSuccess: () => {
      showSuccess("Blog post deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      setIsDeleteDialogOpen(false);
      setSelectedPost(null);
    },
    onError: () => {
      showError("Failed to delete post.");
    }
  });

  const handleDeleteClick = (post: BlogPost) => {
    setSelectedPost(post);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedPost) {
      deleteMutation.mutate(selectedPost.id);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Blog Management</CardTitle>
            <CardDescription>Create, edit, and manage your blog posts.</CardDescription>
          </div>
          <Button asChild>
            <Link to="/admin/blog/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Post
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && !response ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
                ))
              ) : (
                response?.data.map(post => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
                      {post.category ? (
                        <Badge variant="secondary" className="capitalize">
                          {post.category}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm italic">Not set</span>
                      )}
                    </TableCell>
                    <TableCell>{post.admin?.name || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={post.status === 'published' ? 'default' : 'outline'} 
                        className="capitalize"
                      >
                        {post.status || 'draft'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/admin/blog/edit/${post.id}`)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.open(`/blog/${post.slug}`, '_blank')}>
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteClick(post)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {response && response.last_page > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        setPage(p => Math.max(1, p - 1)); 
                      }} 
                      className={response.current_page === 1 ? 'pointer-events-none opacity-50' : ''} 
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink>Page {response.current_page} of {response.last_page}</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        setPage(p => Math.min(response.last_page, p + 1)); 
                      }} 
                      className={response.current_page === response.last_page ? 'pointer-events-none opacity-50' : ''} 
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the post "{selectedPost?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminBlog;