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
  // Use admin or author, whichever is available
  const author = post.admin || post.author;
  const imageUrl = post.featured_image_url || post.featured_image;
  
  if (featured) {
    return (
      <Card className="grid sm:grid-cols-1 md:grid-cols-2 overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl group border-transparent hover:border-primary">
        <div className="overflow-hidden">
          <Link to={`/blog/${post.slug}`} className="block h-full">
            <img 
              src={imageUrl} 
              alt={post.title} 
              className="object-cover w-full h-32 sm:h-48 md:h-full transition-transform duration-500 group-hover:scale-110" 
            />
          </Link>
        </div>
        <div className="flex flex-col p-3 sm:p-6">
          <CardHeader className="p-0">
            {post.category && <Badge variant="secondary" className="w-fit mb-2 sm:mb-4 text-xs sm:text-sm">{post.category}</Badge>}
            <CardTitle className="text-lg sm:text-3xl leading-tight">
              <Link to={`/blog/${post.slug}`} className="group-hover:text-primary transition-colors">
                {post.title}
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow p-0 mt-2 sm:mt-4">
            <p className="text-muted-foreground text-sm sm:text-base line-clamp-3 sm:line-clamp-4">{post.excerpt}</p>
          </CardContent>
          <CardFooter className="flex justify-between items-center text-xs sm:text-sm text-muted-foreground p-0 mt-3 sm:mt-6 pt-3 sm:pt-6 border-t">
            <div className="flex items-center gap-2 sm:gap-3">
              <Avatar className="h-6 sm:h-10 w-6 sm:w-10">
                <AvatarImage src={author?.profile_image || undefined} />
                <AvatarFallback className="text-xs sm:text-sm">{author?.name?.charAt(0) || 'A'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground text-xs sm:text-sm">{author?.name || 'Admin'}</p>
                <p className="text-xs">{new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
            </div>
            <Link to={`/blog/${post.slug}`} className="flex items-center gap-1 text-primary font-semibold text-xs sm:text-sm">
              <span className="hidden sm:inline">Read More</span>
              <span className="sm:hidden">Read</span>
              <ArrowRight className="h-3 sm:h-4 w-3 sm:w-4 transition-transform duration-300 group-hover:translate-x-1" />
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
            src={imageUrl} 
            alt={post.title} 
            className="object-cover w-full h-32 sm:h-48 transition-transform duration-500 group-hover:scale-110" 
          />
        </Link>
      </div>
      <div className="flex flex-col flex-grow p-3 sm:p-5">
        <CardHeader className="p-0">
          {post.category && <Badge variant="secondary" className="w-fit mb-1 sm:mb-2 text-xs sm:text-sm">{post.category}</Badge>}
          <CardTitle className="text-sm sm:text-xl leading-tight">
            <Link to={`/blog/${post.slug}`} className="group-hover:text-primary transition-colors">
              {post.title}
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow p-0 mt-2 sm:mt-3">
          <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2 sm:line-clamp-3">{post.excerpt}</p>
        </CardContent>
        <CardFooter className="flex justify-between items-center text-xs sm:text-sm text-muted-foreground p-0 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
          <div className="flex items-center gap-1 sm:gap-2">
            <Avatar className="h-5 sm:h-8 w-5 sm:w-8">
              <AvatarImage src={author?.profile_image || undefined} />
              <AvatarFallback className="text-xs">{author?.name?.charAt(0) || 'A'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-foreground text-xs sm:text-sm">{author?.name || 'Admin'}</span>
              <span className="text-xs">{new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
          <Link to={`/blog/${post.slug}`} className="flex items-center gap-1 text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity text-xs sm:text-sm">
            Read <ArrowRight className="h-3 sm:h-4 w-3 sm:w-4" />
          </Link>
        </CardFooter>
      </div>
    </Card>
  );
};

export default BlogCard;
