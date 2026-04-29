import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Send,
  CheckCircle2,
  MessageSquare,
  ThumbsUp,
} from "lucide-react";
import { useCustomerOrderStore } from "@/store/orders/customerOrderStore";
import { useRatingStore } from "@/store/customer/ratingStore";
import { ROUTES } from "@/routes/routePaths";
import { cn } from "@/lib/utils";

// ─── Quick comment chips ───────────────────────────────────────────────────────
const QUICK_COMMENTS = [
  "Very fast delivery! 🚀",
  "Friendly driver 😊",
  "Food arrived hot 🔥",
  "Great communication 💬",
  "Handled with care 📦",
];

// ─── Star Row ──────────────────────────────────────────────────────────────────
function StarRow({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;
  return (
    <div className="flex gap-3 justify-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="transition-all active:scale-90"
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
        >
          <Star
            size={40}
            strokeWidth={1.5}
            className={cn(
              "transition-all duration-150",
              star <= display
                ? "fill-[#F26A1C] text-[#F26A1C] drop-shadow-[0_2px_4px_rgba(242,106,28,0.4)]"
                : "text-gray-200 dark:text-gray-700",
            )}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Rating labels ─────────────────────────────────────────────────────────────
const RATING_LABELS: Record<number, string> = {
  1: "Poor 😞",
  2: "Fair 😐",
  3: "Good 🙂",
  4: "Great 😊",
  5: "Excellent 🌟",
};

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function OrderReviewPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const order = useCustomerOrderStore((s) =>
    s.orders.find((o) => o.id === orderId),
  );
  const { hasRated, submitRating, isSubmitting } = useRatingStore();
  const alreadyRated = orderId ? hasRated(orderId) : false;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(alreadyRated);
  const [selectedChips, setSelectedChips] = useState<string[]>([]);

  const toggleChip = (chip: string) => {
    setSelectedChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip],
    );
  };

  const handleSubmit = async () => {
    if (!order || rating === 0 || !orderId) return;
    const fullComment = [
      ...selectedChips,
      ...(comment.trim() ? [comment.trim()] : []),
    ].join(" · ");

    await submitRating({
      rateeId: order.deliverer?.name || "unknown",
      orderId,
      rating,
      comment: fullComment,
    });
    setSubmitted(true);
  };

  // ─── Success state ─────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 font-sans flex flex-col items-center justify-center px-8 pb-20 text-center">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 animate-in zoom-in-75 duration-500">
          <CheckCircle2 size={52} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
          Thank you! 🎉
        </h2>
        <p className="text-gray-500 text-base font-medium mb-8 max-w-[260px]">
          Your feedback helps us improve ASTU Eats for everyone.
        </p>
        <button
          onClick={() => navigate(ROUTES.CUSTOMER.HOME)}
          className="bg-[#F26A1C] text-white font-bold py-4 px-10 rounded-full shadow-[0_8px_20px_rgba(242,106,28,0.3)] active:scale-95 transition-transform"
        >
          Back to Home
        </button>
        <button
          onClick={() => navigate(ROUTES.CUSTOMER.ORDERS.LIST)}
          className="mt-3 text-[#F26A1C] font-bold text-[15px] active:opacity-70"
        >
          View My Orders
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center">
        <p className="text-gray-400">Order not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-[#F26A1C] font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  const deliveryNotCompleted = !["DELIVERED", "COMPLETED", "RECEIVED"].includes(
    order.status,
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 font-sans flex flex-col pb-32">
      {/* Header */}
      <header className="relative flex items-center justify-center px-5 pt-6 pb-5">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-5 w-10 h-10 bg-[#FFF4ED] dark:bg-gray-900 rounded-[12px] flex items-center justify-center text-[#F26A1C] active:scale-95 transition-transform"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
        <h1 className="text-[18px] font-black text-gray-900 dark:text-white">
          Rate Your Order
        </h1>
      </header>

      {deliveryNotCompleted && (
        <div className="mx-5 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-[16px] mb-4">
          <p className="text-sm font-medium text-amber-700 dark:text-amber-400 text-center">
            ⚠️ Your order hasn't been delivered yet.
          </p>
        </div>
      )}

      <div className="px-5 space-y-6">
        {/* Deliverer card */}
        {order.deliverer && (
          <div className="bg-white dark:bg-gray-900 rounded-[24px] p-5 border border-gray-100 dark:border-gray-800 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex items-center gap-4">
            <img
              src={
                order.deliverer.avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(order.deliverer.name)}&background=F26A1C&color=fff`
              }
              alt={order.deliverer.name}
              className="w-14 h-14 rounded-full border-2 border-orange-100 object-cover"
            />
            <div>
              <p className="font-black text-[15px] text-gray-900 dark:text-white">
                {order.deliverer.name}
              </p>
              <p className="text-[13px] text-gray-500 font-medium">
                Delivery Partner
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Star size={13} className="fill-[#F26A1C] text-[#F26A1C]" />
                <span className="text-[13px] font-bold text-gray-700 dark:text-gray-300">
                  {order.deliverer.rating.toFixed(1)} rating
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Order ref */}
        <div className="text-center">
          <p className="text-[12px] text-gray-400 uppercase tracking-widest font-bold">
            Order #{order.shortId} · {order.restaurantName}
          </p>
        </div>

        {/* Stars */}
        <div className="bg-white dark:bg-gray-900 rounded-[24px] p-6 border border-gray-100 dark:border-gray-800 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <p className="text-center text-[14px] font-bold text-gray-500 dark:text-gray-400 mb-6">
            How was your delivery experience?
          </p>
          <StarRow value={rating} onChange={setRating} />
          {rating > 0 && (
            <p className="text-center mt-4 text-[16px] font-black text-[#F26A1C] animate-in fade-in duration-200">
              {RATING_LABELS[rating]}
            </p>
          )}
        </div>

        {/* Quick comment chips */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ThumbsUp size={16} className="text-[#F26A1C]" />
            <p className="text-[14px] font-bold text-gray-700 dark:text-gray-300">
              What went well?
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {QUICK_COMMENTS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => toggleChip(chip)}
                className={cn(
                  "py-2 px-3 rounded-full text-[12px] font-bold border transition-all active:scale-95",
                  selectedChips.includes(chip)
                    ? "bg-[#F26A1C] text-white border-[#F26A1C]"
                    : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700",
                )}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Free text */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare size={16} className="text-[#F26A1C]" />
            <label
              htmlFor="reviewComment"
              className="text-[14px] font-bold text-gray-700 dark:text-gray-300"
            >
              Additional comments{" "}
              <span className="text-gray-400 font-medium">(optional)</span>
            </label>
          </div>
          <textarea
            id="reviewComment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-[16px] px-4 py-3.5 text-[14px] text-gray-900 dark:text-white placeholder:text-gray-400 outline-none focus:border-[#F26A1C] focus:ring-1 focus:ring-[#F26A1C] transition-all resize-none"
            placeholder="Tell us more about your experience..."
          />
        </div>
      </div>

      {/* Submit button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] z-40">
        <button
          onClick={handleSubmit}
          disabled={rating === 0 || isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-[#F26A1C] hover:bg-[#e05d15] text-white rounded-[20px] font-bold text-[15px] py-4 shadow-[0_8px_20px_rgba(242,106,28,0.3)] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          <Send size={18} />
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
        <p className="text-center text-[11px] text-gray-400 mt-2">
          Your feedback is anonymous and helps improve our service.
        </p>
      </div>
    </div>
  );
}
