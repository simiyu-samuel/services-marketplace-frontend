import { useParams } from "react-router-dom";
import { mockBlogPosts } from "@/data/mock";
import NotFound from "./NotFound";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AuthorBio from "@/components/blog/AuthorBio";
import SocialShare from "@/components/blog/SocialShare";
import RelatedPosts from "@/components/blog/RelatedPosts";
import { Card } from "@/components/ui/card";

const BlogDetails = () => {
  const { slug } = useParams();
  const post = mockBlogPosts.find(p => p.slug === slug);

  if (!post) {
    return <NotFound />;
  }

  return (
    <div className="bg-muted/20">
      <div className="container py-12">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <article className="lg:col-span-2">
            <header className="mb-8">
              <Badge variant="secondary" className="mb-4">{post.category}</Badge>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">{post.title}</h1>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
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
            
            <Card className="overflow-hidden mb-8 shadow-lg">
              <img src={post.featured_image_url} alt={post.title} className="object-cover w-full h-auto aspect-video" />
            </Card>

            <div 
              className="prose dark:prose-invert max-w-none prose-lg prose-p:text-foreground/80 prose-li:text-foreground/80 prose-headings:text-foreground prose-strong:text-foreground"
              dangerouslySetInnerHTML={{ __html: post.content || post.excerpt }}
            />
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              <AuthorBio author={post.author} />
              <SocialShare title={post.title} slug={post.slug} />
              <RelatedPosts currentPostId={post.id} category={post.category} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;