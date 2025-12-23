import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { PaginatedResponse, Service } from "@/types";
import ServiceCard from "@/components/services/ServiceCard";
import ServiceCardSkeleton from "@/components/services/ServiceCardSkeleton";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, Variants } from "framer-motion";

const fetchFeaturedServices = async () => {
  const { data } = await api.get('/services', { 
    params: { 
      per_page: 6,
      'filter[is_featured]': true,
      'filter[is_active]': true
    } 
  });
  return (data as PaginatedResponse<Service>).data;
};

const FeaturedServices = () => {
  const { data: featured, isLoading } = useQuery<Service[]>({
    queryKey: ['featured-services'],
    queryFn: fetchFeaturedServices,
  });

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: i * 0.2,
        ease: "easeOut",
      },
    }),
  };

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold tracking-tight">Featured Services</h2>
          <p className="max-w-2xl mx-auto text-muted-foreground mt-4">
            Discover excellence with our handpicked, top-rated services.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => <ServiceCardSkeleton key={index} />)
          ) : featured && featured.length > 0 ? (
            featured?.map((service, index) => (
              <motion.div
                key={service.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                <ServiceCard service={service} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">No featured services available at the moment.</p>
              <Button size="lg" asChild className="mt-4">
                <Link to="/services">Browse All Services</Link>
              </Button>
            </div>
          )}
        </div>
        <div className="text-center mt-16">
          <Button size="lg" asChild className="group">
            <Link to="/services" className="gap-2">
              Explore All Services
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;
