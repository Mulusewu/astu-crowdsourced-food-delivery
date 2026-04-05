// src/features/customer/components/RestaurantCard.tsx
import { MapPin, Star } from "lucide-react";

interface RestaurantCardProps {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  distance: string;
  onClick: () => void;
}

export default function RestaurantCard({
  id,
  name,
  image,
  rating,
  deliveryTime,
  distance,
  onClick,
}: RestaurantCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md active:scale-[0.985] transition-all cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-44">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-2xl text-xs font-medium flex items-center gap-1 shadow-sm">
          <Star size={14} className="text-yellow-500 fill-yellow-500" />
          <span>{rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{name}</h3>

        <div className="flex items-center justify-between mt-3 text-sm">
          <div className="flex items-center gap-1 text-gray-500">
            <MapPin size={16} className="text-[#F26A1C]" />
            <span>{distance}</span>
          </div>
          <div className="text-gray-500">
            {deliveryTime}
          </div>
        </div>
      </div>
    </div>
  );
}