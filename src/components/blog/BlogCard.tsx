import { BlogPost } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Clock } from "lucide-react";

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg group">
      <div className="aspect-w-16 aspect-h-9">
        <img src={post.featured_image_url} alt={post.title} className="object-cover w-full h-full" />
      </div>
      <CardHeader>
        <Badge variant="secondary" className="w-fit mb-2">{post.category}</Badge>
        <CardTitle className="text-xl">
          <Link to={`/blog/${post.slug}`} className="group-hover:text-primary transition-colors">
            {post.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground text-sm">{post.excerpt}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center text-sm text-muted-foreground border-t pt-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={post.author.profile_image_url} />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span>{post.author.name}</span>
        </div>
        <Link to={`/blog/${post.slug}`} className="flex items-center gap-1 text-primary font-semibold">
          Read More <ArrowRight className="h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;