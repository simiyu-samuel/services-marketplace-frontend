import { Card, CardContent } from "@/components/ui/card";
import { Gem, HeartPulse, Paintbrush, Scissors, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  { name: "Nails", icon: Gem, href: "/services" },
  { name: "Wellness", icon: HeartPulse, href: "/services" },
  { name: "Makeup", icon: Paintbrush, href: "/services" },
  { name: "Hair", icon: Scissors, href: "/services" },
  { name: "Skincare", icon: Sparkles, href: "/services" },
];

const FeaturedCategories = () => {
  return (
    <section className="py-16 bg-muted/40 dark:bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Explore by Category</h2>
          <p className="max-w-2xl mx-auto text-muted-foreground mt-2">
            Find the perfect service by browsing our most popular categories.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link to={category.href} key={category.name}>
              <Card className="text-center p-6 transition-all hover:shadow-lg hover:-translate-y-1 hover:border-primary">
                <CardContent className="p-0 flex flex-col items-center justify-center gap-4">
                  <category.icon className="h-10 w-10 text-primary" />
                  <span className="font-semibold text-lg">{category.name}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;