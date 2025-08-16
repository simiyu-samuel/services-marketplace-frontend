import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BlogPost } from "@/types";

interface AuthorBioProps {
  author: BlogPost['author'];
}

const AuthorBio = ({ author }: AuthorBioProps) => {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <Avatar className="h-20 w-20 mx-auto mb-4">
          <AvatarImage src={author.profile_image || undefined} />
          <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h3 className="font-bold text-lg">About {author.name}</h3>
        <p className="text-sm text-muted-foreground mt-2">
          {author.bio || "The author has not provided a bio yet."}
        </p>
      </CardContent>
    </Card>
  );
};

export default AuthorBio;