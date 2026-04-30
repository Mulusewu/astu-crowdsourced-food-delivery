import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, History, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { useCustomerOrderStore } from "@/store/orders/customerOrderStore";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartStore } from "@/store/cart/cartStore";
import { toast } from "sonner";
import { ROUTES } from "@/routes/routePaths";

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const rawOrders = useCustomerOrderStore((state) => state.orders);
  const fetchOrders = useCustomerOrderStore((state) => state.fetchCustomerOrders);
  
  const PAST_STATUSES = ["RECEIVED", "DELIVERED", "COMPLETED", "CANCELLED", "DISPUTED", "NO_DELIVERER_FOUND"];
  const pastOrders = (rawOrders || []).filter((o) => PAST_STATUSES.includes(o.status));

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      await fetchOrders();
      setTimeout(() => setIsLoading(false), 400);
    };
    loadOrders();
  }, []);

  const getStatusDisplay = (status: string) => {
    const map: Record<string, { text: string; color: string; bg: string }> = {
      RECEIVED: { text: "Received", color: "text-green-500", bg: "bg-green-50" },
      DELIVERED: { text: "Delivered", color: "text-green-600", bg: "bg-green-50" },
      COMPLETED: { text: "Completed", color: "text-green-700", bg: "bg-green-100" },
      DISPUTED: { text: "Disputed", color: "text-red-500", bg: "bg-red-50" },
      CANCELLED: { text: "Cancelled", color: "text-red-500", bg: "bg-red-50" },
      NO_DELIVERER_FOUND: { text: "No Deliverer", color: "text-gray-500", bg: "bg-gray-100" },
    };
    return map[status] ?? { text: status, color: "text-gray-500", bg: "bg-gray-50" };
  };

  const PastOrderCard = ({ order }: { order: any }) => {
    const status = getStatusDisplay(order.status);
    const isDelivered = ["DELIVERED", "COMPLETED", "RECEIVED"].includes(order.status);
    const addToCart = useCartStore((state) => state.addToCart);

    const handleReorder = (e: React.MouseEvent) => {
      e.stopPropagation();
      order.items.forEach((item: any) => {
        addToCart({
          id: item.menuId,
          name: item.name,
          price: item.unitPrice,
          image: item.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
          restaurantId: order.restaurantId,
          restaurantName: order.restaurantName,
          quantity: item.quantity,
        });
      });
      toast.success("Added to Cart", {
        description: "Items from your past order were added to your cart.",
        duration: 2000,
      });
      navigate(ROUTES.CUSTOMER.CART);
    };

    return (
      <div className="bg-white dark:bg-gray-900 rounded-[20px] p-4 mb-4 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col cursor-pointer active:bg-gray-50 dark:active:bg-gray-800 transition-colors">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${status.bg} ${status.color}`}>
              {isDelivered ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
            </div>
            <div>
              <h3 className="font-bold text-[15px] text-gray-900 dark:text-white">
                {order.restaurantName || "Restaurant"}
              </h3>
              <p className="text-xs font-medium text-gray-500">
                #{order.shortId} · {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <p className="font-black text-[15px] text-gray-900 dark:text-white">
            {order.totalAmount?.toFixed(0) || "0"} ETB
          </p>
        </div>

        <div className="mt-3 flex gap-2">
          {isDelivered && (
            <button
              onClick={handleReorder}
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#FFF4ED] dark:bg-orange-900/20 text-[#F26A1C] font-bold text-[13px] py-2.5 rounded-[12px] active:scale-95 transition-transform"
            >
              <RefreshCw size={14} /> Reorder
            </button>
          )}
          <button
            onClick={() => navigate(`/customer/orders/track/${order.id}`)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-[13px] py-2.5 rounded-[12px] active:scale-95 transition-transform"
          >
            View Details
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 font-sans flex flex-col relative pb-28">
      <header className="px-5 pt-6 pb-4 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md sticky top-0 z-30 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-800 active:scale-95 transition-transform">
          <ArrowLeft size={20} className="text-gray-700 dark:text-gray-300" />
        </button>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
          History
        </h1>
      </header>

      <main className="px-5 pt-2">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[150px] w-full rounded-[24px]" />
            <Skeleton className="h-[150px] w-full rounded-[24px]" />
            <Skeleton className="h-[150px] w-full rounded-[24px]" />
          </div>
        ) : pastOrders.length > 0 ? (
          <div className="animate-in fade-in duration-300">
            {pastOrders.map((order: any) => (
              <PastOrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-20 pb-10 text-center px-4 animate-in fade-in">
            <div className="w-24 h-24 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-5">
              <History size={40} className="text-gray-300" strokeWidth={1.5} />
            </div>
            <h3 className="text-[18px] font-black text-gray-900 dark:text-white mb-2">
              No Past Orders
            </h3>
            <p className="text-[14px] text-gray-500 font-medium mb-8">
              You haven't completed any orders yet. Once your orders are delivered, they will appear here.
            </p>
            <button
              onClick={() => navigate("/customer/dashboard")}
              className="bg-[#F26A1C] text-white font-bold py-3.5 px-8 rounded-full shadow-md active:scale-95 transition-transform"
            >
              Order Something Now
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
