import { BlogPost } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

const BlogCard = ({ post, featured = false }: BlogCardProps) => {
  if (featured) {
    return (
      <Card className="grid md:grid-cols-2 overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl group border-transparent hover:border-primary">
        <div className="overflow-hidden">
          <Link to={`/blog/${post.slug}`} className="block h-full">
            <img 
              src={post.featured_image_url} 
              alt={post.title} 
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" 
            />
          </Link>
        </div>
        <div className="flex flex-col p-6">
          <CardHeader className="p-0">
            <Badge variant="secondary" className="w-fit mb-4">{post.category}</Badge>
            <CardTitle className="text-3xl leading-tight">
              <Link to={`/blog/${post.slug}`} className="group-hover:text-primary transition-colors">
                {post.title}
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow p-0 mt-4">
            <p className="text-muted-foreground text-base line-clamp-4">{post.excerpt}</p>
          </CardContent>
          <CardFooter className="flex justify-between items-center text-sm text-muted-foreground p-0 mt-6 pt-6 border-t">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.author.profile_image || undefined} />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">{post.author.name}</p>
                <p className="text-xs">{new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
            </div>
            <Link to={`/blog/${post.slug}`} className="flex items-center gap-1 text-primary font-semibold">
              Read More <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </CardFooter>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 group border-transparent hover:border-primary bg-muted/40">
      <div className="overflow-hidden">
        <Link to={`/blog/${post.slug}`} className="block">
          <img 
            src={post.featured_image_url} 
            alt={post.title} 
            className="object-cover w-full h-48 transition-transform duration-500 group-hover:scale-110" 
          />
        </Link>
      </div>
      <div className="flex flex-col flex-grow p-5">
        <CardHeader className="p-0">
          <Badge variant="secondary" className="w-fit mb-2">{post.category}</Badge>
          <CardTitle className="text-xl leading-tight">
            <Link to={`/blog/${post.slug}`} className="group-hover:text-primary transition-colors">
              {post.title}
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow p-0 mt-3">
          <p className="text-muted-foreground text-sm line-clamp-3">{post.excerpt}</p>
        </CardContent>
        <CardFooter className="flex justify-between items-center text-sm text-muted-foreground p-0 mt-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.author.profile_image || undefined} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-foreground">{post.author.name}</span>
              <span className="text-xs">{new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
          <Link to={`/blog/${post.slug}`} className="flex items-center gap-1 text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
            Read <ArrowRight className="h-4 w-4" />
          </Link>
        </CardFooter>
      </div>
    </Card>
  );
};

export default BlogCard;
