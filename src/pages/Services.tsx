import React, { useState, useEffect, lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import api from "@/lib/api";
import LoadingSpinner from "@/components/ui/LoadingSpinner"; // Assuming LoadingSpinner is available
import { PaginatedResponse, Service } from "@/types";
import { Button } from "@/components/ui/button";
import { SearchX, SlidersHorizontal, Grid, List } from "lucide-react";
import AnimatedWrapper from "@/components/ui/AnimatedWrapper";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Dynamically import components
const ServiceCard = lazy(() => import("@/components/services/ServiceCard"));
const ServiceCardSkeleton = lazy(() => import("@/components/services/ServiceCardSkeleton"));
const Masonry = lazy(() => import('react-masonry-css')); // Corrected import path
const EnhancedServiceFilters = lazy(() => import("@/components/services/EnhancedServiceFilters"));
const ServiceListView = lazy(() => import("@/components/services/ServiceListView"));

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

export type ServicesProps = Record<string, never>;
const fetchServices = async () => {
  const { data } = await api.get('/services');
  return (data as PaginatedResponse<Service>).data;
};

const Services = () => {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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
  const {
    data: services,
    error,
    status,
  } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: fetchServices,
  });

  const filteredServices = React.useMemo(() => {
    if (!services) return [];

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

    return tempServices;
  }, [services, filters]);

  useEffect(() => {
    const locationFromUrl = searchParams.get('location');
    const categoryFromUrl = searchParams.get('category');
    const subcategoryFromUrl = searchParams.get('subcategory'); // Get subcategory from URL

    setFilters(prevFilters => {
      const newFilters = { ...prevFilters };
      
      if (locationFromUrl && newFilters.location !== locationFromUrl) {
        newFilters.location = locationFromUrl;
      }
      
      // Reset categories and subcategories if a new category/subcategory is selected from the header
      let updatedCategories = newFilters.categories;
      let updatedSubcategories = newFilters.subcategories;

      if (categoryFromUrl && !newFilters.categories.includes(categoryFromUrl)) {
        updatedCategories = [categoryFromUrl]; // Replace existing categories if a new one is selected
      } else if (!categoryFromUrl) {
        updatedCategories = []; // Clear categories if no category is in URL
      }

      if (subcategoryFromUrl && !newFilters.subcategories.includes(subcategoryFromUrl)) {
        updatedSubcategories = [subcategoryFromUrl]; // Replace existing subcategories if a new one is selected
      } else if (!subcategoryFromUrl) {
        updatedSubcategories = []; // Clear subcategories if no subcategory is in URL
      }

      newFilters.categories = updatedCategories;
      newFilters.subcategories = updatedSubcategories;

      return newFilters;
    });
  }, [searchParams]);

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container pt-8 pb-16">
        <div className="text-center mb-8">
          <AnimatedWrapper>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
              Find Your Perfect Service
            </h1>
          </AnimatedWrapper>
        </div>

<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {!isMobile ? (
                <Suspense fallback={<LoadingSpinner size="sm" />}>
                  <EnhancedServiceFilters 
                    filters={filters} 
                    setFilters={setFilters} 
                    categories={categories} 
                  />
                </Suspense>
              ) : null}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Mobile Filters & View Toggle */}
            <div className="flex justify-between items-center mb-6">
              {isMobile && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <SlidersHorizontal className="h-4 w-4" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-full sm:w-[400px] overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Filter Services</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <Suspense fallback={<LoadingSpinner size="sm" />}>
                        <EnhancedServiceFilters 
                          filters={filters} 
                          setFilters={setFilters} 
                          categories={categories} 
                        />
                      </Suspense>
                    </div>
                  </SheetContent>
                </Sheet>
              )}
              
              <div className="flex items-center gap-2 ml-auto">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                {status === 'pending' ? 'Loading...' : `${filteredServices.length} services found`}
              </p>
            </div>

            <main>
              {viewMode === 'grid' ? (
                <Suspense fallback={
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.from({ length: 9 }).map((_, index) => <ServiceCardSkeleton key={index} />)}
                  </div>
                }>
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
                </Suspense>
              ) : (
                <div className="space-y-4">
                  {status === 'pending' ? (
                    Array.from({ length: 6 }).map((_, index) => <ServiceCardSkeleton key={index} />)
                  ) : status === 'error' ? (
                    <div className="text-center py-16 text-destructive">
                      <p>Error: {error.message}</p>
                    </div>
                  ) : filteredServices.length > 0 ? (
                    filteredServices.map((service, index) => (
                      <AnimatedWrapper key={`${service.id}-${index}`} delay={index * 0.05}> {/* Added AnimatedWrapper */}
                        <ServiceListView key={`${service.id}-${index}`} service={service} index={index} />
                      </AnimatedWrapper>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center py-16 bg-muted rounded-lg">
                      <SearchX className="h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="text-2xl font-semibold">No Services Found</h3>
                      <p className="text-muted-foreground mt-2">Try adjusting your filters.</p>
                    </div>
                  )}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
