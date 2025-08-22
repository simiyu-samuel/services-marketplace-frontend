import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, MapPin, Tag, X, ChevronRight, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface AdvancedFilters {
  search: string;
  location: string;
  category: string;
  subcategory: string;
  priceRange: [number, number];
  isMobile: boolean;
  sortBy: string;
}

const categories = {
  Beauty: ["Makeup", "Nails", "Eyebrows & Lashes", "Microblading", "Heena", "Tattoo & Piercings", "Waxing", "ASMR & Massage", "Beauty Hub"],
  Hair: ["Braiding", "Weaving", "Locs", "Wig Makeovers", "Ladies Haircut", "Complete Hair Care"],
  Fashion: ["African Wear", "Maasai Wear", "Crotchet/Weaving", "Personal Stylist", "Made in Kenya"],
  Photography: ["Event", "Lifestyle", "Portrait"],
  Bridal: ["Bridal Makeup", "Bridal Hair", "Bridesmaids for Hire", "Gowns for Hire", "Wedding Cakes"],
  Health: ["Dental", "Skin Consultation", "Reproductive Care", "Maternal Care", "Mental Care"],
  "Celebrate Her": ["Florist", "Decor", "Journey to Motherhood"],
  Fitness: ["Gym", "Personal Trainers", "Nutritionist"],
  "Home & Lifestyles": ["Cleaning Services", "Laundry Services", "Home & Home Decor"],
};

const locations = [
  "Nairobi CBD", "Westlands", "Kilimani", "Karen", "Lavington", "Kileleshwa",
  "Parklands", "Eastleigh", "South B", "South C", "Langata", "Kasarani",
  "Thika", "Kikuyu", "Ruiru", "Kiambu", "Machakos", "Kajiado"
];

const AdvancedServiceFilters = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<AdvancedFilters>({
    search: '',
    location: '',
    category: '',
    subcategory: '',
    priceRange: [0, 20000],
    isMobile: false,
    sortBy: 'recommended',
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setFilters(prev => ({ ...prev, category, subcategory: '' }));
  };

  const handleSubcategorySelect = (subcategory: string) => {
    setFilters(prev => ({ ...prev, subcategory }));
  };

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    
    if (filters.search) searchParams.set('search', filters.search);
    if (filters.location) searchParams.set('location', filters.location);
    if (filters.category) searchParams.set('category', filters.category);
    if (filters.subcategory) searchParams.set('subcategory', filters.subcategory);
    if (filters.priceRange[0] > 0) searchParams.set('min_price', filters.priceRange[0].toString());
    if (filters.priceRange[1] < 20000) searchParams.set('max_price', filters.priceRange[1].toString());
    if (filters.isMobile) searchParams.set('mobile', 'true');
    if (filters.sortBy !== 'recommended') searchParams.set('sort', filters.sortBy);

    navigate(`/services?${searchParams.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      category: '',
      subcategory: '',
      priceRange: [0, 20000],
      isMobile: false,
      sortBy: 'recommended',
    });
    setSelectedCategory('');
  };

  const hasActiveFilters = filters.search || filters.location || filters.category || 
    filters.priceRange[0] > 0 || filters.priceRange[1] < 20000 || filters.isMobile;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-7xl mx-auto"
    >
      {/* Main Search Bar */}
      <Card className="mb-6 bg-background/95 backdrop-blur-lg border-border/40 shadow-xl">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for services..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10 h-12 text-base bg-background border-border/60"
              />
            </div>
            <div className="md:col-span-3 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Select value={filters.location} onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}>
                <SelectTrigger className="pl-10 h-12 text-base bg-background border-border/60">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Button
                variant="outline"
                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                className="w-full h-12 gap-2"
              >
                <Filter className="h-4 w-4" />
                Advanced Filters
              </Button>
            </div>
            <div className="md:col-span-3">
              <Button onClick={handleSearch} className="w-full h-12 text-base font-semibold">
                Find Services
              </Button>
            </div>
          </div>

          {/* Active Filters Display */}
          <AnimatePresence>
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-border/40"
              >
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
                  {filters.category && (
                    <Badge variant="secondary" className="gap-1">
                      {filters.category}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setFilters(prev => ({ ...prev, category: '', subcategory: '' }))} />
                    </Badge>
                  )}
                  {filters.subcategory && (
                    <Badge variant="secondary" className="gap-1">
                      {filters.subcategory}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setFilters(prev => ({ ...prev, subcategory: '' }))} />
                    </Badge>
                  )}
                  {filters.location && (
                    <Badge variant="secondary" className="gap-1">
                      {filters.location}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setFilters(prev => ({ ...prev, location: '' }))} />
                    </Badge>
                  )}
                  {filters.isMobile && (
                    <Badge variant="secondary" className="gap-1">
                      Mobile Service
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setFilters(prev => ({ ...prev, isMobile: false }))} />
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2 text-xs">
                    Clear all
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {isFilterExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <Card className="bg-muted/40 border-border/40">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Categories Panel */}
                  <div className="lg:col-span-4">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Categories
                    </h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {Object.keys(categories).map(category => (
                        <motion.button
                          key={category}
                          whileHover={{ x: 4 }}
                          onClick={() => handleCategorySelect(category)}
                          className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                            selectedCategory === category 
                              ? 'bg-primary text-primary-foreground shadow-md' 
                              : 'hover:bg-muted border border-transparent hover:border-border'
                          }`}
                        >
                          <span className="font-medium">{category}</span>
                          <ChevronRight className={`h-4 w-4 transition-transform ${
                            selectedCategory === category ? 'rotate-90' : 'group-hover:translate-x-1'
                          }`} />
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Subcategories Panel */}
                  <div className="lg:col-span-4">
                    <h3 className="font-semibold mb-4">
                      {selectedCategory ? `${selectedCategory} Services` : 'Select a category'}
                    </h3>
                    <AnimatePresence mode="wait">
                      {selectedCategory && (
                        <motion.div
                          key={selectedCategory}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-2 max-h-64 overflow-y-auto"
                        >
                          {categories[selectedCategory as keyof typeof categories].map(subcategory => (
                            <motion.button
                              key={subcategory}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleSubcategorySelect(subcategory)}
                              className={`w-full text-left p-2 rounded-md transition-all duration-200 ${
                                filters.subcategory === subcategory
                                  ? 'bg-secondary text-secondary-foreground'
                                  : 'hover:bg-background border border-transparent hover:border-border'
                              }`}
                            >
                              {subcategory}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Additional Filters */}
                  <div className="lg:col-span-4 space-y-6">
                    <div>
                      <h3 className="font-semibold mb-4">Price Range</h3>
                      <div className="space-y-4">
                        <Slider
                          min={0}
                          max={20000}
                          step={500}
                          value={filters.priceRange}
                          onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: [value[0], value[1]] }))}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Ksh {filters.priceRange[0].toLocaleString()}</span>
                          <span>Ksh {filters.priceRange[1].toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-4">Sort By</h3>
                      <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recommended">Recommended</SelectItem>
                          <SelectItem value="rating">Highest Rated</SelectItem>
                          <SelectItem value="price-asc">Price: Low to High</SelectItem>
                          <SelectItem value="price-desc">Price: High to Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="mobile-service"
                        checked={filters.isMobile}
                        onCheckedChange={(checked) => setFilters(prev => ({ ...prev, isMobile: !!checked }))}
                      />
                      <label htmlFor="mobile-service" className="text-sm font-medium">
                        Mobile Service Available
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdvancedServiceFilters;