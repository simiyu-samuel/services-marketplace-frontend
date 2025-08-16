import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import BlogPostForm, { BlogPostFormValues } from "@/components/admin/BlogPostForm";
import { showSuccess, showError } from "@/utils/toast";

const createBlogPost = async (data: FormData) => {
  const { data: response } = await api.post('/admin/blogs', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.blog;
};

const CreateBlogPost = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createBlogPost,
    onSuccess: () => {
      showSuccess("Blog post created successfully!");
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      navigate("/admin/blog");
    },
    onError: (error: any) => {
      showError(error.response?.data?.message || "Failed to create blog post.");
    },
  });

  const handleFormSubmit = (values: BlogPostFormValues) => {
    const formData = new FormData();
    
    (Object.keys(values) as Array<keyof BlogPostFormValues>).forEach(key => {
      const value = values[key];
      if (key === 'featured_image' && value instanceof FileList && value.length > 0) {
        formData.append('featured_image', value[0]);
      } else if (key !== 'featured_image' && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    mutation.mutate(formData);
  };

  return (
    <BlogPostForm 
      onSubmit={handleFormSubmit} 
      isLoading={mutation.isPending}
      submitButtonText="Create Post"
    />
  );
};

export default CreateBlogPost;