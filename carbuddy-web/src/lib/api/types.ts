// API Response Types

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  id: string;
  username: string;
  email: string;
  role: string;
}

// Garage Types
export interface Garage {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface GarageWithDistance extends Garage {
  distanceKm: number;
  serviceCount: number;
}

export interface GarageSearchRequest {
  latitude: number;
  longitude: number;
  radiusKm?: number;
  minRating?: number;
}

export interface GarageStatistics {
  garageId: string;
  garageName: string;
  rating: number;
  totalServices: number;
  averageServicePrice: number;
  minServicePrice: number;
  maxServicePrice: number;
  totalRevenuePotential: number;
  mostExpensiveService: string;
  serviceCategories: Array<{
    category: string;
    count: number;
  }>;
  createdAt: string;
  daysSinceCreation: number;
}

// Service Types
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  garageId: string;
  createdAt: string;
  updatedAt: string;
}

// Auto Parts Shop Types
export interface AutoPartsShop {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  latitude: number;
  longitude: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}
