import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Star, Clock, Minus, Plus, Loader2, Heart, Flame, AlertCircle, Leaf, Check, Trash2,
} from "lucide-react";
import { useFoodStore } from "@/store/food/foodStore";
import { useCartStore } from "@/store/cart/cartStore";
import { useSavedItemsStore } from "@/store/customer/savedItemsStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTelegram } from "@/contexts/TelegramContext";

export default function FoodDetailsPage() {
  const { foodId } = useParams<{ foodId: string }>();
  const navigate = useNavigate();
  const { showBackButton, hideBackButton, hapticFeedback } = useTelegram();

  const { currentFood, isLoading, error, fetchFoodDetails, clearCurrentFood } = useFoodStore();
  
  // Unified Cart Hooks
  const { addToCart, restaurantId: cartRestaurantId, clearCart } = useCartStore();
  
  // Unified Bookmark Hooks
  const { isSaved: checkIsSaved, addItem: saveItem, removeItem: unsaveItem } = useSavedItemsStore();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [addedItemName, setAddedItemName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");

  const isFavorite = foodId ? checkIsSaved(foodId) : false;

  const handleBack = useCallback(() => {
    hapticFeedback.impact("light");
    navigate(-1);
  }, [navigate, hapticFeedback]);

  useEffect(() => {
    showBackButton(handleBack);
    return () => hideBackButton();
  }, [showBackButton, hideBackButton, handleBack]);

  useEffect(() => {
    if (foodId) fetchFoodDetails(foodId);
    return () => clearCurrentFood();
  }, [foodId, fetchFoodDetails, clearCurrentFood]);

  const handleDecrease = () => {
    if (quantity > 1) {
      hapticFeedback.impact("light");
      setQuantity((prev) => prev - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < 10) {
      hapticFeedback.impact("light");
      setQuantity((prev) => prev + 1);
    }
  };

  const handleBookmark = () => {
    if (!foodId || !currentFood) return;
    hapticFeedback.impact("medium");
    if (isFavorite) {
      unsaveItem(foodId, "MENU_ITEM");
    } else {
      saveItem({
        id: currentFood.id,
        type: "MENU_ITEM",
        name: currentFood.name,
        location: currentFood.restaurantName,
        image: currentFood.image,
      });
    }
  };

  const handleAddToCart = () => {
    if (!currentFood) return;
    
    // Check if cart has items from another restaurant
    if (cartRestaurantId && cartRestaurantId !== currentFood.restaurantId) {
      setShowSwitchModal(true);
      return;
    }
    executeAddToCart();
  };

  const executeAddToCart = useCallback(() => {
    if (!currentFood) return;
    hapticFeedback.notification("success");
    
    // CRITICAL FIX: DTO Alignment (menuId, expectedUnitPrice)
    addToCart({
      menuId: currentFood.id,
      name: currentFood.name,
      expectedUnitPrice: currentFood.price,
      image: currentFood.image,
      restaurantId: currentFood.restaurantId,
      quantity: quantity,
      // Note: specialInstructions is kept local for UI but stripped by backend currently
    });

    setAddedItemName(currentFood.name);
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
      navigate(-1);
    }, 1500);
  }, [currentFood, addToCart, quantity, specialInstructions, hapticFeedback, navigate]);

  const handleConfirmSwitch = () => {
    clearCart();
    executeAddToCart();
    setShowSwitchModal(false);
  };

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-[#F26A1C]" /></div>;
  if (error || !currentFood) return <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center"><AlertCircle size={32} className="text-red-500 mb-4" /><h2 className="text-xl font-bold mb-2">Item Not Found</h2><Button onClick={handleBack} variant="outline">Go Back</Button></div>;

  return (
    <div className="min-h-screen bg-background pb-28 relative font-sans">
      
      <div className="px-5 pt-10">
        <div className="relative h-[300px] w-full rounded-[48px] overflow-hidden shadow-xl border-4 border-white dark:border-gray-900 group">
          <img src={currentFood.image} alt={currentFood.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
          <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-20">
            <button onClick={handleBack} className="w-11 h-11 bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center shadow-md active:scale-90 transition-all"><ArrowLeft size={22} className="text-gray-900 dark:text-white" strokeWidth={2.5} /></button>
            <h1 className="text-white font-black text-lg tracking-wider drop-shadow-md">DETAILS</h1>
            <button onClick={handleBookmark} className="w-11 h-11 bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center shadow-md active:scale-90 transition-all"><Heart size={22} strokeWidth={2.5} className={cn(isFavorite ? "fill-red-500 text-red-500" : "text-gray-900 dark:text-white")} /></button>
          </div>
          <div className="absolute bottom-6 left-6 z-10 flex flex-col gap-2">
            {currentFood.isFasting && <Badge className="bg-green-600 text-white border-0 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest"><Leaf size={12} className="mr-1" /> Fasting</Badge>}
          </div>
        </div>
      </div>

      <div className="-mt-6 relative z-20 px-5">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">{currentFood.name}</h2>
          <p className="text-sm text-gray-500 font-medium">{currentFood.restaurantName}</p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-[32px] p-5 flex justify-between items-center mb-8 border border-gray-100 dark:border-gray-800">
          <div className="flex flex-col items-center flex-1">
            <span className="text-lg font-bold text-[#F26A1C]">{currentFood.price} ETB</span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</span>
          </div>
          <div className="w-[1px] h-10 bg-gray-200 dark:bg-gray-800" />
          <div className="flex flex-col items-center flex-1">
            <div className="flex items-center gap-1"><Star size={14} className="fill-[#F26A1C] text-[#F26A1C]" /><span className="text-lg font-bold">{currentFood.rating}</span></div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{currentFood.totalReviews} Reviews</span>
          </div>
          <div className="w-[1px] h-10 bg-gray-200 dark:bg-gray-800" />
          <div className="flex flex-col items-center flex-1">
            <div className="flex items-center gap-1"><Clock size={14} className="text-[#F26A1C]" /><span className="text-lg font-bold">{currentFood.preparationTime}</span></div>
            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Minutes</span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2">Description</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{currentFood.description || "No description provided."}</p>
        </div>

        <div className="space-y-2 mb-6">
          <label className="text-sm font-medium">Special Instructions (Optional)</label>
          <textarea value={specialInstructions} onChange={(e) => setSpecialInstructions(e.target.value)} className="w-full h-28 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#F26A1C] transition-all resize-none shadow-sm" placeholder="e.g., No onions, extra spicy..." />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 px-5 py-4 pb-6 flex items-center justify-between gap-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="bg-gray-100 dark:bg-gray-900 rounded-xl flex items-center p-1">
          <button onClick={handleDecrease} disabled={quantity <= 1} className="w-9 h-9 flex items-center justify-center rounded-lg disabled:opacity-50 active:scale-95 transition-all text-gray-600"><Minus size={16} /></button>
          <span className="w-10 text-center font-bold">{quantity}</span>
          <button onClick={handleIncrease} disabled={quantity >= 10} className="w-9 h-9 flex items-center justify-center rounded-lg text-[#F26A1C] active:scale-95 transition-all"><Plus size={16} strokeWidth={3} /></button>
        </div>
        <button 
          onClick={handleAddToCart} 
          disabled={!currentFood.isAvailable}
          className="flex-1 bg-[#F26A1C] text-white rounded-xl px-6 py-4 font-black text-[15px] shadow-[0_8px_20px_rgba(242,106,28,0.25)] active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none"
        >
          {currentFood.isAvailable ? `Add to Cart • ${currentFood.price * quantity} ETB` : "Currently Unavailable"}
        </button>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
          <div className="relative bg-white dark:bg-gray-900 rounded-[32px] p-8 w-full max-w-[280px] flex flex-col items-center text-center shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4"><Check className="text-green-500" size={32} strokeWidth={3} /></div>
            <h3 className="text-[18px] font-black text-gray-900 dark:text-white mb-1">Added to Cart!</h3>
            <p className="text-[13px] font-bold text-gray-500">{quantity}x {addedItemName}</p>
          </div>
        </div>
      )}

      {/* Switch Restaurant Modal */}
      {showSwitchModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setShowSwitchModal(false)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-[32px] p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-center mb-4"><div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center"><Trash2 className="text-[#F26A1C]" size={28} /></div></div>
            <h3 className="text-[17px] font-black text-gray-900 dark:text-white mb-2 text-center leading-tight">Start a New Basket?</h3>
            <p className="text-[13px] font-medium text-gray-500 text-center mb-8 px-2">Your cart already contains items from another restaurant. Adding this will clear your current cart.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowSwitchModal(false)} className="flex-1 py-3.5 border-2 border-orange-100 text-[#F26A1C] font-bold rounded-[16px] text-[13px] active:scale-95 transition-transform">Cancel</button>
              <button onClick={handleConfirmSwitch} className="flex-1 py-3.5 bg-[#F26A1C] text-white font-bold rounded-[16px] text-[13px] shadow-md active:scale-95 transition-transform">Clear & Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}