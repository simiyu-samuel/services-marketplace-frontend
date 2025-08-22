import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const locations = [
  "Nairobi CBD", "Westlands", "Kilimani", "Karen", "Lavington", "Kileleshwa",
  "Parklands", "Eastleigh", "South B", "South C", "Langata", "Kasarani",
  "Thika", "Kikuyu", "Ruiru", "Kiambu", "Machakos", "Kajiado"
];

const MobileLocationSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const navigate = useNavigate();

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setIsOpen(false);
    // Navigate to services with location filter
    navigate(`/services?location=${encodeURIComponent(location)}`);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
      >
        <MapPin className="h-4 w-4" />
        <span className="text-xs font-medium">
          {selectedLocation || 'Location'}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-3 w-3" />
        </motion.div>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-full right-0 mt-2 w-64 bg-background border border-border/40 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto"
            >
              <div className="p-2">
                <div className="text-xs font-medium text-muted-foreground p-2 border-b border-border/40 mb-2">
                  Select your location
                </div>
                {locations.map((location, index) => (
                  <motion.button
                    key={location}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                    onClick={() => handleLocationSelect(location)}
                    className="w-full text-left p-2 rounded-md hover:bg-muted transition-colors duration-150 text-sm"
                  >
                    {location}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileLocationSelector;