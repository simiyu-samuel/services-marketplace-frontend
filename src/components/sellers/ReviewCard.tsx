import { Review } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface ReviewCardProps {
  review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Avatar className="h-10 w-10 mr-4">
            <AvatarImage src={review.customer.profile_image_url} />
            <AvatarFallback>{review.customer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{review.customer.name}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="flex items-center mb-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={`h-5 w-5 ${index < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`}
            />
          ))}
        </div>
        <p className="text-muted-foreground">{review.comment}</p>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;