import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, MapPin, Tag, X, ChevronDown } from 'lucide-react';
import { Filters } from '@/pages/Services';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ServiceFiltersProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  categories: string[];
}

const subcategories = {
  "Beauty Services": ["Makeup", "Nails", "Eyebrows & Lashes", "Microblading", "Heena", "Tattoo & Piercings", "Waxing", "ASMR & Massage", "Beauty Hub"],
  "Hair Services": ["Braiding", "Weaving", "Locs", "Wig Makeovers", "Ladies Haircut", "Complete Hair Care"],
  "Fashion Services": ["African Wear", "Maasai Wear", "Crotchet/Weaving", "Personal Stylist", "Made in Kenya"],
  "Photography": ["Event", "Lifestyle", "Portrait"],
  "Bridal Services": ["Bridal Makeup", "Bridal Hair", "Bridesmaids for Hire", "Gowns for Hire", "Wedding Cakes"],
  "Health Services": ["Dental", "Skin Consultation", "Reproductive Care", "Maternal Care", "Mental Care"],
  "Celebrate Her": ["Florist", "Decor", "Journey to Motherhood"],
  "Fitness Services": ["Gym", "Personal Trainers", "Nutritionist"],
  "Home & Lifestyles": ["Cleaning Services", "Laundry Services", "Home & Home Decor"],
};

const ServiceFilters: React.FC<ServiceFiltersProps> = ({ filters, setFilters, categories }) => {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleCollapsibleChange = (category: string, isOpen: boolean) => {
    setOpenCategories(prev => ({ ...prev, [category]: isOpen }));
  };

  const handleCategoryChange = (category: string) => {
    setFilters(prev => {
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories: newCategories };
    });
  };

  const handleSubcategoryChange = (subcategory: string) => {
    setFilters(prev => {
      const newSubcategories = prev.subcategories.includes(subcategory)
        ? prev.subcategories.filter(s => s !== subcategory)
        : [...prev.subcategories, subcategory];
      return { ...prev, subcategories: newSubcategories };
    });
  };

  const handlePriceChange = (value: number[]) => {
    setFilters(prev => ({ ...prev, priceRange: [value[0], value[1]] }));
  };

  const handleSortChange = (value: string) => {
    setFilters(prev => ({ ...prev, sortBy: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      categories: [],
      subcategories: [],
      priceRange: [0, 20000],
      isMobile: false,
      sortBy: 'recommended',
    });
  };

  return (
    
      <Accordion type="multiple" className="w-full">
        {/* Search & Location */}
        <AccordionItem value="search-location">
          <AccordionTrigger className="flex items-center justify-between p-3 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-secondary data-[state=closed]:bg-muted">
            Search & Location
            <Search className="ml-auto h-4 w-4" />
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-1 gap-4 pt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                name="search"
                placeholder="Search services..."
                value={filters.search}
                onChange={handleInputChange}
                className="pl-10 h-12 text-base bg-background"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                name="location"
                placeholder="Location"
                value={filters.location}
                onChange={handleInputChange}
                className="pl-10 h-12 text-base bg-background"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Sort By */}
        <AccordionItem value="sort-by">
          <AccordionTrigger className="flex items-center justify-between p-3 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-secondary data-[state=closed]:bg-muted">
            Sort By
            <Tag className="ml-auto h-4 w-4" />
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <Select value={filters.sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="h-12 text-base bg-background">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        {/* Categories */}
<AccordionItem value="categories">
          <AccordionTrigger className="flex items-center justify-between p-3 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-secondary data-[state=closed]:bg-muted">
            Categories
            <Tag className="ml-auto h-4 w-4" />
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <ScrollArea className="h-[200px] pr-4">
              {Object.keys(subcategories).map(category => (
                <div key={category} className="mb-4">
                  <h3 className="text-sm font-medium mb-2">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {subcategories[category as keyof typeof subcategories]?.map(subcategory => (
                      <Button
                        key={subcategory}
                        variant={filters.subcategories.includes(subcategory) ? 'secondary' : 'outline'}
                        size="sm"
                        onClick={() => handleSubcategoryChange(subcategory)}
                        className="rounded-full text-xs"
                      >
                        {subcategory}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range Slider */}
        <AccordionItem value="price-range">
          <AccordionTrigger className="flex items-center justify-between p-3 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-secondary data-[state=closed]:bg-muted">
            Price Range
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Ksh {filters.priceRange[0]}</span>
              <Slider
                min={0}
                max={20000}
                step={500}
                value={filters.priceRange}
                onValueChange={handlePriceChange}
              />
              <span className="text-sm font-medium">Ksh {filters.priceRange[1]}</span>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Mobile Service Checkbox */}
        <AccordionItem value="mobile-service">
          <AccordionTrigger className="flex items-center justify-between p-3 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-secondary data-[state=closed]:bg-muted">
            Mobile Service
          </AccordionTrigger>
          <AccordionContent className="pt-4 flex items-center space-x-2">
            <Checkbox 
              id="isMobile" 
              checked={filters.isMobile}
              onCheckedChange={(checked) => setFilters(prev => ({ ...prev, isMobile: !!checked }))}
            />
            <label
              htmlFor="isMobile"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Mobile Service (Provider comes to you)
            </label>
          </AccordionContent>
        </AccordionItem>

        {/* Clear Filters Button */}
<div className="mt-6">
          <Button variant="secondary" onClick={clearFilters} className="w-full h-12 text-base group">
            <X className="mr-2 h-5 w-5  transition-colors" />
            Clear Filters
          </Button>
        </div>
      </Accordion>
    
  );
};

export default ServiceFilters;
