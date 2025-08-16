import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const categories = ["Nails", "Wellness", "Makeup", "Hair", "Skincare"];

const ServiceFilters = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter & Sort</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="search">Search by keyword</Label>
          <Input id="search" placeholder="e.g., Massage, Braids" />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <div className="space-y-2">
            {categories.map(category => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox id={`cat-${category}`} />
                <Label htmlFor={`cat-${category}`} className="font-normal">{category}</Label>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Price Range</Label>
          <Slider defaultValue={[5000]} max={20000} step={500} />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Ksh 0</span>
            <span>Ksh 20,000+</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="mobile-service">Mobile Service</Label>
          <Switch id="mobile-service" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sort">Sort by</Label>
          <Select>
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