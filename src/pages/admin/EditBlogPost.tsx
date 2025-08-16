import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import BlogPostForm, { BlogPostFormValues } from "@/components/admin/BlogPostForm";
import { showSuccess, showError } from "@/utils/toast";
import { BlogPost } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

const fetchBlogPost = async (id: string) => {
  const { data } = await api.get(`/admin/blogs/${id}`);
  return data as BlogPost;
};

const updateBlogPost = async ({ id, formData }: { id: string, formData: FormData }) => {
  formData.append('_method', 'PUT');
  const { data: response } = await api.post(`/admin/blogs/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.blog;
};

const EditBlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: postToEdit, isLoading: isQueryLoading } = useQuery({
    queryKey: ['admin-blog-post', id],
    queryFn: () => fetchBlogPost(id!),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: updateBlogPost,
    onSuccess: () => {
      showSuccess("Blog post updated successfully!");
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['admin-blog-post', id] });
      navigate("/admin/blog");
    },
    onError: (error: any) => {
      showError(error.response?.data?.message || "Failed to update blog post.");
    },
  });

  const handleFormSubmit = (values: BlogPostFormValues) => {
    if (!id) return;
    const formData = new FormData();
    
    (Object.keys(values) as Array<keyof BlogPostFormValues>).forEach(key => {
      const value = values[key];
      if (key === 'featured_image' && value instanceof FileList && value.length > 0) {
        formData.append('featured_image', value[0]);
      } else if (key !== 'featured_image' && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    mutation.mutate({ id, formData });
  };

  if (isQueryLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!postToEdit) {
    return <p>Blog post not found.</p>;
  }

  return (
    <BlogPostForm 
      onSubmit={handleFormSubmit} 
      isLoading={mutation.isPending}
      initialData={postToEdit}
      submitButtonText="Update Post"
    />
  );
};

export default EditBlogPost;