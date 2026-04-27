export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city?: string;
  area?: string;
  landmark?: string;
}

export interface Address extends Location {
  id: string;
  label: string;
  street: string;
  city: string;
  area: string;
  building?: string;
  floor?: string;
  apartment?: string;
}

export interface Stats {
  totalOrders: number;
  totalSpent?: number; // Customer
  totalRevenue?: number; // Vendor
  averageRating: number;
  totalReviews?: number; // Vendor
  favoriteRestaurants?: string[];
  favoriteFoods?: string[];
  recentSearches?: string[];
  completionRate?: number; // Vendor/Delivery
}
