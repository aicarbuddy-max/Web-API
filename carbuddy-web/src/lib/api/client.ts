import { API_CONFIG, API_ENDPOINTS } from './config';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  Garage,
  GarageWithDistance,
  GarageSearchRequest,
  GarageStatistics,
  Service,
  AutoPartsShop,
} from './types';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    // Load token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const url = `${this.baseURL}${endpoint}`;
    console.log('API Request:', url, options);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log('API Response:', response.status, response.statusText);

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          console.error('API Error Response:', errorData);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          const errorText = await response.text();
          console.error('API Error Text:', errorText);
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error: any) {
      console.error('API request failed:', {
        url,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  // Auth Methods
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>(
      API_ENDPOINTS.login,
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      }
    );

    this.token = response.token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response));
    }

    return response;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    console.log('Register request:', data);
    const response = await this.request<AuthResponse>(
      API_ENDPOINTS.register,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );

    return response;
  }

  logout() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getUser() {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  // Garage Methods
  async getAllGarages(): Promise<Garage[]> {
    return this.request<Garage[]>(API_ENDPOINTS.garages);
  }

  async searchNearbyGarages(
    searchParams: GarageSearchRequest
  ): Promise<GarageWithDistance[]> {
    return this.request<GarageWithDistance[]>(
      API_ENDPOINTS.garagesSearch,
      {
        method: 'POST',
        body: JSON.stringify(searchParams),
      }
    );
  }

  async getTopRatedGarages(count: number = 10): Promise<Garage[]> {
    return this.request<Garage[]>(
      `${API_ENDPOINTS.garagesTopRated}?count=${count}`
    );
  }

  async getGarageById(id: string): Promise<Garage> {
    return this.request<Garage>(API_ENDPOINTS.garageById(id));
  }

  async getGarageStatistics(id: string): Promise<GarageStatistics> {
    return this.request<GarageStatistics>(API_ENDPOINTS.garageStats(id));
  }

  // Service Methods
  async getAllServices(): Promise<Service[]> {
    return this.request<Service[]>(API_ENDPOINTS.services);
  }

  async getServiceById(id: string): Promise<Service> {
    return this.request<Service>(API_ENDPOINTS.serviceById(id));
  }

  // Auto Parts Shop Methods
  async getAllAutoPartsShops(): Promise<AutoPartsShop[]> {
    return this.request<AutoPartsShop[]>(API_ENDPOINTS.autoPartsShops);
  }

  async getAutoPartsShopById(id: string): Promise<AutoPartsShop> {
    return this.request<AutoPartsShop>(
      API_ENDPOINTS.autoPartsShopById(id)
    );
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
