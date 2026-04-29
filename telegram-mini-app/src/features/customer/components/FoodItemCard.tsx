// src/features/customer/components/FoodItemCard.tsx
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart/cartStore";

interface FoodItemCardProps {
  id: string;
  name: string;
  restaurantName: string;
  restaurantLocation: string;
  price: number;
  image: string;
  onClick?: () => void; // For navigating to food details
}

export default function FoodItemCard({
  id,
  name,
  restaurantName,
  restaurantLocation,
  price,
  image,
  onClick,
}: FoodItemCardProps) {
  const { addToCart } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigating to details when clicking Add
    addToCart({
      id,
      name,
      price,
      quantity: 1,
      image,
      restaurantId: "",
      restaurantName,
    });
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md active:scale-[0.985] transition-all cursor-pointer flex gap-4 p-3"
    >
      {/* Food Image */}
      <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <h3 className="font-semibold text-gray-900 leading-tight line-clamp-2">
            {name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {restaurantName} • {restaurantLocation}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-[#F26A1C] text-xl">
            ETB {price}
          </span>

          <Button
            onClick={handleAddToCart}
            size="sm"
            className="bg-[#F26A1C] hover:bg-[#F26A1C]/90 text-white rounded-2xl h-9 px-5 text-sm flex items-center gap-1"
          >
            <Plus size={16} />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}