import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Calendar, Smile, Sparkles, Scissors, Shirt } from "lucide-react";
import FeaturedServices from "@/components/home/FeaturedServices";
import RecentBlogPosts from "@/components/home/RecentBlogPosts";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import AnimatedWrapper from "@/components/ui/AnimatedWrapper";

const serviceCategories = [
  {
    title: "Beauty Services",
    icon: Sparkles,
    items: ["Makeup", "Nails", "Eyebrows & Lashes", "Microblading", "Heena", "Tattoo & Piercings", "Waxing", "ASMR & Massage", "Beauty Hub"],
  },
  {
    title: "Hair Services",
    icon: Scissors,
    items: ["Braiding", "Weaving", "Locs", "Wig Makeovers", "Ladies Haircut", "Complete Hair Care"],
  },
  {
    title: "Fashion Services",
    icon: Shirt,
    items: ["African Wear", "Maasai Wear", "Crotchet/Wear"],
  },
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
          <div className="relative h-64 lg:h-full min-h-[400px] flex items-center justify-center">
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-primary/20 rounded-full filter blur-2xl opacity-70 animate-blob"></div>
            <div className="absolute top-20 -left-4 w-72 h-72 bg-secondary/20 rounded-full filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 right-20 w-72 h-72 bg-primary/10 rounded-full filter blur-2xl opacity-70 animate-blob animation-delay-4000"></div>
            <div className="relative w-[350px] h-[450px] lg:w-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl transform rotate-3 transition-transform duration-500 hover:rotate-0 hover:scale-105">
                <img 
                    src="https://images.pexels.com/photos/3762875/pexels-photo-3762875.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Woman receiving beauty treatment" 
                    className="w-full h-full object-cover"
                />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {serviceCategories.map((category, index) => (
                  <AnimatedWrapper key={category.title} delay={index * 0.1}>
                      <Card className="p-6 transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-2 hover:border-primary bg-muted/50 h-full">
                          <CardContent className="p-0 flex flex-col items-start">
                              <div className="flex items-center gap-4 mb-4">
                                  <div className="bg-background p-3 rounded-full">
                                      <category.icon className="h-8 w-8 text-primary" />
                                  </div>
                                  <h3 className="font-bold text-xl">{category.title}</h3>
                              </div>
                              <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                                  {category.items.map(item => (
                                      <li key={item}>{item}</li>
                                  ))}
                              </ul>
                          </CardContent>
                      </Card>
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