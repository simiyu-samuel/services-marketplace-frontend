import BlogCard from "@/components/blog/BlogCard";
import { mockBlogPosts } from "@/data/mock";
import AnimatedWrapper from "@/components/ui/AnimatedWrapper";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Blog = () => {
  const featuredPost = mockBlogPosts[0];
  const regularPosts = mockBlogPosts.slice(1);

  return (
    <div className="bg-background text-foreground">
      <div className="container pt-32 pb-16">
        <div className="text-center mb-16">
          <AnimatedWrapper>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
              Themabinti Blog
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
              Insights, tips, and stories from the world of beauty, health, and lifestyle in Kenya.
            </p>
            <div className="relative max-w-md mx-auto mt-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Search articles..." className="pl-12 h-12 text-base rounded-full bg-muted/50 border-border/50" />
            </div>
          </AnimatedWrapper>
        </div>

        {/* Featured Post */}
        <AnimatedWrapper>
          <div className="mb-16 group">
            <BlogCard post={featuredPost} featured />
          </div>
        </AnimatedWrapper>

        {/* Regular Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post, index) => (
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
