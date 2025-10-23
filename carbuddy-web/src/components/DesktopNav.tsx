import { useState } from 'react';
import { Wrench, Package, MessageCircleQuestion, Users, Mail, MapPin, User, Moon, Sun, Car, Check, ChevronsUpDown } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';

interface DesktopNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  onAskClick: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
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

export function DesktopNav({ 
  activeTab, 
  setActiveTab, 
  selectedLocation, 
  setSelectedLocation, 
  onAskClick, 
  isDarkMode,
  setIsDarkMode 
}: DesktopNavProps) {
  const [open, setOpen] = useState(false);
  
  const navItems = [
    { id: 'garages', icon: Wrench, label: 'Garages' },
    { id: 'auto-parts', icon: Package, label: 'Auto Parts' },
    { id: 'community', icon: Users, label: 'Community' },
    { id: 'contact', icon: Mail, label: 'Contact' },
  ];

  return (
    <div className={`fixed top-0 left-0 right-0 z-40 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <span className={`text-xl ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              Car Buddy
            </span>
          </div>

          {/* Center Navigation */}
          <nav className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? isDarkMode
                        ? 'text-orange-400 bg-orange-950/50'
                        : 'text-orange-600 bg-orange-50'
                      : isDarkMode
                        ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            
            {/* ASK Button */}
            <button
              onClick={onAskClick}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all transform hover:scale-105 ml-2 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400' 
                  : 'bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600'
              } text-white`}
            >
              <MessageCircleQuestion className="w-5 h-5" />
              <span>ASK AI</span>
            </button>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Searchable Location Selector */}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={`w-[180px] justify-between ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700' : 'bg-white border-gray-300 text-gray-900'}`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className={`w-4 h-4 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                    <span className="truncate">{selectedLocation}</span>
                  </div>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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

            {/* Dark Mode Toggle */}
            <div className="flex items-center gap-2">
              {isDarkMode ? (
                <Moon className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              ) : (
                <Sun className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              )}
              <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
            </div>

            {/* Profile */}
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                >
                  <User className={`w-5 h-5 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
                </button>
              </PopoverTrigger>
              <PopoverContent className={`w-56 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white'}`}>
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setActiveTab('profile')}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile Settings
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
}
