import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description: string; // Renamed from detailText for clarity
  isLoading: boolean;
}

const StatCard = ({ title, value, icon: Icon, description, isLoading }: StatCardProps) => (
  <Card className="bg-muted/40 border-border/40 shadow-lg hover:border-primary transition-colors duration-300 group"> {/* Added group for hover effects */}
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{title}</CardTitle> {/* Added hover effect */}
      <Icon className="h-5 w-5 text-primary/70 group-hover:text-primary transition-colors" /> {/* Changed icon color */}
    </CardHeader>
    <CardContent>
      {isLoading ? <Skeleton className="h-8 w-3/4 mt-1" /> : <div className="text-2xl font-bold">{value}</div>}
      <p className="text-xs text-muted-foreground mt-1">{description}</p> {/* Added margin-top */}
    </CardContent>
  </Card>
);

export default StatCard;
