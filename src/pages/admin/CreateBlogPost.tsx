import { useNavigate } from "react-router-dom";
import BlogPostForm, { BlogPostFormValues } from "@/components/admin/BlogPostForm";
import { showSuccess, showError } from "@/utils/toast";
import { useState } from "react";

const CreateBlogPost = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = (values: BlogPostFormValues) => {
    setIsLoading(true);
    // In a real app, you'd have a mutation here to call the API
    console.log("Creating blog post:", values);
    setTimeout(() => {
      try {
        showSuccess("Blog post created successfully!");
        navigate("/admin/blog");
      } catch (error) {
        showError("Failed to create blog post.");
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <BlogPostForm 
      onSubmit={handleFormSubmit} 
      isLoading={isLoading}
      submitButtonText="Create Post"
    />
  );
};

export default CreateBlogPost;