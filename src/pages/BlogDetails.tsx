import { useParams } from "react-router-dom";
import { mockBlogPosts } from "@/data/mock";
import NotFound from "./NotFound";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const BlogDetails = () => {
  const { slug } = useParams();
  const post = mockBlogPosts.find(p => p.slug === slug);

  if (!post) {
    return <NotFound />;
  }

  return (
    <div className="container py-8">
      <article className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <Badge variant="secondary" className="mb-2">{post.category}</Badge>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">{post.title}</h1>
          <div className="flex justify-center items-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.author.profile_image || undefined} />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>By {post.author.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>{new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{post.reading_time} min read</span>
            </div>
          </div>
        </header>
        <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-8">
          <img src={post.featured_image_url} alt={post.title} className="object-cover w-full h-full" />
        </div>
        <div 
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content || post.excerpt }}
        />
      </article>
    </div>
  );
};

export default BlogDetails;