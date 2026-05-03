import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Clock,
  Minus,
  Plus,
  Loader2,
  Heart,
  Tag,
  Flame,
  AlertCircle,
  Leaf,
  Check,
  Trash2,
} from "lucide-react";
import { useFoodStore } from "@/store/food/foodStore";
import { useCartStore } from "@/store/cart/cartStore";
import { useSavedItemsStore } from "@/store/customer/savedItemsStore"; // Unified store
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function FoodDetailsPage() {
  const { foodId } = useParams<{ foodId: string }>();
  const navigate = useNavigate();

  // Stores
  const { currentFood, isLoading, error, fetchFoodDetails, clearCurrentFood } =
    useFoodStore();
  const { addToCart } = useCartStore();
  const { items: savedItems, addItem, removeItem } = useSavedItemsStore();

  const cartRestaurant = useCartStore((state) => state.restaurant);
  const clearCart = useCartStore((state) => state.clearCart);

  // Local UI State
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [addedItemName, setAddedItemName] = useState("");

  // Local State
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");

  // Universal check: Is this ID in our savedItems array?
  const isFavorite = foodId ? savedItems.some((item) => item.id === foodId) : false;

  useEffect(() => {
    if (foodId) {
      fetchFoodDetails(foodId);
    }
    return () => clearCurrentFood();
  }, [foodId, fetchFoodDetails, clearCurrentFood]);

  const handleDecrease = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleIncrease = () => {
    if (quantity < 10) setQuantity((prev) => prev + 1);
  };

  const handleBookmark = () => {
    if (!foodId || !currentFood) return;

    if (isFavorite) {
      removeItem(foodId);
    } else {
      addItem({
        id: currentFood.id,
        name: currentFood.name,
        location: currentFood.restaurantName,
        image: currentFood.image,
      });
    }
  };

  const handleAddToCart = () => {
    if (!currentFood) return;

    // Check if adding from a different restaurant
    if (cartRestaurant && cartRestaurant.id !== currentFood.restaurantId) {
      setShowSwitchModal(true);
      return;
    }

    executeAddToCart();
  };

  const executeAddToCart = () => {
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

    setAddedItemName(currentFood.name);
    setShowSuccessModal(true);

    setTimeout(() => {
      setShowSuccessModal(false);
      navigate(-1);
    }, 1500);
  };

  const handleConfirmSwitch = () => {
    clearCart();
    executeAddToCart();
    setShowSwitchModal(false);
  };

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">
            Loading food details...
          </p>
        </div>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertCircle size={32} className="text-destructive" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Something went wrong
          </h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => navigate(-1)} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // --- Not Found State ---
  if (!currentFood) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">🍽️</span>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Food not found
          </h2>
          <p className="text-muted-foreground mb-6">
            The item you're looking for doesn't exist
          </p>
          <Button onClick={() => navigate(-1)} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const hasDiscount =
    currentFood.discountPrice && currentFood.discountPrice < currentFood.price;
  const finalPrice = currentFood.discountPrice || currentFood.price;

  return (
    <div className="min-h-screen bg-background pb-28 relative">
      {/* 1. HERO IMAGE & FLOATING HEADER */}
      <div className="px-5 pt-10">
        <div className="relative h-[300px] w-full rounded-[48px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.12)] border-4 border-white dark:border-gray-900 group">
          <img
            src={currentFood.image.replace("w=200", "w=800")}
            alt={currentFood.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Darker top gradient for better contrast with white text/buttons */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />

          {/* Navigation Buttons - Now Integrated Inside the Rounded Card */}
          <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-20">
            <button
              onClick={() => navigate(-1)}
              className="w-11 h-11 bg-white dark:bg-gray-900 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-xl active:scale-90 transition-all border border-gray-100 dark:border-gray-800"
            >
              <ArrowLeft size={22} className="text-gray-900 dark:text-white" strokeWidth={2.5} />
            </button>

            <h1 className="text-white font-black text-lg tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              DETAILS
            </h1>

            <button
              onClick={handleBookmark}
              className="w-11 h-11 bg-white dark:bg-gray-900 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-xl active:scale-90 transition-all border border-gray-100 dark:border-gray-800"
            >
              <Heart
                size={22}
                strokeWidth={2.5}
                className={cn(
                  isFavorite ? "fill-red-500 text-red-500" : "text-gray-900 dark:text-white"
                )}
              />
            </button>
          </div>

          {/* Badges repositioned slightly for the new layout */}
          <div className="absolute bottom-6 left-6 z-10 flex flex-col gap-2">
            {currentFood.isPopular && (
              <Badge className="bg-primary text-white border-0 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-lg">
                <Flame size={12} className="mr-1" /> Popular
              </Badge>
            )}
            {currentFood.isFasting && (
              <Badge className="bg-green-600 text-white border-0 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-lg">
                <Leaf size={12} className="mr-1" /> Fasting
              </Badge>
            )}
          </div>

          {hasDiscount && (
            <div className="absolute bottom-6 right-6 z-10">
              <Badge className="bg-red-500 text-white border-0 px-4 py-2 text-[12px] font-black shadow-lg animate-pulse">
                <Tag size={14} className="mr-1" />{currentFood.discount}% OFF
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* 2. MAIN CONTENT BODY */}
      <div className="-mt-6 relative z-20 px-5">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-foreground tracking-tight mb-1">
            {currentFood.name}
          </h2>
          <p className="text-sm text-muted-foreground font-medium">
            {currentFood.restaurantName}
          </p>
          {currentFood.categoryName && (
            <Badge variant="secondary" className="mt-2 text-[10px] font-black uppercase tracking-wider bg-orange-50 dark:bg-orange-950/20 text-[#F26A1C] border-none px-3 py-1">
              {currentFood.categoryName}
            </Badge>
          )}
        </div>

        <div className="w-16 h-[2px] bg-primary/30 mb-5" />

        {/* 3. STATS BOX */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-[32px] p-5 flex justify-between items-center mb-8 border border-gray-100 dark:border-gray-800 shadow-sm">
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
            <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              Price
            </span>
          </div>

          <div className="w-[1px] h-10 bg-border" />

          <div className="flex flex-col items-center justify-center flex-1">
            <div className="flex items-center gap-1 mb-0.5">
              <Star size={14} className="fill-primary text-primary" />
              <span className="text-lg font-bold text-foreground leading-none">
                {currentFood.rating}
              </span>
            </div>
            <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              {currentFood.totalReviews} Reviews
            </span>
          </div>

          <div className="w-[1px] h-10 bg-border" />

          <div className="flex flex-col items-center justify-center flex-1">
            <div className="flex items-center gap-1 mb-0.5">
              <Clock size={14} className="text-primary" />
              <span className="text-lg font-bold text-foreground leading-none">
                {currentFood.preparationTime}
              </span>
            </div>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              Minutes
            </span>
          </div>
        </div>

        {/* 4. DESCRIPTION */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-2">
            Description
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {currentFood.description}
          </p>
        </div>

        {currentFood.calories && (
          <div className="mb-6 p-3 bg-muted/30 rounded-xl">
            <p className="text-xs text-muted-foreground">
              🔥 Nutritional Info: Approximately {currentFood.calories} calories
            </p>
          </div>
        )}

        {/* 5. SPECIAL INSTRUCTIONS */}
        <div className="space-y-2 mb-6">
          <label
            htmlFor="instructions"
            className="text-sm font-medium text-foreground"
          >
            Special Instructions{" "}
            <span className="text-muted-foreground text-xs">(Optional)</span>
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

      {/* 6. FIXED BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-5 py-4 pb-6 flex items-center justify-between gap-4 z-50">
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

        <button
          onClick={handleAddToCart}
          className="flex-1 bg-primary text-primary-foreground rounded-xl px-6 py-3 font-semibold text-sm hover:bg-primary/90 active:scale-95 transition-all shadow-lg"
        >
          Add to Cart • ETB {finalPrice * quantity}
        </button>
      </div>

      {/* ── Success Modal ── */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
          <div className="relative bg-white dark:bg-gray-900 rounded-[32px] p-8 w-full max-w-[280px] flex flex-col items-center text-center shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
              <Check className="text-green-500" size={32} strokeWidth={3} />
            </div>
            <h3 className="text-[18px] font-black text-gray-900 dark:text-white mb-1">
              Added to Cart!
            </h3>
            <p className="text-[13px] font-bold text-gray-500 dark:text-gray-400 leading-tight">
              {quantity}x {addedItemName}
            </p>
          </div>
        </div>
      )}

      {/* ── Switch Restaurant Modal ── */}
      {showSwitchModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setShowSwitchModal(false)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-[32px] p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                <Trash2 className="text-[#F26A1C]" size={28} />
              </div>
            </div>
            <h3 className="text-[17px] font-black text-gray-900 dark:text-white mb-2 text-center leading-tight">
              Start a New Basket?
            </h3>
            <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400 text-center mb-8 px-2">
              Your cart already contains items from <span className="font-bold text-gray-900 dark:text-white">{cartRestaurant?.name}</span>. Adding this will clear your current cart.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSwitchModal(false)}
                className="flex-1 py-3.5 border-2 border-orange-100 dark:border-gray-700 text-[#F26A1C] font-bold rounded-full text-[14px] active:scale-95 transition-transform"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSwitch}
                className="flex-1 py-3.5 bg-[#F26A1C] text-white font-bold rounded-full text-[14px] shadow-md active:scale-95 transition-transform"
              >
                Clear & Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}