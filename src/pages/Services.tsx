import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import ServiceCard from "@/components/services/ServiceCard";
import ServiceFilters from "@/components/services/ServiceFilters";
import ServiceCardSkeleton from "@/components/services/ServiceCardSkeleton";
import { Service } from "@/types";
import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";

export interface Filters {
  search: string;
  location: string;
  categories: string[];
  priceRange: [number, number];
  isMobile: boolean;
  sortBy: string;
}

const initialFilters: Filters = {
  search: '',
  location: '',
  categories: [],
  priceRange: [0, 20000],
  isMobile: false,
  sortBy: 'recommended',
};

const fetchServices = async (filters: Filters) => {
  const params = {
    search: filters.search || undefined,
    location: filters.location || undefined,
    category: filters.categories.join(',') || undefined,
    min_price: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
    max_price: filters.priceRange[1] < 20000 ? filters.priceRange[1] : undefined,
    is_mobile: filters.isMobile ? 1 : undefined,
  };
  const { data } = await api.get('/services', { params });
  return data.data; // Assuming paginated response
};

const Services = () => {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  
  const { data: services, isLoading, isError } = useQuery<Service[]>({
    queryKey: ['services', filters],
    queryFn: () => fetchServices(filters),
  });

  const handleFilterChange = (key: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
  };

  // Client-side sorting as it's not in the API guide
  const sortedServices = services ? [...services].sort((a, b) => {
    switch (filters.sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      default:
        return 0;
    }
  }) : [];

  return (
    <div className="container py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Find Your Next Experience</h1>
        <p className="max-w-2xl mx-auto text-lg text-muted-foreground mt-2">
          Browse through our curated list of premium beauty, health, and lifestyle services.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <div className="sticky top-20">
            <ServiceFilters filters={filters} onFilterChange={handleFilterChange} />
          </div>
        </aside>
        <main className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => <ServiceCardSkeleton key={index} />)
            ) : isError ? (
              <div className="col-span-full text-center py-16 text-destructive">
                <p>Failed to load services. Please try again later.</p>
              </div>
            ) : sortedServices.length > 0 ? (
              sortedServices.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center text-center py-16 bg-muted rounded-lg">
                <SearchX className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-2xl font-semibold">No Services Found</h3>
                <p className="text-muted-foreground mt-2 mb-4">Try adjusting your filters to find what you're looking for.</p>
                <Button onClick={handleClearFilters}>Clear Filters</Button>
              </div>
            )}
          </div>
          {/* Pagination will go here */}
        </main>
      </div>
    </div>
  );
};

export default Services;