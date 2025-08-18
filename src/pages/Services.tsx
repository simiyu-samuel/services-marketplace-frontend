import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import api from "@/lib/api";
import ServiceCard from "@/components/services/ServiceCard";
import ServiceCardSkeleton from "@/components/services/ServiceCardSkeleton";
import { PaginatedResponse, Service } from "@/types";
import { Button } from "@/components/ui/button";
import { SearchX, SlidersHorizontal } from "lucide-react";
import AnimatedWrapper from "@/components/ui/AnimatedWrapper";
import Masonry from 'react-masonry-css';
import ServiceFilters from "@/components/services/ServiceFilters";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

const categories = [
  "Beauty",
  "Hair",
  "Fashion",
  "Photography",
  "Bridal",
  "Health",
  "Celebrate Her",
  "Fitness",
  "Home & Lifestyles"
];

export interface Filters {
  search: string;
  location: string;
  categories: string[];
  subcategories: string[];
  priceRange: [number, number];
  isMobile: boolean;
  sortBy: string;
}

export type ServicesProps = {};

const fetchServices = async () => {
  const { data } = await api.get('/services');
  return (data as PaginatedResponse<Service>).data;
};

const Services = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<Filters>({
    search: '',
    location: '',
    categories: [],
    subcategories: [],
    priceRange: [0, 20000],
    isMobile: false,
    sortBy: 'recommended',
  });
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const isMobile = useIsMobile();
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const {
    data: services,
    error,
    status,
  } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: fetchServices,
  });

  useEffect(() => {
    if (services) {
      let tempServices = [...services];

      // Filter by search
      if (filters.search) {
        tempServices = tempServices.filter(service =>
          service.title.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      // Filter by location
      if (filters.location) {
        tempServices = tempServices.filter(service =>
          service.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }

      // Filter by category and subcategory (case-insensitive)
      if (filters.categories.length > 0 || filters.subcategories.length > 0) {
        tempServices = tempServices.filter(service => {
          const matchesCategory = filters.categories.some(filterCategory =>
            service.category.toLowerCase() === filterCategory.toLowerCase()
          );
          const matchesSubcategory = filters.subcategories.some(filterSubcategory =>
            service.subcategory.toLowerCase() === filterSubcategory.toLowerCase()
          );
          return matchesCategory || matchesSubcategory;
        });
      }

      // Filter by price range
      if (filters.priceRange) {
        tempServices = tempServices.filter(service =>
          parseInt(service.price) >= filters.priceRange[0] && parseInt(service.price) <= filters.priceRange[1]
        );
      }

      // Filter by mobile service
      if (filters.isMobile) {
        tempServices = tempServices.filter(service => service.is_mobile);
      }

      // Sort
      if (filters.sortBy === 'rating') {
        tempServices.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (filters.sortBy === 'price-asc') {
        tempServices.sort((a, b) => parseInt(a.price) - parseInt(b.price));
      } else if (filters.sortBy === 'price-desc') {
        tempServices.sort((a, b) => parseInt(b.price) - parseInt(a.price));
      }

      setFilteredServices(tempServices);
    }
  }, [services, filters]);

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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <main>
              {isMobile && (
                <div className="mb-6 flex justify-end">
                  <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <SlidersHorizontal className="h-5 w-5" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="w-full sm:w-[400px] overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle>Filter Services</SheetTitle>
                      </SheetHeader>
                      <ServiceFilters filters={filters} setFilters={setFilters} categories={categories} />
                    </SheetContent>
                  </Sheet>
                </div>
              )}
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
                ) : filteredServices.length > 0 ? (
                  filteredServices.map((service, index) => (
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
          {!isMobile && (
            <aside className="lg:col-span-1">
              <ServiceFilters filters={filters} setFilters={setFilters} categories={categories} />
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

export default Services;
