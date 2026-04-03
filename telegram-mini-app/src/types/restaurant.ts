export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  location: string;
  deliveryTime?: string;
  phone?: string;
  tags: string[];
  createdAt: string;
}
