import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, MapPin, ChevronRight, Loader2,
  ShoppingBag, Bike, ReceiptText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth/authStore";
import { useCartStore } from "@/store/cart/cartStore";
import { useCustomerStore } from "@/store/customer/customerStore";
import { ROUTES, buildRoute } from "@/routes/routePaths";
import { toast } from "sonner";

export default function CartCheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items: cartItems, quote, checkout, isLoading: cartLoading, setDeliveryLocation } = useCartStore();
  const { getDefaultAddress } = useCustomerStore();

  const [isPlacing, setIsPlacing] = useState(false);

  const defaultAddr = getDefaultAddress();

  // Navigation Guards
  useEffect(() => {
    const isAuthorized = user && (user.role === "CUSTOMER" || user.role === "DELIVERER" || user.role === "ADMIN");
    if (!isAuthorized) {
      navigate(ROUTES.AUTH);
    } else if (cartItems.length === 0) {
      navigate(ROUTES.CUSTOMER.CART);
    }
  }, [user, cartItems.length, navigate]);

  const handlePlaceOrder = async () => {
    if (isPlacing || !quote) return;

    if (!defaultAddr) {
      toast.error("No delivery address set", {
        description: "Go to your Address Book and add a campus block as your default address.",
      });
      return;
    }

    // Explicitly push coordinates into cart state right before checkout
    setDeliveryLocation(defaultAddr.latitude, defaultAddr.longitude);

    setIsPlacing(true);
    try {
      const orderId = await checkout();
      
      if (orderId) {
        toast.success("Order placed! Finding a deliverer...");
        navigate(buildRoute(ROUTES.CUSTOMER.ORDERS.TRACK, { orderId }));
      }
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to place order.");
    } finally {
      setIsPlacing(false);
    }
  };

  if (!quote) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#F26A1C]" /></div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50 dark:bg-gray-950 font-sans antialiased text-black relative pb-40">
      {/* --- Header --- */}
      <header className="px-5 pt-8 pb-4 flex items-center justify-between sticky top-0 bg-gray-50/90 dark:bg-gray-950/90 backdrop-blur-md z-30">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl flex items-center justify-center active:scale-95 transition-transform">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-black text-gray-900 dark:text-white">Checkout</h1>
        <div className="w-10" />
      </header>

      <main className="flex-1 space-y-6 px-5 pt-4">
        {/* --- Delivery Address Section --- */}
        <section className={cn(
          "bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border",
          defaultAddr ? "border-gray-100 dark:border-gray-800" : "border-red-300 dark:border-red-900/50"
        )}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-50 dark:bg-orange-950/30 rounded-lg flex items-center justify-center text-[#F26A1C]">
                <MapPin size={18} />
              </div>
              <h2 className="text-[15px] font-black text-gray-900 dark:text-white uppercase tracking-wider">Delivery Location</h2>
            </div>
            <button
              onClick={() => navigate(ROUTES.CUSTOMER.ADDRESS_BOOK)}
              className="text-[12px] font-bold text-[#F26A1C] flex items-center gap-1 active:opacity-70"
            >
              {defaultAddr ? "Change" : "Add"} <ChevronRight size={14} />
            </button>
          </div>

          {defaultAddr ? (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center shrink-0">
                <MapPin size={18} className="text-[#F26A1C]" />
              </div>
              <div>
                <p className="text-sm font-black text-gray-900 dark:text-white">{defaultAddr.street}</p>
                {defaultAddr.floor && (
                  <p className="text-xs text-gray-500 mt-0.5">{defaultAddr.floor}</p>
                )}
                <p className="text-xs text-gray-400">{defaultAddr.city}</p>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate(ROUTES.CUSTOMER.ADDRESS_BOOK)}
              className="w-full flex items-center justify-between text-left"
            >
              <p className="text-sm font-bold text-red-500">No default address set</p>
              <span className="text-xs text-[#F26A1C] font-bold underline">Add Address →</span>
            </button>
          )}
        </section>

        {/* --- Order Summary Section --- */}
        <section className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-green-50 dark:bg-green-950/30 rounded-lg flex items-center justify-center text-green-500">
              <ReceiptText size={18} />
            </div>
            <h2 className="text-[15px] font-black text-gray-900 dark:text-white uppercase tracking-wider">Price Details</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-400">
              <span>Food Subtotal</span>
              <span className="text-gray-900 dark:text-white">ETB {Number(quote.foodPrice).toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <Bike size={14} className="text-[#F26A1C]" />
                <span>Delivery Fee</span>
              </div>
              <span className="text-gray-900 dark:text-white">ETB {Number(quote.deliveryFee).toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-400">
              <span>Service Fee</span>
              <span className="text-gray-900 dark:text-white">ETB {Number(quote.serviceFee).toFixed(0)}</span>
            </div>
            <div className="pt-3 mt-3 border-t border-gray-50 dark:border-gray-800 flex justify-between">
              <span className="text-[15px] font-black text-gray-900 dark:text-white">Total Amount</span>
              <span className="text-[17px] font-black text-[#F26A1C]">ETB {Number(quote.totalAmount).toFixed(0)}</span>
            </div>
          </div>
        </section>
      </main>

      {/* --- Footer Action --- */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-gray-950/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 px-6 pt-5 pb-8">
        {!defaultAddr && (
          <p className="text-center text-xs text-red-500 font-bold mb-3 animate-pulse">
            ⚠️ Add a campus block in your Address Book to place an order.
          </p>
        )}
        <div className="flex items-center justify-between mb-4 px-2">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Final Amount</p>
            <p className="text-[19px] font-black text-gray-900 dark:text-white">ETB {Number(quote.totalAmount).toFixed(0)}</p>
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={isPlacing || cartLoading || !defaultAddr}
          className={cn(
            "w-full h-14 bg-[#F26A1C] text-white font-black text-[17px] rounded-full shadow-[0_8px_24px_rgba(242,106,28,0.25)] flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50",
            (isPlacing || cartLoading) && "opacity-80"
          )}
        >
          {isPlacing || cartLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <ShoppingBag size={20} strokeWidth={2.5} />
          )}
          <span>Confirm Order</span>
        </button>
      </footer>
    </div>
  );
}