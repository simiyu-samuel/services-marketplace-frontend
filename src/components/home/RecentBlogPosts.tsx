import { useQuery } from "@tanstack/react-query";
import BlogCard from "@/components/blog/BlogCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import api from "@/lib/api";
import { BlogPost } from "@/types";

// Fetch blog posts from API - matches your existing API structure
const fetchRecentPosts = async (): Promise<BlogPost[]> => {
  const { data } = await api.get('/blog');
  return data.data || data; // Matches your Blog page API structure
};

const RecentBlogPosts = () => {
  const { data: blogPosts, isLoading, error } = useQuery({
    queryKey: ['recent-blog-posts'],
    queryFn: fetchRecentPosts,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });

  // Filter to only published posts and get first 3
  const recentPosts = (blogPosts || [])
    .filter(post => post.status === 'published')
    .slice(0, 3);

  // Loading state
  if (isLoading) {
    return (
      <section className="py-8 sm:py-16">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="text-center mb-6 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">From Our Blog</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base px-4">
              Get the latest tips, trends, and insights from industry experts.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg overflow-hidden">
                <Skeleton className="h-32 sm:h-48 w-full" />
                <div className="p-3 sm:p-6">
                  <Skeleton className="h-3 sm:h-4 w-20 sm:w-24 mb-1 sm:mb-2" />
                  <Skeleton className="h-4 sm:h-6 w-full mb-1 sm:mb-2" />
                  <Skeleton className="h-3 sm:h-4 w-full mb-1 sm:mb-2" />
                  <Skeleton className="h-3 sm:h-4 w-3/4 mb-2 sm:mb-4" />
                  <Skeleton className="h-3 sm:h-4 w-24 sm:w-32" />
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6 sm:mt-12">
            <Skeleton className="h-8 sm:h-10 w-32 sm:w-40 mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-8 sm:py-16">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="text-center mb-6 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">From Our Blog</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base px-4">
              Get the latest tips, trends, and insights from industry experts.
            </p>
          </div>
          <div className="text-center py-8 sm:py-12">
            <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">
              Unable to load blog posts. Please try again later.
            </p>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              size="sm"
              className="sm:size-default"
            >
              Retry
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // If no published posts are available
  if (recentPosts.length === 0) {
    return (
      <section className="py-8 sm:py-16">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="text-center mb-6 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">From Our Blog</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base px-4">
              Get the latest tips, trends, and insights from industry experts.
            </p>
          </div>
          <div className="text-center py-8 sm:py-12">
            <p className="text-muted-foreground text-sm sm:text-base">
              No blog posts available yet. Check back soon!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-16">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="text-center mb-6 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">From Our Blog</h2>
          <p className="max-w-2xl mx-auto text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base px-4">
            Get the latest tips, trends, and insights from industry experts.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {recentPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
        <div className="text-center mt-6 sm:mt-12">
          <Button size="sm" variant="outline" asChild className="sm:size-lg">
            <Link to="/blog" className="gap-1 sm:gap-2 text-sm sm:text-base">
              Read More Articles <ArrowRight className="h-3 sm:h-4 w-3 sm:w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RecentBlogPosts;