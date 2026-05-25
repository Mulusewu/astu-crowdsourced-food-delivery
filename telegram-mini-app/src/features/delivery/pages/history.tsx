import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Loader2, Info, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

import { useOrderStore, type OrderHistoryItem } from "@/store/orders/orderStore";

const ORANGE = "#F27420";
const ORANGE_SOFT = "#FFF0E6";

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          className="h-[18px] w-[18px]"
          fill={i < rating ? ORANGE : "none"}
          style={{ color: i < rating ? ORANGE : "#D1D5DB" }}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: OrderHistoryItem["status"] }) {
  const getBadgeStyle = () => {
    switch (status) {
      case "COMPLETED":
      case "DELIVERED":
      case "RECEIVED":
        return { bg: "bg-[#28A745]", text: "Completed" };
      case "CANCELLED":
        return { bg: "bg-[#DC3545]", text: "Cancelled" };
      case "DISPUTED":
        return { bg: "bg-orange-500", text: "Disputed" };
      case "NO_DELIVERER_FOUND":
        return { bg: "bg-gray-500", text: "Missed" };
      default:
        return { bg: "bg-gray-500", text: status };
    }
  };
  const style = getBadgeStyle();
  return (
    <span className={cn("inline-flex items-center justify-center rounded-lg px-5 py-2 text-sm font-semibold text-white shadow-sm", style.bg)}>
      {style.text}
    </span>
  );
}

// ─── Expandable OrderCard ───────────────────────────────────────────────────
function OrderCard({ item }: { item: OrderHistoryItem }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [receiptData, setReceiptData] = useState<any | null>(null);
  const [isLoadingReceipt, setIsLoadingReceipt] = useState(false);
  
  // Extract the function directly from the store
  const fetchOrderReceipt = useOrderStore(state => state.fetchOrderReceipt);

  const handleToggle = async () => {
    const nextState = !isExpanded;
    setIsExpanded(nextState);

    // Lazy load the deep data ONLY when opened for the first time
    if (nextState && !receiptData) {
      setIsLoadingReceipt(true);
      const data = await fetchOrderReceipt(item.id);
      setReceiptData(data);
      setIsLoadingReceipt(false);
    }
  };

  const formattedDate = new Date(item.createdAt).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
  });

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_16px_rgba(0,0,0,0.08)] ring-1 ring-gray-100 transition-all duration-300">
      
      {/* Clickable Header Area */}
      <div 
        onClick={handleToggle}
        className="px-4 pt-4 pb-5 cursor-pointer active:bg-gray-50 transition-colors"
      >
        <div className="flex items-start justify-between gap-2 mb-1">
          <h2 className="text-base font-bold text-gray-900 leading-tight">
            {item.restaurantName}
          </h2>
          <span className="shrink-0 text-sm font-black text-[#F27420]">
            #{item.shortId}
          </span>
        </div>
        <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wide">
          {formattedDate}
        </p>

        <div className="mt-3 flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="absolute -bottom-1 left-1 h-14 w-14 rounded-xl bg-gray-200/60" />
            <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 shadow-sm">
              <img
                src={item.firstItemImageUrl || "https://images.unsplash.com/photo-1541544741938-0af808871cc0"}
                alt="Order item"
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-800 leading-snug">
              Delivery Job
            </p>
            <p className="mt-0.5 text-xs font-bold text-gray-400">
              {item.firstItemName}
            </p>
          </div>

          <div className="flex flex-col items-end">
            <p className="shrink-0 text-base font-bold" style={{ color: ORANGE }}>
              {item.totalAmount} ETB
            </p>
            <p className="text-[10px] font-medium text-gray-400">Total Collected</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-gray-50 pt-4">
          {item.rating ? (
            <StarRating rating={item.rating} />
          ) : (
            <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1">
              <Info size={14} /> No Rating
            </span>
          )}
          
          <div className="flex items-center gap-3">
            <StatusBadge status={item.status} />
            <div className={`p-1.5 rounded-full bg-gray-100 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
              <ChevronDown size={16} className="text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Accordion Expansion Area */}
      <div 
        className={cn(
          "bg-gray-50/50 border-t border-gray-100 transition-all duration-300 ease-in-out overflow-hidden",
          isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="p-5">
          {isLoadingReceipt ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-[#F27420]" />
            </div>
          ) : receiptData ? (
            <div className="space-y-4">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">Detailed Receipt</h3>
              
              {/* Itemized List */}
              <div className="space-y-2 mb-4">
                {receiptData.items.map((i: any) => (
                  <div key={i.id} className="flex justify-between items-center text-sm font-medium text-gray-700">
                    <span>{i.quantity}x {i.product?.name || 'Item'}</span>
                    <span>{Number(i.quantity * i.unitPrice).toFixed(0)} ETB</span>
                  </div>
                ))}
              </div>

              <div className="w-full h-px bg-gray-200" />

              {/* Financial Breakdown (Deliverer Perspective) */}
              <div className="space-y-1.5 text-xs font-semibold text-gray-500">
                <div className="flex justify-between">
                  <span>Food Price (Paid to Vendor)</span>
                  <span>{Number(receiptData.foodPrice).toFixed(2)} ETB</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee Earned</span>
                  <span className="text-[#F27420]">{Number(receiptData.deliveryFee).toFixed(2)} ETB</span>
                </div>
                {Number(receiptData.tip) > 0 && (
                  <div className="flex justify-between">
                    <span>Tip Earned</span>
                    <span className="text-[#F27420]">{Number(receiptData.tip).toFixed(2)} ETB</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-center text-red-500 font-bold py-4">Failed to load details.</p>
          )}
        </div>
      </div>
    </article>
  );
}

export default function HistoryPage() {
  const navigate = useNavigate();
  const { orderHistory, fetchOrderHistory, isLoading } = useOrderStore();

  useEffect(() => {
    fetchOrderHistory();
  }, [fetchOrderHistory]);

  return (
    <div className="flex min-h-screen flex-col bg-[#FDFDFD]">
      <header className="sticky top-0 z-20 bg-[#FDFDFD]/90 backdrop-blur-md px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] shadow-[0_1px_0_rgba(0,0,0,0.06)]">
        <div className="relative flex h-12 items-center justify-center">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-xl border border-[#F27420]/30 transition hover:opacity-90 focus-visible:outline-none"
            style={{ backgroundColor: ORANGE_SOFT }}
          >
            <ArrowLeft className="h-5 w-5" style={{ color: ORANGE }} strokeWidth={2.5} />
          </button>
          <h1 className="text-[18px] font-black text-gray-900 tracking-tight">Delivery History</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-5 pb-32">
        <div className="mx-auto w-full max-w-lg">
          {isLoading ? (
            <div className="flex h-[50vh] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#F27420]" />
            </div>
          ) : orderHistory.length === 0 ? (
            <div className="flex h-[50vh] flex-col items-center justify-center text-center opacity-50">
              <p className="text-gray-500 font-bold">No order history found.</p>
              <p className="text-xs text-gray-400 mt-2">Your completed deliveries will appear here.</p>
            </div>
          ) : (
            orderHistory.map((item, index) => (
              <div key={item.id}>
                <OrderCard item={item} />
                {index < orderHistory.length - 1 && (
                  <div className="flex items-center py-3" aria-hidden>
                    <div className="h-[2px] w-full rounded-full" style={{ backgroundColor: ORANGE }} />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}