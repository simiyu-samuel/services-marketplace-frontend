import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Calendar, Smile, Gem, HeartPulse, Paintbrush, Scissors, Sparkles } from "lucide-react";
import FeaturedServices from "@/components/home/FeaturedServices";
import RecentBlogPosts from "@/components/home/RecentBlogPosts";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import AnimatedWrapper from "@/components/ui/AnimatedWrapper";

const categories = [
  { name: "Nails", icon: Gem, href: "/services" },
  { name: "Wellness", icon: HeartPulse, href: "/services" },
  { name: "Makeup", icon: Paintbrush, href: "/services" },
  { name: "Hair", icon: Scissors, href: "/services" },
  { name: "Skincare", icon: Sparkles, href: "/services" },
];

const steps = [
  {
    icon: Search,
    title: "Discover Services",
    description: "Browse through hundreds of services from top-rated professionals near you.",
  },
  {
    icon: Calendar,
    title: "Book & Connect",
    description: "Choose a time that works for you and connect directly with the seller via WhatsApp.",
  },
  {
    icon: Smile,
    title: "Enjoy & Relax",
    description: "Sit back and enjoy your premium service experience. It's that simple!",
  },
];

const Home = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-background overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10 text-center py-24 md:py-40">
          <AnimatedWrapper>
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
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/services" className="gap-2">
                  Explore Services <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/register/seller">
                  Become a Seller
                </Link>
              </Button>
            </div>
          </AnimatedWrapper>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <AnimatedWrapper>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Explore by Category</h2>
              <p className="max-w-2xl mx-auto text-muted-foreground mt-2">
                Find the perfect service by browsing our most popular categories.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {categories.map((category, index) => (
                <AnimatedWrapper key={category.name} delay={index * 0.1}>
                  <Link to={category.href}>
                    <Card className="text-center p-6 transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-2 hover:border-primary bg-background/50">
                      <CardContent className="p-0 flex flex-col items-center justify-center gap-4">
                        <div className="bg-primary/10 text-primary p-4 rounded-full">
                          <category.icon className="h-8 w-8" />
                        </div>
                        <span className="font-semibold text-lg">{category.name}</span>
                      </CardContent>
                    </Card>
                  </Link>
                </AnimatedWrapper>
              ))}
            </div>
          </AnimatedWrapper>
        </div>
      </section>

      {/* Featured Services */}
      <AnimatedWrapper>
        <FeaturedServices />
      </AnimatedWrapper>

      {/* How It Works */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <AnimatedWrapper>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
              <p className="max-w-2xl mx-auto text-muted-foreground mt-2">
                Getting your next beauty or wellness treatment is as easy as 1, 2, 3.
              </p>
            </div>
            <div className="relative grid md:grid-cols-3 gap-8 text-center">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 hidden md:block"></div>
              {steps.map((step, index) => (
                <AnimatedWrapper key={index} delay={index * 0.2} className="relative z-10">
                  <div className="flex flex-col items-center p-6 bg-background rounded-lg shadow-sm">
                    <div className="bg-primary/10 text-primary p-4 rounded-full mb-4 ring-8 ring-background">
                      <step.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </AnimatedWrapper>
              ))}
            </div>
          </AnimatedWrapper>
        </div>
      </section>

      {/* Recent Blog Posts */}
      <AnimatedWrapper>
        <RecentBlogPosts />
      </AnimatedWrapper>
    </div>
  );
};

export default Home;