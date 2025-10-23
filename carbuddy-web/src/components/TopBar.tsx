import { useState } from 'react';
import { MapPin, User, Check, ChevronsUpDown, Car } from 'lucide-react';
import { Button } from './ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';

interface TopBarProps {
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  onProfileClick: () => void;
  isDarkMode: boolean;
}

const locations = [
  'New York, NY',
  'Los Angeles, CA',
  'Chicago, IL',
  'Houston, TX',
  'Phoenix, AZ',
  'Philadelphia, PA',
  'San Antonio, TX',
  'San Diego, CA',
  'Dallas, TX',
  'San Jose, CA',
  'Austin, TX',
  'Jacksonville, FL',
  'Fort Worth, TX',
  'Columbus, OH',
  'Charlotte, NC',
  'San Francisco, CA',
  'Indianapolis, IN',
  'Seattle, WA',
  'Denver, CO',
  'Boston, MA',
];

export function TopBar({ selectedLocation, setSelectedLocation, onProfileClick, isDarkMode }: TopBarProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`fixed top-0 left-0 right-0 z-40 max-w-md mx-auto ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b`}>
      <div className="flex items-center justify-between px-4 py-3">
        {/* Branding */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center">
            <Car className="w-5 h-5 text-white" />
          </div>
          <span className={`${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            Car Buddy
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Searchable Location Selector */}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={`justify-between border-none shadow-none hover:bg-transparent ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}
              >
                <MapPin className={`w-4 h-4 mr-1 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                <span className="max-w-[80px] truncate text-xs">{selectedLocation.split(',')[0]}</span>
                <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className={`w-[250px] p-0 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white'}`}>
              <Command className={isDarkMode ? 'bg-gray-900' : 'bg-white'}>
                <CommandInput placeholder="Search location..." />
                <CommandList>
                  <CommandEmpty>No location found.</CommandEmpty>
                  <CommandGroup>
                    {locations.map((location) => (
                      <CommandItem
                        key={location}
                        value={location}
                        onSelect={(currentValue) => {
                          const selected = locations.find(
                            (loc) => loc.toLowerCase() === currentValue.toLowerCase()
                          );
                          if (selected) {
                            setSelectedLocation(selected);
                            setOpen(false);
                          }
                        }}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            selectedLocation === location ? 'opacity-100' : 'opacity-0'
                          }`}
                        />
                        {location}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          
          <button
            onClick={onProfileClick}
            className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
          >
            <User className={`w-5 h-5 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
