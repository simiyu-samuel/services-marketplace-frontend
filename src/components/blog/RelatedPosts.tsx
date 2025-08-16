import { Link } from "react-router-dom";
import { mockBlogPosts } from "@/data/mock";
import { ArrowRight } from "lucide-react";

interface RelatedPostsProps {
  currentPostId: number;
  category: string;
}

const RelatedPosts = ({ currentPostId, category }: RelatedPostsProps) => {
  const relatedPosts = mockBlogPosts
    .filter(post => post.category === category && post.id !== currentPostId)
    .slice(0, 3);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg border-b pb-2">Related Articles</h3>
      <ul className="space-y-3">
        {relatedPosts.map(post => (
          <li key={post.id}>
            <Link to={`/blog/${post.slug}`} className="group flex items-start gap-2 text-primary hover:underline">
               <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0 transition-transform group-hover:translate-x-1" />
              <span>{post.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RelatedPosts;