import { mockBlogPosts } from "@/data/mock";
import BlogCard from "@/components/blog/BlogCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const RecentBlogPosts = () => {
  const recentPosts = mockBlogPosts.slice(0, 3);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">From Our Blog</h2>
          <p className="max-w-2xl mx-auto text-muted-foreground mt-2">
            Get the latest tips, trends, and insights from industry experts.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" asChild>
            <Link to="/blog" className="gap-2">
              Read More Articles <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RecentBlogPosts;