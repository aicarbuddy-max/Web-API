import { useState, useEffect } from 'react';
import { Star, MapPin, Phone } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';
import { apiClient } from '../lib/api';
import type { Garage } from '../lib/api/types';
import { toast } from 'sonner';

interface GaragesPageProps {
  isDarkMode: boolean;
}

const offerBanners = [
  {
    id: 1,
    title: '20% OFF Oil Change',
    description: 'Valid until end of month. Book now!',
    badge: 'Limited Offer',
    gradient: 'from-orange-600 via-orange-700 to-red-700',
    image: 'https://images.unsplash.com/photo-1606922699403-9a40186fcb9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBkaXNjb3VudCUyMHNhbGV8ZW58MXx8fHwxNzYxMTE4MTY0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 2,
    title: 'Free Brake Inspection',
    description: 'With any service. Limited time only!',
    badge: 'Hot Deal',
    gradient: 'from-purple-600 via-purple-700 to-pink-700',
    image: 'https://images.unsplash.com/photo-1729216255000-9d698575fddd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvbW90aXZlJTIwc3BlY2lhbCUyMG9mZmVyfGVufDF8fHx8MTc2MTExODE2NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 3,
    title: '$50 OFF Full Service',
    description: 'For first-time customers. Don\'t miss out!',
    badge: 'New Customer',
    gradient: 'from-blue-600 via-blue-700 to-indigo-700',
    image: 'https://images.unsplash.com/photo-1727893274832-efe10afd49ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBtYWludGVuYW5jZSUyMHNlcnZpY2V8ZW58MXx8fHwxNzYxMDk5NDM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
];

const garages = [
  {
    id: 1,
    name: 'AutoCare Pro',
    rating: 4.8,
    reviews: 324,
    distance: '0.8 mi',
    open: true,
    phone: '(555) 123-4567',
    services: ['Oil Change', 'Brake Service', 'Diagnostics'],
    image: 'https://images.unsplash.com/photo-1730453075684-2ad6232ab451?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvJTIwcmVwYWlyJTIwZ2FyYWdlfGVufDF8fHx8MTc2MTAzNTQzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 2,
    name: 'Quick Fix Garage',
    rating: 4.6,
    reviews: 198,
    distance: '1.2 mi',
    open: true,
    phone: '(555) 234-5678',
    services: ['Tires', 'Alignment', 'AC Repair'],
    image: 'https://images.unsplash.com/photo-1549047608-55b2fd4b8427?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBnYXJhZ2UlMjB3b3Jrc2hvcHxlbnwxfHx8fDE3NjExMTgxNjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 3,
    name: 'Elite Motors Service',
    rating: 4.9,
    reviews: 456,
    distance: '1.5 mi',
    open: false,
    phone: '(555) 345-6789',
    services: ['Engine Repair', 'Transmission', 'Detailing'],
    image: 'https://images.unsplash.com/photo-1758767355046-1986dda2d967?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvbW90aXZlJTIwc2VydmljZSUyMGNlbnRlcnxlbnwxfHx8fDE3NjEwMzc3ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 4,
    name: 'City Auto Repair',
    rating: 4.7,
    reviews: 267,
    distance: '2.1 mi',
    open: true,
    phone: '(555) 456-7890',
    services: ['Oil Change', 'Inspection', 'Brake Service'],
    image: 'https://images.unsplash.com/photo-1730453075684-2ad6232ab451?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBzZXJ2aWNlJTIwbWVjaGFuaWN8ZW58MXx8fHwxNzYwOTk1OTMyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 5,
    name: 'Premium Auto Center',
    rating: 4.9,
    reviews: 512,
    distance: '2.3 mi',
    open: true,
    phone: '(555) 567-8901',
    services: ['Luxury Cars', 'Performance', 'Custom Work'],
    image: 'https://images.unsplash.com/photo-1730453075684-2ad6232ab451?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvJTIwcmVwYWlyJTIwZ2FyYWdlfGVufDF8fHx8MTc2MTAzNTQzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 6,
    name: 'Speedy Service Station',
    rating: 4.5,
    reviews: 289,
    distance: '2.8 mi',
    open: true,
    phone: '(555) 678-9012',
    services: ['Quick Service', 'Oil Change', 'Filters'],
    image: 'https://images.unsplash.com/photo-1549047608-55b2fd4b8427?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBnYXJhZ2UlMjB3b3Jrc2hvcHxlbnwxfHx8fDE3NjExMTgxNjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 7,
    name: 'Master Mechanic Shop',
    rating: 4.8,
    reviews: 378,
    distance: '3.1 mi',
    open: false,
    phone: '(555) 789-0123',
    services: ['Engine', 'Transmission', 'Electrical'],
    image: 'https://images.unsplash.com/photo-1758767355046-1986dda2d967?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvbW90aXZlJTIwc2VydmljZSUyMGNlbnRlcnxlbnwxfHx8fDE3NjEwMzc3ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 8,
    name: 'Express Auto Works',
    rating: 4.6,
    reviews: 445,
    distance: '3.4 mi',
    open: true,
    phone: '(555) 890-1234',
    services: ['Body Work', 'Paint', 'Collision'],
    image: 'https://images.unsplash.com/photo-1730453075684-2ad6232ab451?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvJTIwcmVwYWlyJTIwZ2FyYWdlfGVufDF8fHx8MTc2MTAzNTQzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 9,
    name: 'Downtown Garage',
    rating: 4.4,
    reviews: 223,
    distance: '3.7 mi',
    open: true,
    phone: '(555) 901-2345',
    services: ['General Repair', 'Maintenance', 'Tune-ups'],
    image: 'https://images.unsplash.com/photo-1549047608-55b2fd4b8427?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBnYXJhZ2UlMjB3b3Jrc2hvcHxlbnwxfHx8fDE3NjExMTgxNjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 10,
    name: 'TechCar Specialists',
    rating: 4.9,
    reviews: 589,
    distance: '4.0 mi',
    open: true,
    phone: '(555) 012-3456',
    services: ['Diagnostics', 'Computer', 'Electronics'],
    image: 'https://images.unsplash.com/photo-1758767355046-1986dda2d967?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvbW90aXZlJTIwc2VydmljZSUyMGNlbnRlcnxlbnwxfHx8fDE3NjEwMzc3ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 11,
    name: 'Budget Auto Repair',
    rating: 4.3,
    reviews: 167,
    distance: '4.3 mi',
    open: true,
    phone: '(555) 123-4560',
    services: ['Affordable Service', 'Basic Repairs', 'Oil Change'],
    image: 'https://images.unsplash.com/photo-1730453075684-2ad6232ab451?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvJTIwcmVwYWlyJTIwZ2FyYWdlfGVufDF8fHx8MTc2MTAzNTQzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 12,
    name: 'Precision Auto Care',
    rating: 4.8,
    reviews: 421,
    distance: '4.6 mi',
    open: false,
    phone: '(555) 234-5601',
    services: ['High Performance', 'Tuning', 'Upgrades'],
    image: 'https://images.unsplash.com/photo-1549047608-55b2fd4b8427?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBnYXJhZ2UlMjB3b3Jrc2hvcHxlbnwxfHx8fDE3NjExMTgxNjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
];

export function GaragesPage({ isDarkMode }: GaragesPageProps) {
  const [garages, setGarages] = useState<Garage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGarages();
  }, []);

  const loadGarages = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getAllGarages();
      setGarages(data);
    } catch (error: any) {
      console.error('Failed to load garages:', error);
      toast.error('Failed to load garages');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 px-4">
      {/* Offer Banners Carousel */}
      <Carousel className="w-full">
        <CarouselContent>
          {offerBanners.map((banner) => (
            <CarouselItem key={banner.id} className="md:basis-1/2 lg:basis-1/3">
              <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${banner.gradient} p-6 shadow-lg`}>
                <div className="relative z-10">
                  <Badge className="bg-yellow-400 text-yellow-900 mb-2">{banner.badge}</Badge>
                  <h2 className="text-white mb-2">{banner.title}</h2>
                  <p className="text-white/90 mb-3">{banner.description}</p>
                  <button className={`px-6 py-2 rounded-full ${isDarkMode ? 'bg-white text-orange-700' : 'bg-white text-orange-600'} hover:bg-gray-100 transition-colors`}>
                    Claim Offer
                  </button>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mb-12"></div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className={`left-2 ${isDarkMode ? 'bg-gray-900/80 border-gray-700 text-gray-100' : 'bg-white/80'}`} />
        <CarouselNext className={`right-2 ${isDarkMode ? 'bg-gray-900/80 border-gray-700 text-gray-100' : 'bg-white/80'}`} />
      </Carousel>

      {/* Garages List */}
      <div className="space-y-4">
        <h3 className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>Nearby Garages</h3>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className={`mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading garages...</p>
          </div>
        ) : garages.length === 0 ? (
          <div className="text-center py-12">
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>No garages found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {garages.map((garage) => (
              <Card
                key={garage.id}
                className={`overflow-hidden ${isDarkMode ? 'bg-gray-900 border-gray-800 hover:bg-gray-850' : 'bg-white border-gray-200 hover:bg-gray-50'} transition-colors cursor-pointer`}
              >
                <div className="flex gap-3 p-3">
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1730453075684-2ad6232ab451?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvJTIwcmVwYWlyJTIwZ2FyYWdlfGVufDF8fHx8MTc2MTAzNTQzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt={garage.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className={`${isDarkMode ? 'text-gray-100' : 'text-gray-900'} truncate`}>{garage.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{garage.rating.toFixed(1)}</span>
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
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} title={garage.address}>{garage.address}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      <Badge
                        variant="outline"
                        className={`text-xs ${isDarkMode ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-gray-700'}`}
                      >
                        Lat: {garage.latitude.toFixed(4)}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs ${isDarkMode ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-gray-700'}`}
                      >
                        Lng: {garage.longitude.toFixed(4)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
