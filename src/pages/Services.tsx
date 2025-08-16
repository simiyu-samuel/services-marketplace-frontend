import { useState, useEffect } from "react";
import ServiceCard from "@/components/services/ServiceCard";
import ServiceFilters from "@/components/services/ServiceFilters";
import ServiceCardSkeleton from "@/components/services/ServiceCardSkeleton";
import { mockServices } from "@/data/mock";
import { Service } from "@/types";
import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";

export interface Filters {
  search: string;
  categories: string[];
  maxPrice: number;
  isMobile: boolean;
  sortBy: string;
}

const initialFilters: Filters = {
  search: '',
  categories: [],
  maxPrice: 20000,
  isMobile: false,
  sortBy: 'recommended',
};

const Services = () => {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleFilterChange = (key: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
  };

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      let services = [...mockServices];

      // Apply search filter
      if (filters.search) {
        services = services.filter(s => 
          s.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          s.description.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      // Apply category filter
      if (filters.categories.length > 0) {
        services = services.filter(s => filters.categories.includes(s.category));
      }

      // Apply price filter
      services = services.filter(s => s.price <= filters.maxPrice);

      // Apply mobile service filter
      if (filters.isMobile) {
        services = services.filter(s => s.is_mobile);
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'rating':
          services.sort((a, b) => b.rating - a.rating);
          break;
        case 'price-asc':
          services.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          services.sort((a, b) => b.price - a.price);
          break;
        default: // recommended (default order)
          break;
      }

      setFilteredServices(services);
      setIsLoading(false);
    }, 300); // Simulate network delay for a better UX

    return () => clearTimeout(timer);
  }, [filters]);

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
            ) : filteredServices.length > 0 ? (
              filteredServices.map(service => (
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