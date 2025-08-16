import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Filters } from "@/pages/Services";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "../ui/button";

const categories = [
  "Makeup", "Nails", "Eyebrows & Lashes", "Microblading", "Heena", 
  "Tattoo & Piercings", "Waxing", "ASMR & Massage", "Beauty Hub",
  "Braiding", "Weaving", "Locs", "Wig Makeovers", "Ladies Haircut", 
  "Complete Hair Care", "African Wear", "Maasai Wear", "Crotchet/Wear"
];

interface ServiceFiltersProps {
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: any) => void;
  onClearFilters: () => void;
}

const ServiceFilters = ({ filters, onFilterChange, onClearFilters }: ServiceFiltersProps) => {
  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    onFilterChange('categories', newCategories);
  };

  return (
    <Card className="bg-background/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Filter & Sort</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClearFilters}>Clear</Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="search">Search by keyword</Label>
          <Input 
            id="search" 
            placeholder="e.g., Massage, Braids" 
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
        </div>
        
        <Accordion type="multiple" defaultValue={['category', 'price']} className="w-full">
          <AccordionItem value="category">
            <AccordionTrigger className="text-base">Category</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2 h-64 overflow-y-auto">
                {categories.map(category => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`cat-${category}`} 
                      checked={filters.categories.includes(category)}
                      onCheckedChange={(checked) => handleCategoryChange(category, !!checked)}
                    />
                    <Label htmlFor={`cat-${category}`} className="font-normal">{category}</Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="price">
            <AccordionTrigger className="text-base">Price Range</AccordionTrigger>
            <AccordionContent>
              <div className="pt-4">
                <Slider 
                  value={filters.priceRange} 
                  max={20000} 
                  step={500} 
                  onValueChange={(value) => onFilterChange('priceRange', value as [number, number])}
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>Ksh {filters.priceRange[0].toLocaleString()}</span>
                  <span>Ksh {filters.priceRange[1].toLocaleString()}{filters.priceRange[1] === 20000 ? '+' : ''}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input 
            id="location" 
            placeholder="e.g., Nairobi, Mombasa" 
            value={filters.location}
            onChange={(e) => onFilterChange('location', e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3">
          <Label htmlFor="mobile-service">Mobile Service Only</Label>
          <Switch 
            id="mobile-service" 
            checked={filters.isMobile}
            onCheckedChange={(checked) => onFilterChange('isMobile', checked)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sort">Sort by</Label>
          <Select value={filters.sortBy} onValueChange={(value) => onFilterChange('sortBy', value)}>
            <SelectTrigger id="sort">
              <SelectValue placeholder="Recommended" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceFilters;