import { useState, useEffect } from "react";
import ServiceCard from "@/components/services/ServiceCard";
import ServiceFilters from "@/components/services/ServiceFilters";
import { mockServices } from "@/data/mock";
import { Service } from "@/types";

export interface Filters {
  search: string;
  categories: string[];
  maxPrice: number;
  isMobile: boolean;
  sortBy: string;
}

const Services = () => {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    categories: [],
    maxPrice: 20000,
    isMobile: false,
    sortBy: 'recommended',
  });
  const [filteredServices, setFilteredServices] = useState<Service[]>(mockServices);

  const handleFilterChange = (key: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
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
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredServices.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold">No Services Found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your filters to find what you're looking for.</p>
            </div>
          )}
          {/* Pagination will go here */}
        </main>
      </div>
    </div>
  );
};

export default Services;