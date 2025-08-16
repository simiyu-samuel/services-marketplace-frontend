import { Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ReviewSummaryProps {
  rating: number;
  reviewCount: number;
}

const ReviewSummary = ({ rating, reviewCount }: ReviewSummaryProps) => {
  // Mock distribution for visual purposes as the API doesn't provide this
  const distribution = [75, 15, 5, 3, 2];

  return (
    <div className="flex flex-col sm:flex-row gap-8 items-center p-4 border rounded-lg">
      <div className="text-center">
        <p className="text-5xl font-bold">{rating.toFixed(1)}</p>
        <div className="flex justify-center mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-5 w-5 ${i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
          ))}
        </div>
        <p className="text-muted-foreground mt-2">{reviewCount} reviews</p>
      </div>
      <div className="w-full flex-1">
        <div className="space-y-2">
          {distribution.map((percent, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">{5 - index} star</span>
              <Progress value={percent} className="w-full h-2" />
              <span className="text-sm text-muted-foreground">{percent}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewSummary;