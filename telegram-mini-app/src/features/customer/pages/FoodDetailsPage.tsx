import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Bookmark, 
  Star, 
  MessageSquare, 
  Clock, 
  Minus, 
  Plus, 
  Loader2,
  Heart,
  Tag,
  Flame,
  AlertCircle
} from "lucide-react";
import { useFoodStore } from "@/store/food/foodStore";
import { useCartStore } from "@/store/cart/cartStore";
import { useCustomerStore } from "@/store/customer/customerStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function FoodDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { currentFood, isLoading, error, fetchFoodDetails, clearCurrentFood } = useFoodStore();
  const { addToCart } = useCartStore();
  const { toggleFavoriteFood, isFavoriteFood } = useCustomerStore();

  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");
  
  const isFavorite = id ? isFavoriteFood(id) : false;

  useEffect(() => {
    if (id) {
      fetchFoodDetails(id);
    }
    return () => clearCurrentFood();
  }, [id, fetchFoodDetails, clearCurrentFood]);

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleIncrease = () => {
    if (quantity < 10) setQuantity(prev => prev + 1);
  };

  const handleBookmark = () => {
    if (id) {
      toggleFavoriteFood(id);
    }
  };

  const handleAddToCart = () => {
    if (!currentFood) return;
    
    addToCart({
      id: currentFood.id,
      name: currentFood.name,
      price: currentFood.discountPrice || currentFood.price,
      originalPrice: currentFood.originalPrice,
      image: currentFood.image,
      restaurantId: currentFood.restaurantId,
      restaurantName: currentFood.restaurantName,
      quantity: quantity,
      specialInstructions: specialInstructions || undefined,
    });

    // Optional: Show toast notification
    navigate(-1);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Loading food details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertCircle size={32} className="text-destructive" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => navigate(-1)} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Not found state
  if (!currentFood) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">🍽️</span>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Food not found</h2>
          <p className="text-muted-foreground mb-6">The item you're looking for doesn't exist</p>
          <Button onClick={() => navigate(-1)} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const hasDiscount = currentFood.discountPrice && currentFood.discountPrice < currentFood.price;
  const finalPrice = currentFood.discountPrice || currentFood.price;

  return (
    <div className="min-h-screen bg-background pb-28 relative">
      
      {/* 1. HERO IMAGE & FLOATING HEADER */}
      <div className="relative h-[280px] w-full">
        <img 
          src={currentFood.image} 
          alt={currentFood.name} 
          className="w-full h-full object-cover"
        />
        
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-20 right-4 z-10">
            <Badge className="bg-red-500 text-white border-0 px-3 py-1.5 text-sm font-bold">
              <Tag size={14} className="mr-1" />
              -{currentFood.discount}% OFF
            </Badge>
          </div>
        )}

        {/* Popular Badge */}
        {currentFood.isPopular && (
          <div className="absolute top-20 left-4 z-10">
            <Badge className="bg-primary/90 text-white border-0 px-3 py-1.5 text-sm font-bold">
              <Flame size={14} className="mr-1" />
              Popular
            </Badge>
          </div>
        )}

        {/* Floating Top Nav */}
        <div className="absolute top-0 left-0 right-0 px-4 pt-4 pb-2 flex justify-between items-center z-10">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-background/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm active:scale-95 transition-transform"
          >
            <ArrowLeft size={20} className="text-foreground" />
          </button>
          
          <h1 className="text-white font-bold text-lg tracking-wide drop-shadow-md">
            Details
          </h1>
          
          <button 
            onClick={handleBookmark}
            className="w-10 h-10 bg-background/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm active:scale-95 transition-transform"
          >
            <Heart 
              size={20} 
              className={isFavorite ? "fill-red-500 text-red-500" : "text-foreground"} 
            />
          </button>
        </div>
      </div>

      {/* 2. MAIN CONTENT BODY */}
      <div className="-mt-6 relative z-20 px-5">
        
        {/* Title & Restaurant */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-foreground tracking-tight mb-1">
            {currentFood.name}
          </h2>
          <p className="text-sm text-muted-foreground">
            {currentFood.restaurantName}
          </p>
        </div>
        
        {/* Subtle divider */}
        <div className="w-16 h-[2px] bg-primary/30 mb-5" />

        {/* 3. STATS BOX */}
        <div className="bg-muted/50 rounded-2xl p-4 flex justify-between items-center mb-6">
          
          {/* Price */}
          <div className="flex flex-col items-center justify-center flex-1">
            <div className="flex items-baseline gap-1 mb-0.5">
              {hasDiscount && (
                <span className="text-xs text-muted-foreground line-through">
                  ETB {currentFood.price}
                </span>
              )}
              <span className="text-lg font-bold text-primary">
                ETB {finalPrice}
              </span>
            </div>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Price</span>
          </div>

          {/* Divider */}
          <div className="w-[1px] h-10 bg-border" />

          {/* Rating */}
          <div className="flex flex-col items-center justify-center flex-1">
            <div className="flex items-center gap-1 mb-0.5">
              <Star size={14} className="fill-primary text-primary" />
              <span className="text-lg font-bold text-foreground leading-none">{currentFood.rating}</span>
            </div>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              {currentFood.totalReviews} Reviews
            </span>
          </div>

          {/* Divider */}
          <div className="w-[1px] h-10 bg-border" />

          {/* Prep Time */}
          <div className="flex flex-col items-center justify-center flex-1">
            <div className="flex items-center gap-1 mb-0.5">
              <Clock size={14} className="text-primary" />
              <span className="text-lg font-bold text-foreground leading-none">{currentFood.preparationTime}</span>
            </div>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Minutes</span>
          </div>
        </div>

        {/* 4. DESCRIPTION */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-2">Description</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {currentFood.description}
          </p>
        </div>

        {/* 5. CALORIES INFO (if available) */}
        {currentFood.calories && (
          <div className="mb-6 p-3 bg-muted/30 rounded-xl">
            <p className="text-xs text-muted-foreground">
              🔥 Nutritional Info: Approximately {currentFood.calories} calories
            </p>
          </div>
        )}

        {/* 6. SPECIAL INSTRUCTIONS */}
        <div className="space-y-2 mb-6">
          <label htmlFor="instructions" className="text-sm font-medium text-foreground">
            Special Instructions <span className="text-muted-foreground text-xs">(Optional)</span>
          </label>
          <textarea
            id="instructions"
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            className="w-full h-28 bg-background border border-border rounded-xl p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
            placeholder="e.g., No onions, extra spicy, contactless delivery..."
          />
        </div>
      </div>

      {/* 7. FIXED BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-5 py-4 pb-6 flex items-center justify-between gap-4 z-50">
        
        {/* Quantity Selector */}
        <div className="bg-muted rounded-xl flex items-center p-1">
          <button 
            onClick={handleDecrease}
            disabled={quantity <= 1}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed text-muted-foreground active:scale-95 transition-all"
          >
            <Minus size={16} />
          </button>
          
          <span className="w-10 text-center font-semibold text-foreground">
            {quantity}
          </span>
          
          <button 
            onClick={handleIncrease}
            disabled={quantity >= 10}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed text-primary active:scale-95 transition-all"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Add To Cart Button */}
        <button 
          onClick={handleAddToCart}
          className="flex-1 bg-primary text-primary-foreground rounded-xl px-6 py-3 font-semibold text-sm hover:bg-primary/90 active:scale-95 transition-all shadow-lg"
        >
          Add to Cart • ETB {finalPrice * quantity}
        </button>
      </div>

    </div>
  );
}