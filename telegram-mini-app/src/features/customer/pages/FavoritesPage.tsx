import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Trash2, Plus, Check, Loader2 } from "lucide-react";
import { useSavedItemsStore, type SavedItem } from "@/store/customer/savedItemsStore";
import { useCartStore } from "@/store/cart/cartStore";
import { ROUTES, buildRoute } from "@/routes/routePaths";
import { toast } from "sonner";
import { useTelegram } from "@/contexts/TelegramContext";

const ORANGE = "#F27420";

// ─── SavedItemCard ────────────────────────────────────────────────────────────
function SavedItemCard({
  item, onDelete, onNavigate, onQuickAdd
}: {
  item: SavedItem;
  onDelete: (id: string, type: "RESTAURANT" | "MENU_ITEM") => void;
  onNavigate: (id: string, type: "RESTAURANT" | "MENU_ITEM") => void;
  onQuickAdd: (item: SavedItem) => void;
}) {
  return (
    <article className="flex items-center gap-3 rounded-[24px] bg-white dark:bg-gray-900 p-3 shadow-sm border border-gray-100 dark:border-gray-800 transition-transform active:scale-[0.98]">
      <button
        type="button"
        onClick={() => onNavigate(item.id, item.type)}
        className="flex flex-1 min-w-0 items-center gap-3 text-left focus:outline-none"
      >
        <div className="relative shrink-0">
          <div className="flex h-[60px] w-[60px] items-center justify-center rounded-2xl overflow-hidden shadow-sm">
            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
          </div>
        </div>

        <div className="min-w-0 flex-1 py-1">
          <p className="truncate text-[15px] font-bold text-gray-900 dark:text-white leading-tight">
            {item.name}
          </p>
          <div className="mt-1 flex items-center gap-1 text-gray-500">
            <MapPin className="h-3 w-3 shrink-0 text-[#F27420]" />
            <span className="truncate text-[11px] font-semibold">{item.location}</span>
          </div>
          {item.type === "MENU_ITEM" && item.price && (
             <p className="mt-1 text-[13px] font-black text-[#F27420]">{item.price} ETB</p>
          )}
        </div>
      </button>

      <div className="flex flex-col items-center gap-2 shrink-0 pr-1">
        {/* CRITICAL FIX: Only show Add to Cart for Food Items */}
        {item.type === "MENU_ITEM" && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onQuickAdd(item); }}
            className="w-8 h-8 bg-orange-50 text-[#F27420] rounded-full flex items-center justify-center hover:bg-[#F27420] hover:text-white transition-colors"
          >
            <Plus size={18} strokeWidth={3} />
          </button>
        )}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDelete(item.id, item.type); }}
          className="w-8 h-8 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full flex items-center justify-center transition-colors"
        >
          <Trash2 size={16} strokeWidth={2} />
        </button>
      </div>
    </article>
  );
}

// ─── SavedItemsPage ───────────────────────────────────────────────────────────
export default function SavedItemsPage() {
  const navigate = useNavigate();
  const { hapticFeedback } = useTelegram();
  const { items, removeItem, fetchSavedItems } = useSavedItemsStore();
  
  // Cart Integration
  const { addToCart, restaurantId: cartRestaurantId, clearCart } = useCartStore();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [pendingItem, setPendingItem] = useState<SavedItem | null>(null);

  useEffect(() => {
    fetchSavedItems();
  }, [fetchSavedItems]);

  const handleNavigate = (id: string, type: "RESTAURANT" | "MENU_ITEM") => {
    if (type === "RESTAURANT") navigate(buildRoute(ROUTES.CUSTOMER.RESTAURANT.DETAILS, { restaurantId: id }));
    else navigate(buildRoute(ROUTES.CUSTOMER.FOOD.DETAILS, { foodId: id }));
  };

  const handleQuickAdd = (item: SavedItem) => {
    if (!item.restaurantId || !item.price) {
      toast.error("Item data is incomplete.");
      return;
    }

    if (cartRestaurantId && cartRestaurantId !== item.restaurantId) {
      setPendingItem(item);
      setShowSwitchModal(true);
      return;
    }

    executeAddToCart(item);
  };

  const executeAddToCart = (item: SavedItem) => {
    hapticFeedback.notification("success");
    addToCart({
      menuId: item.id,
      name: item.name,
      expectedUnitPrice: item.price!,
      image: item.image,
      restaurantId: item.restaurantId!,
      quantity: 1,
    });

    setShowSuccessModal(true);
    setTimeout(() => setShowSuccessModal(false), 1500);
  };

  const handleConfirmSwitch = () => {
    if (pendingItem) {
      clearCart();
      executeAddToCart(pendingItem);
      setShowSwitchModal(false);
      setPendingItem(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FDFDFD] dark:bg-gray-950 font-sans relative">
      <header className="sticky top-0 z-20 bg-[#FDFDFD]/90 dark:bg-gray-950/90 backdrop-blur-md px-4 pb-3 pt-[max(1rem,env(safe-area-inset-top))] shadow-sm">
        <div className="relative flex h-12 items-center justify-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#F27420] active:scale-95 transition-transform"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
          </button>
          <h1 className="text-[18px] font-black text-gray-900 tracking-tight">Saved Items</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6 pb-32">
        <div className="mx-auto w-full max-w-lg flex flex-col gap-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
              <Bookmark className="h-16 w-16 mb-4 text-gray-400" />
              <p className="text-[17px] font-black text-gray-900">No saved items yet</p>
            </div>
          ) : (
            items.map((item) => (
              <SavedItemCard
                key={item.id}
                item={item}
                onDelete={removeItem}
                onNavigate={handleNavigate}
                onQuickAdd={handleQuickAdd}
              />
            ))
          )}
        </div>
      </main>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
          <div className="relative bg-white rounded-[32px] p-8 w-full max-w-[280px] flex flex-col items-center text-center shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4"><Check className="text-green-500" size={32} strokeWidth={3} /></div>
            <h3 className="text-[18px] font-black text-gray-900 mb-1">Added to Cart!</h3>
          </div>
        </div>
      )}

      {/* Switch Restaurant Modal */}
      {showSwitchModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setShowSwitchModal(false)} />
          <div className="relative bg-white rounded-[32px] p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-center mb-4"><div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center"><Trash2 className="text-[#F26A1C]" size={28} /></div></div>
            <h3 className="text-[17px] font-black text-gray-900 mb-2 text-center leading-tight">Start a New Basket?</h3>
            <p className="text-[13px] font-medium text-gray-500 text-center mb-8 px-2">Your cart contains items from another restaurant. Adding this will clear your current cart.</p>
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