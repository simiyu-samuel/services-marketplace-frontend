import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import NotFound from "./NotFound";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AuthorBio from "@/components/blog/AuthorBio";
import SocialShare from "@/components/blog/SocialShare";
import RelatedPosts from "@/components/blog/RelatedPosts";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import api from "@/lib/api";
import { BlogPost } from "@/types";

const fetchBlogPost = async (slug: string): Promise<BlogPost> => {
  const { data } = await api.get(`/blog/${slug}`);
  return data;
};

const BlogDetails = () => {
  const { slug } = useParams();
  
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => fetchBlogPost(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading blog post..." />
      </div>
    );
  }

  if (error || !post) {
    return <NotFound />;
  }

  // Use admin or author, whichever is available
  const author = post.admin || post.author;
  const imageUrl = post.featured_image_url || post.featured_image;

  return (
    <div className="bg-background text-foreground">
      <div className="container pt-32 pb-16">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center mb-12"
        >
          <Badge variant="secondary" className="mb-4 text-lg py-1 px-4 rounded-full">{post.category}</Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6">{post.title}</h1>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-muted-foreground">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={author?.profile_image || undefined} />
                <AvatarFallback>{author?.name?.charAt(0) || 'A'}</AvatarFallback>
              </Avatar>
              <span className="font-semibold text-foreground">By {author?.name || 'Admin'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>{new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            {post.reading_time && (
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{post.reading_time} min read</span>
              </div>
            )}
          </div>
        </motion.header>
        
        {/* Featured Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="overflow-hidden rounded-3xl mb-12 shadow-2xl aspect-video max-w-6xl mx-auto"
        >
          <img src={imageUrl} alt={post.title} className="object-cover w-full h-full" />
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 max-w-7xl mx-auto">
          {/* Main Content */}
          <motion.article 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          className="lg:col-span-8"
        >
          <div 
            className="prose dark:prose-invert max-w-none prose-lg prose-p:text-foreground/80 prose-li:text-foreground/80 prose-headings:text-foreground prose-strong:text-foreground prose-a:text-primary hover:prose-a:text-primary/80"
            dangerouslySetInnerHTML={{ __html: post.content || post.excerpt }}
          />
        </motion.article>

        {/* Sidebar */}
        <motion.aside 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          className="lg:col-span-4"
        >
          <div className="lg:sticky lg:top-28 space-y-10">
            {author && <AuthorBio author={author} />}
            <SocialShare title={post.title} slug={post.slug} />
          </div>
        </motion.aside>
        </div>
        
        {/* Related Posts */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
          className="mt-24"
        >
          <RelatedPosts currentPostId={post.id} category={post.category} />
        </motion.div>
      </div>
    </div>
  );
};

export default BlogDetails;
