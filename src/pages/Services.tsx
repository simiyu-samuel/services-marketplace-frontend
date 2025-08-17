import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import api from "@/lib/api";
import ServiceCard from "@/components/services/ServiceCard";
import ServiceCardSkeleton from "@/components/services/ServiceCardSkeleton";
import { PaginatedResponse, Service } from "@/types";
import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";
import AnimatedWrapper from "@/components/ui/AnimatedWrapper";
import Masonry from 'react-masonry-css';

const fetchServices = async () => {
  const { data } = await api.get('/services', { params: { per_page: 9 } });
  return (data as PaginatedResponse<Service>).data;
};

const Services = () => {
  const [searchParams] = useSearchParams();
  const {
    data: services,
    error,
    status,
  } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: fetchServices,
  });

  useEffect(() => {
    // You can access the category from the URL like this:
    const categoryFromUrl = searchParams.get('category');
    console.log("Category from URL:", categoryFromUrl);
    // You can use this category to filter the services if needed
  }, [searchParams]);

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container pt-32 pb-16">
        <div className="text-center mb-12">
          <AnimatedWrapper>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
              Find Your Perfect Service
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
              Explore a universe of services tailored for you.
            </p>
          </AnimatedWrapper>
        </div>

        <main>
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {status === 'pending' ? (
              Array.from({ length: 9 }).map((_, index) => <ServiceCardSkeleton key={index} />)
            ) : status === 'error' ? (
              <div className="col-span-full text-center py-16 text-destructive">
                <p>Error: {error.message}</p>
              </div>
            ) : services?.length > 0 ? (
              services.map((service, index) => (
                <AnimatedWrapper key={`${service.id}-${index}`} delay={index * 0.05}>
                  <ServiceCard service={service} />
                </AnimatedWrapper>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center text-center py-16 bg-muted rounded-lg">
                <SearchX className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-2xl font-semibold">No Services Found</h3>
                <p className="text-muted-foreground mt-2">Try adjusting your filters.</p>
              </div>
            )}
          </Masonry>
        </main>
      </div>
    </div>
  );
};

export default Services;
