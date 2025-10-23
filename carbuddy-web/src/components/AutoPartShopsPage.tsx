import { useState, useEffect } from 'react';
import { Star, MapPin, Phone, Package, Clock } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { apiClient } from '../lib/api';
import type { AutoPartsShop } from '../lib/api/types';
import { toast } from 'sonner';

interface AutoPartShopsPageProps {
  isDarkMode: boolean;
}

const autoPartShops = [
  {
    id: 1,
    name: 'AutoZone',
    rating: 4.7,
    reviews: 542,
    distance: '0.5 mi',
    open: true,
    phone: '(555) 321-7654',
    categories: ['Batteries', 'Brakes', 'Engine Parts'],
    image: 'https://images.unsplash.com/photo-1758813147407-f9c9c1055e3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvJTIwcGFydHMlMjBzdG9yZXxlbnwxfHx8fDE3NjEyMjc2Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    hours: 'Open until 9 PM',
  },
  {
    id: 2,
    name: 'O\'Reilly Auto Parts',
    rating: 4.6,
    reviews: 389,
    distance: '0.9 mi',
    open: true,
    phone: '(555) 432-8765',
    categories: ['Tools', 'Fluids', 'Filters'],
    image: 'https://images.unsplash.com/photo-1739488754789-5a2e85ee6a79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBwYXJ0cyUyMHNob3B8ZW58MXx8fHwxNzYxMjI3NjI4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    hours: 'Open until 8 PM',
  },
  {
    id: 3,
    name: 'NAPA Auto Parts',
    rating: 4.8,
    reviews: 678,
    distance: '1.2 mi',
    open: true,
    phone: '(555) 543-9876',
    categories: ['OEM Parts', 'Performance', 'Electrical'],
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvbW90aXZlJTIwcGFydHN8ZW58MXx8fHwxNzYxMTUxMTk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    hours: 'Open until 7 PM',
  },
  {
    id: 4,
    name: 'Advance Auto Parts',
    rating: 4.5,
    reviews: 423,
    distance: '1.5 mi',
    open: true,
    phone: '(555) 654-0987',
    categories: ['Tires', 'Accessories', 'Maintenance'],
    image: 'https://images.unsplash.com/photo-1758813147407-f9c9c1055e3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvJTIwcGFydHMlMjBzdG9yZXxlbnwxfHx8fDE3NjEyMjc2Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    hours: 'Open until 8 PM',
  },
  {
    id: 5,
    name: 'Pep Boys',
    rating: 4.4,
    reviews: 356,
    distance: '1.8 mi',
    open: true,
    phone: '(555) 765-1098',
    categories: ['Installation', 'Diagnostics', 'Parts'],
    image: 'https://images.unsplash.com/photo-1739488754789-5a2e85ee6a79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBwYXJ0cyUyMHNob3B8ZW58MXx8fHwxNzYxMjI3NjI4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    hours: 'Open until 9 PM',
  },
  {
    id: 6,
    name: 'CarQuest Auto Parts',
    rating: 4.7,
    reviews: 512,
    distance: '2.1 mi',
    open: false,
    phone: '(555) 876-2109',
    categories: ['Heavy Duty', 'Commercial', 'Fleet'],
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvbW90aXZlJTIwcGFydHN8ZW58MXx8fHwxNzYxMTUxMTk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    hours: 'Closed - Opens 7 AM',
  },
  {
    id: 7,
    name: 'RockAuto Distribution',
    rating: 4.9,
    reviews: 734,
    distance: '2.4 mi',
    open: true,
    phone: '(555) 987-3210',
    categories: ['Online Orders', 'Wholesale', 'Rare Parts'],
    image: 'https://images.unsplash.com/photo-1758813147407-f9c9c1055e3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvJTIwcGFydHMlMjBzdG9yZXxlbnwxfHx8fDE3NjEyMjc2Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    hours: 'Open until 6 PM',
  },
  {
    id: 8,
    name: '4 Wheel Parts',
    rating: 4.6,
    reviews: 445,
    distance: '2.7 mi',
    open: true,
    phone: '(555) 098-4321',
    categories: ['Off-Road', 'Lift Kits', 'Wheels'],
    image: 'https://images.unsplash.com/photo-1739488754789-5a2e85ee6a79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBwYXJ0cyUyMHNob3B8ZW58MXx8fHwxNzYxMjI3NjI4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    hours: 'Open until 7 PM',
  },
  {
    id: 9,
    name: 'Euro Parts Depot',
    rating: 4.8,
    reviews: 623,
    distance: '3.0 mi',
    open: true,
    phone: '(555) 109-5432',
    categories: ['BMW', 'Mercedes', 'European'],
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvbW90aXZlJTIwcGFydHN8ZW58MXx8fHwxNzYxMTUxMTk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    hours: 'Open until 8 PM',
  },
  {
    id: 10,
    name: 'AutoNation Parts',
    rating: 4.5,
    reviews: 378,
    distance: '3.3 mi',
    open: true,
    phone: '(555) 210-6543',
    categories: ['Genuine Parts', 'Warranty', 'Quality'],
    image: 'https://images.unsplash.com/photo-1758813147407-f9c9c1055e3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvJTIwcGFydHMlMjBzdG9yZXxlbnwxfHx8fDE3NjEyMjc2Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    hours: 'Open until 9 PM',
  },
  {
    id: 11,
    name: 'Local Parts Pro',
    rating: 4.3,
    reviews: 267,
    distance: '3.6 mi',
    open: false,
    phone: '(555) 321-7654',
    categories: ['Local Stock', 'Fast Service', 'Budget Parts'],
    image: 'https://images.unsplash.com/photo-1739488754789-5a2e85ee6a79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBwYXJ0cyUyMHNob3B8ZW58MXx8fHwxNzYxMjI3NjI4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    hours: 'Closed - Opens 8 AM',
  },
  {
    id: 12,
    name: 'Performance Plus',
    rating: 4.9,
    reviews: 891,
    distance: '3.9 mi',
    open: true,
    phone: '(555) 432-8765',
    categories: ['Racing', 'Custom', 'High Performance'],
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvbW90aXZlJTIwcGFydHN8ZW58MXx8fHwxNzYxMTUxMTk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    hours: 'Open until 10 PM',
  },
];

export function AutoPartShopsPage({ isDarkMode }: AutoPartShopsPageProps) {
  const [shops, setShops] = useState<AutoPartsShop[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadShops();
  }, []);

  const loadShops = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getAllAutoPartsShops();
      setShops(data);
    } catch (error: any) {
      console.error('Failed to load auto parts shops:', error);
      toast.error('Failed to load auto parts shops');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 px-4">
      <div>
        <h2 className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>Auto Part Shops</h2>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
          Find the best auto parts near you
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className={`mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading shops...</p>
        </div>
      ) : shops.length === 0 ? (
        <div className="text-center py-12">
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>No auto parts shops found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shops.map((shop) => (
            <Card
              key={shop.id}
              className={`overflow-hidden ${isDarkMode ? 'bg-gray-900 border-gray-800 hover:bg-gray-850' : 'bg-white border-gray-200 hover:bg-gray-50'} transition-colors cursor-pointer`}
            >
              <div className="flex gap-3 p-3">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1758813147407-f9c9c1055e3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvJTIwcGFydHMlMjBzdG9yZXxlbnwxfHx8fDE3NjEyMjc2Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt={shop.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className={`${isDarkMode ? 'text-gray-100' : 'text-gray-900'} truncate`}>{shop.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{shop.rating.toFixed(1)}</span>
                        </div>
                        <Badge
                          variant="default"
                          className="text-xs h-5 bg-green-600 hover:bg-green-700"
                        >
                          Open
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className={`w-3 h-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} title={shop.address}>{shop.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className={`w-3 h-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{shop.phoneNumber}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    <Badge
                      variant="outline"
                      className={`text-xs ${isDarkMode ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-gray-700'}`}
                    >
                      Lat: {shop.latitude.toFixed(4)}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-xs ${isDarkMode ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-gray-700'}`}
                    >
                      Lng: {shop.longitude.toFixed(4)}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
