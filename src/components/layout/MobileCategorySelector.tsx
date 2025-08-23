import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MobileCategorySelectorProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const categories = [ // Export categories
  "Beauty Services",
  "Hair Services",
  "Fashion Services",
  "Photography",
  "Bridal Services",
  "Health Services",
  "Celebrate Her",
  "Fitness Services",
  "Home & Lifestyles"
];

// Subcategories
const subcategoriesMap: Record<string, string[]> = {
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

const MobileCategorySelector: React.FC<MobileCategorySelectorProps> = ({ isOpen, onOpenChange }) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSubcategorySelect = (subcategory: string) => {
    navigate(`/services?category=${encodeURIComponent(selectedCategory || '')}&subcategory=${encodeURIComponent(subcategory)}`);
    onOpenChange(false);
    setSelectedCategory(null); // Reset for next time
  };

  const handleViewAllServices = () => {
    if (selectedCategory) {
      navigate(`/services?category=${encodeURIComponent(selectedCategory)}`);
    } else {
      navigate('/services');
    }
    onOpenChange(false);
    setSelectedCategory(null);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full sm:max-w-sm overflow-y-auto bg-purple-900 text-white">
        <SheetHeader>
          <SheetTitle className="text-white">
            {selectedCategory ? selectedCategory : "Select a Category"}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          {!selectedCategory ? (
            <div className="space-y-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant="ghost"
                  className="w-full justify-between text-left text-lg py-6 px-4 hover:bg-purple-700/50 transition-colors"
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                  <ChevronRight className="h-5 w-5 text-purple-300" />
                </Button>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-left text-lg py-6 px-4 hover:bg-purple-700/50 transition-colors mb-4"
                onClick={() => setSelectedCategory(null)}
              >
                &larr; Back to Categories
              </Button>
              {subcategoriesMap[selectedCategory]?.map((subcategory) => (
                <Button
                  key={subcategory}
                  variant="ghost"
                  className="w-full justify-start text-left text-base py-4 px-4 hover:bg-purple-700/50 transition-colors"
                  onClick={() => handleSubcategorySelect(subcategory)}
                >
                  {subcategory}
                </Button>
              ))}
              <div className="border-t border-purple-700 pt-4 mt-4">
                <Button
                  variant="outline"
                  className="w-full bg-purple-600/20 border-purple-400/30 text-purple-100 hover:bg-purple-500/30 hover:text-white hover:border-purple-300/50"
                  onClick={handleViewAllServices}
                >
                  View All {selectedCategory} Services
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileCategorySelector;
