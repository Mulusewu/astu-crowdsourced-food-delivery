import { type Location } from "./common";

export interface Category {
  id: string;
  name: string;
  icon: string;
  order: number;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  cuisine: string[];
  image: string;
  logo: string;
  rating: number;
  totalReviews: number;
  priceLevel: "$" | "$$" | "$$$";
  deliveryTime: string;
  deliveryFee: number;
  minimumOrder: number;
  freeDeliveryThreshold: number;
  isOpen: boolean;
  location: Location;
  categories: Category[];
  deliveryZones: string[];
  features: {
    acceptsCash: boolean;
    acceptsCard: boolean;
    acceptsTelegramStars: boolean;
    hasDelivery: boolean;
    isVegetarianFriendly?: boolean;
  };
}
