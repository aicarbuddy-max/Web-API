// API Configuration
export const API_CONFIG = {
  baseURL: 'https://carbuddy-web-api.azurewebsites.net/api',
  // baseURL: 'http://localhost:5050/api',
  timeout: 10000,
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  login: '/users/login',
  register: '/users/register',

  // Garages
  garages: '/garages',
  garagesSearch: '/garages/search',
  garagesTopRated: '/garages/top-rated',
  garageById: (id: string) => `/garages/${id}`,
  garageStats: (id: string) => `/garages/${id}/statistics`,

  // Services
  services: '/services',
  serviceById: (id: string) => `/services/${id}`,

  // Auto Parts Shops
  autoPartsShops: '/autopartsshops',
  autoPartsShopById: (id: string) => `/autopartsshops/${id}`,
};
