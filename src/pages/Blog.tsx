import BlogCard from "@/components/blog/BlogCard";
import { mockBlogPosts } from "@/data/mock";

const Blog = () => {
  return (
    <div className="container py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Themabinti Blog</h1>
        <p className="max-w-2xl mx-auto text-lg text-muted-foreground mt-2">
          Insights, tips, and stories from the world of beauty, health, and lifestyle in Kenya.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockBlogPosts.map(post => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Blog;