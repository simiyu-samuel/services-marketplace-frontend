import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import FeaturedServices from "@/components/home/FeaturedServices";
import HowItWorks from "@/components/home/HowItWorks";
import RecentBlogPosts from "@/components/home/RecentBlogPosts";

const Home = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-white dark:bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-pink-100 to-white dark:from-purple-900/20 dark:via-pink-900/20 dark:to-gray-900"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
              Discover & Book
            </span>
            <br />
            Premium Lifestyle Services
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
            Themabinti is your modern, inclusive hub for the best beauty, health, and lifestyle services across Kenya.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="gap-2">
              Explore Services <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Become a Seller
            </Button>
          </div>
        </div>
      </section>

      {/* New Sections */}
      <FeaturedCategories />
      <FeaturedServices />
      <HowItWorks />
      <RecentBlogPosts />
    </div>
  );
};

export default Home;