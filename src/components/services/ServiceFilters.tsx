import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, MapPin, Tag, X } from 'lucide-react';
import { Filters } from '@/pages/Services';

interface ServiceFiltersProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  categories: string[];
}

const ServiceFilters: React.FC<ServiceFiltersProps> = ({ filters, setFilters, categories }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (category: string) => {
    setFilters(prev => {
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories: newCategories };
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
      priceRange: [0, 20000],
      isMobile: false,
      sortBy: 'recommended',
    });
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="bg-muted/50 p-6 rounded-2xl border border-border/40 mb-12 shadow-lg"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Search Input */}
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

        {/* Location Input */}
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

        {/* Sort By */}
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

        {/* Clear Filters Button */}
        <Button variant="ghost" onClick={clearFilters} className="h-12 text-base group">
          <X className="mr-2 h-5 w-5 text-muted-foreground group-hover:text-destructive transition-colors" />
          Clear Filters
        </Button>
      </div>

      {/* Categories */}
      <div className="mt-6 pt-6 border-t border-border/40">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Tag className="mr-2 h-5 w-5" />
          Categories
        </h3>
        <div className="flex flex-wrap gap-3">
          {categories.map(category => (
            <motion.button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors duration-300 ${
                filters.categories.includes(category)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background hover:bg-accent hover:border-accent-foreground border-border'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="mt-6 pt-6 border-t border-border/40">
        <h3 className="text-lg font-semibold mb-4">Price Range</h3>
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
      </div>
      
      {/* Mobile Service Checkbox */}
      <div className="mt-6 pt-6 border-t border-border/40 flex items-center space-x-2">
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
      </div>
    </motion.div>
  );
};

export default ServiceFilters;
