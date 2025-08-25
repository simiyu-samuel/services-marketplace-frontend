import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { MapPin } from 'lucide-react';

const locations = [
  { value: 'mombasa', label: 'Mombasa' },
  { value: 'kwale', label: 'Kwale' },
  { value: 'kilifi', label: 'Kilifi' },
  { value: 'tana river', label: 'Tana River' },
  { value: 'lamu', label: 'Lamu' },
  { value: 'taita-taveta', label: 'Taita–Taveta' },
  { value: 'garissa', label: 'Garissa' },
  { value: 'wajir', label: 'Wajir' },
  { value: 'mandera', label: 'Mandera' },
  { value: 'marsabit', label: 'Marsabit' },
  { value: 'isiolo', label: 'Isiolo' },
  { value: 'meru', label: 'Meru' },
  { value: 'tharaka-nithi', label: 'Tharaka‑Nithi' },
  { value: 'embu', label: 'Embu' },
  { value: 'kitui', label: 'Kitui' },
  { value: 'machakos', label: 'Machakos' },
  { value: 'makueni', label: 'Makueni' },
  { value: 'nyandarua', label: 'Nyandarua' },
  { value: 'nyeri', label: 'Nyeri' },
  { value: 'kirinyaga', label: 'Kirinyaga' },
  { value: 'murang\'a', label: 'Murang’a' },
  { value: 'kiambu', label: 'Kiambu' },
  { value: 'turkana', label: 'Turkana' },
  { value: 'west pokot', label: 'West Pokot' },
  { value: 'samburu', label: 'Samburu' },
  { value: 'trans-nzoia', label: 'Trans‑Nzoia' },
  { value: 'uasin gishu', label: 'Uasin Gishu' },
  { value: 'elgeyo-marakwet', label: 'Elgeyo‑Marakwet' },
  { value: 'nandi', label: 'Nandi' },
  { value: 'baringo', label: 'Baringo' },
  { value: 'laikipia', label: 'Laikipia' },
  { value: 'nakuru', label: 'Nakuru' },
  { value: 'narok', label: 'Narok' },
  { value: 'kajiado', label: 'Kajiado' },
  { value: 'kericho', label: 'Kericho' },
  { value: 'bomet', label: 'Bomet' },
  { value: 'kakamega', label: 'Kakamega' },
  { value: 'vihiga', label: 'Vihiga' },
  { value: 'bungoma', label: 'Bungoma' },
  { value: 'busia', label: 'Busia' },
  { value: 'siaya', label: 'Siaya' },
  { value: 'kisumu', label: 'Kisumu' },
  { value: 'homa bay', label: 'Homa Bay' },
  { value: 'migori', label: 'Migori' },
  { value: 'kisii', label: 'Kisii' },
  { value: 'nyamira', label: 'Nyamira' },
  { value: 'nairobi', label: 'Nairobi' },
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
