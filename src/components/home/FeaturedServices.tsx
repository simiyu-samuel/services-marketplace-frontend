import { mockServices } from "@/data/mock";
import ServiceCard from "@/components/services/ServiceCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const FeaturedServices = () => {
  const featured = mockServices.slice(0, 3);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Featured Services</h2>
          <p className="max-w-2xl mx-auto text-muted-foreground mt-2">
            Check out some of the top-rated services our platform has to offer.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <Link to="/services" className="gap-2">
              View All Services <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;