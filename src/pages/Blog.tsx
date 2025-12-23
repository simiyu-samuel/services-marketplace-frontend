import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import BlogCard from "@/components/blog/BlogCard";
import AnimatedWrapper from "@/components/ui/AnimatedWrapper";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import api from "@/lib/api";
import { BlogPost } from "@/types";

const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  const { data } = await api.get('/blog');
  return data.data || data;
};

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: blogPosts, isLoading, error } = useQuery({
    queryKey: ['blogs'],
    queryFn: fetchBlogPosts,
  });

  const filteredPosts = blogPosts?.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const featuredPost = filteredPosts[0];
  const regularPosts = filteredPosts.slice(1);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading blog posts..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Failed to load blog posts</h2>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }

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
              <Input 
                placeholder="Search articles..." 
                className="pl-12 h-12 text-base rounded-full bg-muted/50 border-border/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </AnimatedWrapper>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">No blog posts found.</p>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <AnimatedWrapper>
                <div className="mb-16 group">
                  <BlogCard post={featuredPost} featured />
                </div>
              </AnimatedWrapper>
            )}

            {/* Regular Posts */}
            {regularPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularPosts.map((post, index) => (
                  <AnimatedWrapper key={post.id} delay={index * 0.1}>
                    <BlogCard post={post} />
                  </AnimatedWrapper>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;
