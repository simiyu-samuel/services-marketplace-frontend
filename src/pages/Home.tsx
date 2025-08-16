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
      <section className="relative w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background" />
        <div className="container grid lg:grid-cols-2 gap-12 items-center py-20 md:py-32">
          <div className="z-10">
            <AnimatedWrapper>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
                <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                  Discover & Book
                </span>
                <br />
                Premium Lifestyle Services
              </h1>
              <p className="max-w-xl text-lg md:text-xl text-muted-foreground mb-8">
                Themabinti is your modern, inclusive hub for the best beauty, health, and lifestyle services across Kenya.
              </p>
              <div className="flex flex-col sm:flex-row justify-start gap-4">
                <Button size="lg" asChild className="group">
                  <Link to="/services" className="gap-2">
                    Explore Services <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
          <div className="relative h-64 lg:h-full min-h-[300px]">
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-primary/20 rounded-full filter blur-2xl opacity-70 animate-blob"></div>
            <div className="absolute top-20 -left-4 w-72 h-72 bg-secondary/20 rounded-full filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 right-20 w-72 h-72 bg-primary/10 rounded-full filter blur-2xl opacity-70 animate-blob animation-delay-4000"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Card className="w-64 h-80 rotate-6 transform transition-transform duration-500 hover:rotate-0 hover:scale-105 bg-background/50 backdrop-blur-md shadow-2xl">
                <CardContent className="p-4 flex flex-col items-start justify-between h-full">
                  <img src="/placeholder.svg" alt="Beauty Services" className="w-full h-40 object-cover rounded-md opacity-70" />
                  <div className="w-full">
                    <div className="h-4 bg-muted rounded-full w-3/4 mt-4"></div>
                    <div className="h-3 bg-muted rounded-full w-1/2 mt-2"></div>
                    <div className="h-8 bg-primary/20 rounded-md w-full mt-4"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-background">
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
                    <Card className="text-center p-6 transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-2 hover:border-primary bg-muted/50 group">
                      <CardContent className="p-0 flex flex-col items-center justify-center gap-4">
                        <div className="bg-background p-4 rounded-full transition-colors duration-300 group-hover:bg-gradient-to-br group-hover:from-primary/20 group-hover:to-secondary/20">
                          <category.icon className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />
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
      <section className="py-16 bg-muted/40">
        <div className="container mx-auto px-4">
          <AnimatedWrapper>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
              <p className="max-w-2xl mx-auto text-muted-foreground mt-2">
                Getting your next beauty or wellness treatment is as easy as 1, 2, 3.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {steps.map((step, index) => (
                <AnimatedWrapper key={index} delay={index * 0.2}>
                  <Card className="p-6 bg-background border-2 border-transparent hover:border-primary/50 transition-colors duration-300 h-full group">
                    <div className="flex flex-col items-center">
                      <div className="bg-primary/10 text-primary p-4 rounded-full mb-4 ring-8 ring-background transition-transform duration-300 group-hover:scale-110">
                        <step.icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </Card>
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