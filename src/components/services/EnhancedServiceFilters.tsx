import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, MapPin, Tag, X, ChevronRight, Filter, Grid } from 'lucide-react';
import { Filters } from '@/pages/Services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from "@/components/ui/scroll-area";

interface EnhancedServiceFiltersProps {
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

const locations = [
  // Major Cities and Popular Areas
  "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Malindi", "Kitale", "Garissa", "Kakamega",
  
  // All 47 Counties in Kenya
  "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet", "Embu", "Garissa", "Homa Bay", "Isiolo", "Kajiado",
  "Kakamega", "Kericho", "Kiambu", "Kilifi", "Kirinyaga", "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia",
  "Lamu", "Machakos", "Makueni", "Mandera", "Marsabit", "Meru", "Migori", "Mombasa", "Murang'a", "Nairobi",
  "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua", "Nyeri", "Samburu", "Siaya", "Taita-Taveta", "Tana River",
  "Tharaka-Nithi", "Trans Nzoia", "Turkana", "Uasin Gishu", "Vihiga", "Wajir", "West Pokot",
  
  // Popular Nairobi Areas
  "Nairobi CBD", "Westlands", "Kilimani", "Karen", "Lavington", "Kileleshwa", "Parklands", "Eastleigh", 
  "South B", "South C", "Langata", "Kasarani", "Runda", "Muthaiga", "Spring Valley", "Riverside",
  "Hurlingham", "Kilimani", "Dagoretti", "Ngong", "Rongai", "Ruaka", "Kikuyu", "Ruiru"
];

const EnhancedServiceFilters: React.FC<EnhancedServiceFiltersProps> = ({ 
  filters, 
  setFilters, 
  categories 
}) => {
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleMainCategorySelect = (category: string) => {
    setSelectedMainCategory(category);
    setFilters(prev => ({
      ...prev,
      categories: [category], // Only one main category can be selected
      subcategories: [], // Clear subcategories when main category changes
    }));
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

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      categories: [],
      subcategories: [],
      min_price: null,
      max_price: null,
      priceRange: [0, 20000],
      isMobile: false,
      sortBy: 'recommended',
    });
    setSelectedMainCategory('');
  };

  const hasActiveFilters = filters.search || filters.location || selectedMainCategory ||
    filters.subcategories.length > 0 || filters.priceRange[0] > 0 || filters.priceRange[1] < 20000 || filters.isMobile;

  return (
    <div className="space-y-6">
      {/* Quick Search & Location */}
      <Card className="bg-background/95 backdrop-blur-lg border-border/40 shadow-lg">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="search"
                placeholder="Search services..."
                value={filters.search}
                onChange={handleInputChange}
                className="pl-10 bg-background"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Select value={filters.location} onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}>
                <SelectTrigger className="pl-10 bg-background">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              {isExpanded ? 'Hide Filters' : 'More Filters'}
            </Button>
          </div>

          {/* Active Filters */}
          <AnimatePresence>
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-border/40"
              >
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm font-medium text-muted-foreground">Active:</span>
                  {filters.categories.map(category => (
                    <Badge key={category} variant="secondary" className="gap-1">
                      {category}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-destructive" 
                        onClick={() => {
                          setFilters(prev => ({ 
                            ...prev, 
                            categories: prev.categories.filter(c => c !== category) 
                          }));
                          setSelectedMainCategory('');
                        }} 
                      />
                    </Badge>
                  ))}
                  {filters.subcategories.map(subcategory => (
                    <Badge key={subcategory} variant="outline" className="gap-1">
                      {subcategory}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-destructive" 
                        onClick={() => setFilters(prev => ({ 
                          ...prev, 
                          subcategories: prev.subcategories.filter(s => s !== subcategory) 
                        }))} 
                      />
                    </Badge>
                  ))}
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
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Card className="bg-muted/40 border-border/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Grid className="h-5 w-5" />
                  Advanced Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
<div className="space-y-6">
                  {/* Main Categories */}
                  <div className="lg:col-span-1">
                    <h3 className="font-semibold mb-4 text-foreground">Main Categories</h3>
                    <ScrollArea className="h-64">
                      <div className="space-y-2 pr-4">
                        {Object.keys(subcategories).map(category => (
                          <motion.button
                            key={category}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleMainCategorySelect(category)}
                            className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                              selectedMainCategory === category
                                ? 'bg-primary text-primary-foreground shadow-md'
                                : 'hover:bg-muted border border-transparent hover:border-border'
                            }`}
                          >
                            <span className="font-medium">{category}</span>
                            <ChevronRight className={`h-4 w-4 transition-transform ${
                              selectedMainCategory === category ? 'rotate-90' : 'group-hover:translate-x-1'
                            }`} />
                          </motion.button>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  {/* Subcategories */}
                  <div className="lg:col-span-1">
                    <h3 className="font-semibold mb-4 text-foreground">
                      {selectedMainCategory ? 'Specific Services' : 'Select a category first'}
                    </h3>
                    <ScrollArea className="h-64">
                      <AnimatePresence mode="wait">
                        {selectedMainCategory && (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-2 pr-4"
                          >
                            {(subcategories[selectedMainCategory as keyof typeof subcategories] || []).map(subcategory => (
                              <motion.button
                                key={subcategory}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleSubcategoryChange(subcategory)}
                                className={`w-full text-left p-2 rounded-md transition-all duration-200 text-sm ${
                                  filters.subcategories.includes(subcategory)
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
                    </ScrollArea>
                  </div>

                  {/* Additional Filters */}
                  <div className="lg:col-span-1 space-y-6">
                    <div>
                      <h3 className="font-semibold mb-4 text-foreground">Price Range</h3>
                      <div className="space-y-4">
                        <Slider
                          min={0}
                          max={20000}
                          step={500}
                          value={filters.priceRange}
                          onValueChange={handlePriceChange}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Ksh {filters.priceRange[0].toLocaleString()}</span>
                          <span>Ksh {filters.priceRange[1].toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-4 text-foreground">Sort By</h3>
                      <Select 
                        value={filters.sortBy} 
                        onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
                      >
                        <SelectTrigger className="bg-background">
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
                        id="mobile-service-enhanced"
                        checked={filters.isMobile}
                        onCheckedChange={(checked) => setFilters(prev => ({ ...prev, isMobile: !!checked }))}
                      />
                      <label htmlFor="mobile-service-enhanced" className="text-sm font-medium">
                        Mobile Service Available
                      </label>
                    </div>

                    <Button 
                      variant="secondary" 
                      onClick={clearFilters} 
                      className="w-full gap-2"
                      disabled={!hasActiveFilters}
                    >
                      <X className="h-4 w-4" />
                      Clear All Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedServiceFilters;
