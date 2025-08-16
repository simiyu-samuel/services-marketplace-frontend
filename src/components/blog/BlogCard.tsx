import { BlogPost } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 group border-transparent hover:border-primary">
      <div className="overflow-hidden">
        <Link to={`/blog/${post.slug}`} className="block">
          <img 
            src={post.featured_image_url} 
            alt={post.title} 
            className="object-cover w-full h-48 transition-transform duration-500 group-hover:scale-110" 
          />
        </Link>
      </div>
      <CardHeader>
        <Badge variant="secondary" className="w-fit mb-2">{post.category}</Badge>
        <CardTitle className="text-xl leading-tight">
          <Link to={`/blog/${post.slug}`} className="group-hover:text-primary transition-colors">
            {post.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground text-sm line-clamp-3">{post.excerpt}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center text-sm text-muted-foreground border-t pt-4">
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
    </Card>
  );
};

export default BlogCard;