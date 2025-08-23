import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { MapPin } from 'lucide-react';

const locations = [
  { value: 'nairobi', label: 'Nairobi' },
  { value: 'mombasa', label: 'Mombasa' },
  { value: 'kisumu', label: 'Kisumu' },
  { value: 'nakuru', label: 'Nakuru' },
  { value: 'eldoret', label: 'Eldoret' },
];

const MobileLocationSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  const navigate = useNavigate();

  const handleLocationSelect = (location: { value: string; label: string }) => {
    setSelectedLocation(location);
    setIsOpen(false);
    navigate(`/services?location=${location.value}`);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          {selectedLocation.label}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Select a Location</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 pb-0">
          <Command>
            <CommandInput placeholder="Search for a location..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {locations.map((location) => (
                  <CommandItem
                    key={location.value}
                    value={location.value}
                    onSelect={() => handleLocationSelect(location)}
                  >
                    {location.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileLocationSelector;
