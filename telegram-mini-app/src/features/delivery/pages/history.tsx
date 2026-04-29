import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { useOrderStore } from "@/store/orders/orderStore";

// ─── constants ────────────────────────────────────────────────────────────────
const ORANGE = "#F27420";
const ORANGE_SOFT = "#FFF0E6";

// Use OrderHistoryItem from orderStore — imported for type safety
import type { OrderHistoryItem } from "@/store/orders/orderStore";

// ─── StarRating ───────────────────────────────────────────────────────────────
function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${rating} out of ${max} stars`}
    >
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          className="h-[18px] w-[18px]"
          fill={i < rating ? ORANGE : "none"}
          style={{ color: i < rating ? ORANGE : "#D1D5DB" }}
          strokeWidth={1.5}
          aria-hidden
        />
      ))}
    </div>
  );
}

// ─── StatusBadge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: OrderHistoryItem["status"] }) {
  const isGood = status === "DELIVERED" || status === "COMPLETED";
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-5 py-2 text-sm font-semibold text-white shadow-sm",
        isGood ? "bg-[#28A745]" : "bg-[#DC3545]",
      )}
    >
      {isGood ? "Delivered" : status === "CANCELLED" ? "Cancelled" : "Disputed"}
    </span>
  );
}

// ─── OrderCard ────────────────────────────────────────────────────────────────
function OrderCard({ item }: { item: OrderHistoryItem }) {
  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_16px_rgba(0,0,0,0.08)] ring-1 ring-gray-100">
      <div className="px-4 pt-4 pb-5">
        {/* Row 1 — Restaurant name + shortId */}
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-base font-bold text-gray-900 leading-tight">
            {item.restaurantName}
          </h2>
          <span className="shrink-0 text-sm text-gray-400">
            #{item.shortId}
          </span>
        </div>

        {/* Row 2 — Food image + name + price */}
        <div className="mt-3 flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="absolute -bottom-1 left-1 h-14 w-14 rounded-xl bg-gray-200/60" />
            <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 shadow-sm">
              <img
                src={item.firstItemImageUrl ?? "https://images.unsplash.com/photo-1544025162-831e5088eb7e?w=200"}
                alt={item.firstItemName}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-800 leading-snug">
              {item.firstItemName}
            </p>
            <p className="mt-0.5 text-xs text-gray-400">Delivery: {item.deliveryFee} ETB</p>
          </div>
          <p className="shrink-0 text-base font-bold" style={{ color: ORANGE }}>
            {item.totalAmount} Birr
          </p>
        </div>

        {/* Row 3 — Stars + Status */}
        <div className="mt-4 flex items-center justify-between gap-2">
          {item.rating !== null ? <StarRating rating={item.rating ?? 0} /> : <div />}
          <StatusBadge status={item.status} />
        </div>
      </div>
    </article>
  );
}

// ─── HistoryPage (default export) ─────────────────────────────────────────────
export default function HistoryPage() {
  const navigate = useNavigate();
  const { orderHistory, fetchOrderHistory, isLoading } = useOrderStore();

  useEffect(() => {
    fetchOrderHistory();
  }, [fetchOrderHistory]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* ── Header ── */}
      <header className="sticky top-0 z-20 bg-white px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] shadow-[0_1px_0_rgba(0,0,0,0.06)]">
        <div className="relative flex h-12 items-center justify-center">
          {/* Back button */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-xl border border-[#F27420]/30 transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F27420]/40"
            style={{ backgroundColor: ORANGE_SOFT }}
            aria-label="Go back"
          >
            <ArrowLeft
              className="h-5 w-5"
              style={{ color: ORANGE }}
              strokeWidth={2.5}
            />
          </button>

          {/* Title */}
          <h1 className="text-xl font-bold text-gray-900">History</h1>
        </div>
      </header>

      {/* ── Order list ── */}
      <main className="flex-1 overflow-y-auto px-4 py-5 pb-32">
        <div className="mx-auto w-full max-w-lg">
          {isLoading ? (
            <div className="flex h-[50vh] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#F27420]" />
            </div>
          ) : orderHistory.length === 0 ? (
            <div className="flex h-[50vh] flex-col items-center justify-center text-center">
              <p className="text-gray-500">No order history found.</p>
            </div>
          ) : (
            orderHistory.map((item, index) => (
              <div key={item.id}>
                <OrderCard item={item} />
                {/* Separator — visually independent, equal spacing above and below */}
                {index < orderHistory.length - 1 && (
                  <div className="flex items-center py-3" aria-hidden>
                    <div
                      className="h-[2px] w-full rounded-full"
                      style={{ backgroundColor: ORANGE }}
                    />
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
