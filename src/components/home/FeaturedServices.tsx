import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { PaginatedResponse, Service } from "@/types";
import ServiceCard from "@/components/services/ServiceCard";
import ServiceCardSkeleton from "@/components/services/ServiceCardSkeleton";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const fetchFeaturedServices = async () => {
  const { data } = await api.get('/services', { params: { per_page: 3 } });
  return (data as PaginatedResponse<Service>).data;
};

const FeaturedServices = () => {
  const { data: featured, isLoading } = useQuery<Service[]>({
    queryKey: ['featured-services'],
    queryFn: fetchFeaturedServices,
  });

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
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => <ServiceCardSkeleton key={index} />)
          ) : (
            featured?.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))
          )}
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