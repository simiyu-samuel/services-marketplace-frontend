import BlogCard from "@/components/blog/BlogCard";
import { mockBlogPosts } from "@/data/mock";
import AnimatedWrapper from "@/components/ui/AnimatedWrapper";

const Blog = () => {
  return (
    <div className="bg-muted">
      <div className="container py-12">
        <div className="text-center mb-12">
          <AnimatedWrapper>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Themabinti Blog</h1>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground mt-2">
              Insights, tips, and stories from the world of beauty, health, and lifestyle in Kenya.
            </p>
          </AnimatedWrapper>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockBlogPosts.map((post, index) => (
            <AnimatedWrapper key={post.id} delay={index * 0.1}>
              <BlogCard post={post} />
            </AnimatedWrapper>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;