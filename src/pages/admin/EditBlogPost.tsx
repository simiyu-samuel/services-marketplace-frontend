import { useNavigate, useParams } from "react-router-dom";
import BlogPostForm, { BlogPostFormValues } from "@/components/admin/BlogPostForm";
import { showSuccess, showError } from "@/utils/toast";
import { useState } from "react";
import { mockBlogPosts } from "@/data/mock";
import { Skeleton } from "@/components/ui/skeleton";

const EditBlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // In a real app, you'd use react-query to fetch the post
  const postToEdit = mockBlogPosts.find(p => p.slug === slug);

  const handleFormSubmit = (values: BlogPostFormValues) => {
    setIsLoading(true);
    // In a real app, you'd have a mutation here to call the API
    console.log("Updating blog post:", slug, values);
    setTimeout(() => {
      try {
        showSuccess("Blog post updated successfully!");
        navigate("/admin/blog");
      } catch (error) {
        showError("Failed to update blog post.");
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  if (!postToEdit) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <BlogPostForm 
      onSubmit={handleFormSubmit} 
      isLoading={isLoading}
      initialData={postToEdit}
      submitButtonText="Update Post"
    />
  );
};

export default EditBlogPost;