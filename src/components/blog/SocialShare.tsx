import { Twitter, Facebook, Linkedin, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showSuccess } from "@/utils/toast";

interface SocialShareProps {
  title: string;
  slug: string;
}

const SocialShare = ({ title, slug }: SocialShareProps) => {
  const url = `${window.location.origin}/blog/${slug}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    showSuccess("Link copied to clipboard!");
  };

  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Share this article</h3>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <a href={`https://twitter.com/intent/tweet?url=${url}&text=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer">
            <Twitter className="h-4 w-4" />
          </a>
        </Button>
        <Button variant="outline" size="icon" asChild>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${url}`} target="_blank" rel="noopener noreferrer">
            <Facebook className="h-4 w-4" />
          </a>
        </Button>
        <Button variant="outline" size="icon" asChild>
          <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer">
            <Linkedin className="h-4 w-4" />
          </a>
        </Button>
        <Button variant="outline" size="icon" onClick={copyToClipboard}>
          <LinkIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SocialShare;