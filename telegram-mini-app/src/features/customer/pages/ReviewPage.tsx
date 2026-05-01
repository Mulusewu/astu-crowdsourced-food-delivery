import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, CheckCircle2, ChefHat, Bike, AlertCircle } from "lucide-react";

import { useReviewStore } from "@/store/reviewStore";
import { useCustomerOrderStore } from "@/store/orders/customerOrderStore";
import { ROUTES } from "@/routes/routePaths";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const FALLBACK_AVATAR = "https://api.dicebear.com/7.x/avataaars/svg?seed=Deliverer";

// ── Star Rating Input ──────────────────────────────────────────────────────────
function StarInput({
    value,
    onChange,
}: {
    value: number;
    onChange: (v: number) => void;
}) {
    const [hovered, setHovered] = useState(0);
    const active = hovered || value;

    const label = (r: number) => ["", "Poor", "Fair", "Good", "Great", "Excellent"][r] ?? "";

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onChange(star)}
                        onMouseEnter={() => setHovered(star)}
                        onMouseLeave={() => setHovered(0)}
                        className="transition-transform active:scale-90"
                    >
                        <Star
                            size={30}
                            className={cn(
                                "transition-colors duration-150",
                                star <= active
                                    ? "text-[#F26A1C] fill-[#F26A1C]"
                                    : "text-orange-200",
                            )}
                            strokeWidth={2}
                        />
                    </button>
                ))}
            </div>
            <span className="text-[12px] font-bold text-[#F26A1C] h-4">
                {label(active)}
            </span>
        </div>
    );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function ReviewPage() {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();

    const order = useCustomerOrderStore((s) =>
        s.orders.find((o) => o.id === orderId)
    );
    const fetchOrders = useCustomerOrderStore((s) => s.fetchCustomerOrders);

    const {
        restaurantRating, restaurantText,
        delivererRating, delivererText,
        isLoading, isSubmitted, error,
        setRestaurantRating, setRestaurantText,
        setDelivererRating, setDelivererText,
        submitReviews, reset,
    } = useReviewStore();

    const [dataReady, setDataReady] = useState(false);

    useEffect(() => {
        reset(); // fresh state on mount
        const load = async () => {
            if (!order) await fetchOrders();
            setTimeout(() => setDataReady(true), 250);
        };
        load();
    }, [orderId]);

    // ── Loading state ────────────────────────────────────────────────────────────
    if (!dataReady) {
        return (
            <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 p-5 flex flex-col gap-4">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-40 w-full rounded-2xl" />
                <Skeleton className="h-40 w-full rounded-2xl" />
                <Skeleton className="h-14 w-full rounded-2xl" />
            </div>
        );
    }

    // ── Not found ────────────────────────────────────────────────────────────────
    if (!order) {
        return (
            <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 flex flex-col items-center justify-center px-5 text-center">
                <AlertCircle size={48} className="text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Order Not Found</h2>
                <button
                    onClick={() => navigate(ROUTES.CUSTOMER.ORDERS.LIST)}
                    className="mt-4 bg-[#F26A1C] text-white px-8 py-3 rounded-full font-bold"
                >
                    Back to Orders
                </button>
            </div>
        );
    }

    const canSubmit =
        !isLoading && (restaurantRating > 0 || delivererRating > 0);

    const handleSubmit = async () => {
        await submitReviews({
            orderId: order.id,
            restaurantId: order.restaurantId,
            restaurantName: order.restaurantName,
            delivererName: order.deliverer?.name,
        });
    };

    // ── Submitted success screen ─────────────────────────────────────────────────
    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 flex flex-col items-center justify-center px-6 text-center">
                <div className="w-24 h-24 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={48} className="text-green-500" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                    Thank You! 🎉
                </h2>
                <p className="text-[14px] font-semibold text-gray-500 mb-8 max-w-xs leading-relaxed">
                    Your review helps us improve our service and supports the ASTU Eats community.
                </p>
                <button
                    onClick={() => {
                        reset();
                        navigate(ROUTES.CUSTOMER.ORDERS.LIST);
                    }}
                    className="w-full max-w-xs py-4 bg-[#F26A1C] text-white font-bold rounded-[20px] text-[15px] shadow-[0_8px_20px_rgba(242,106,28,0.25)] active:scale-[0.98] transition-transform"
                >
                    Back to My Orders
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 font-sans pb-32">

            {/* ── Header ── */}
            <header className="px-5 pt-6 pb-4 sticky top-0 bg-[#FDFDFD]/90 dark:bg-gray-950/90 backdrop-blur-md z-30 flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 bg-orange-50 dark:bg-gray-900 border border-orange-100 dark:border-gray-800 rounded-[14px] flex items-center justify-center text-[#F26A1C] active:scale-95 transition-transform"
                >
                    <ArrowLeft size={20} strokeWidth={2.5} />
                </button>
                <h1 className="text-[17px] font-black text-gray-900 dark:text-white">Leave a Review</h1>
                <div className="w-10" />
            </header>

            <main className="px-5 space-y-5">

                {/* ── Order summary pill ── */}
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900/50 px-4 py-2.5 rounded-[14px] border border-gray-100 dark:border-gray-800">
                    <span className="text-[12px] font-bold text-gray-500 dark:text-gray-400">Order</span>
                    <span className="text-[12px] font-black text-gray-900 dark:text-white">{order.shortId}</span>
                    <span className="ml-auto text-[12px] font-bold text-[#F26A1C]">
                        {order.totalAmount.toFixed(0)} ETB
                    </span>
                </div>

                {/* ── Restaurant Review Card ── */}
                <div className="bg-white dark:bg-gray-900 rounded-[22px] p-5 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-orange-50 dark:bg-gray-800 border border-orange-100 dark:border-gray-700 flex items-center justify-center overflow-hidden shrink-0">
                            {order.restaurantImageUrl ? (
                                <img
                                    src={order.restaurantImageUrl}
                                    alt={order.restaurantName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <ChefHat size={20} className="text-[#F26A1C]" />
                            )}
                        </div>
                        <div>
                            <h3 className="text-[14px] font-black text-gray-900 dark:text-white leading-tight">
                                {order.restaurantName}
                            </h3>
                            <p className="text-[11px] font-semibold text-[#F26A1C]">Restaurant</p>
                        </div>
                    </div>

                    {/* Stars */}
                    <StarInput value={restaurantRating} onChange={setRestaurantRating} />

                    {/* Textarea */}
                    <textarea
                        value={restaurantText}
                        onChange={(e) => setRestaurantText(e.target.value)}
                        placeholder="How was the food quality, packaging, and overall experience?"
                        rows={3}
                        className="w-full p-4 bg-[#FFF4ED] dark:bg-gray-800 rounded-[16px] text-[13px] font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-400 placeholder:font-medium focus:ring-1 focus:ring-[#F26A1C]/50 focus:outline-none resize-none"
                    />
                </div>

                {/* ── Deliverer Review Card (only if deliverer was assigned) ── */}
                {order.deliverer ? (
                    <div className="bg-white dark:bg-gray-900 rounded-[22px] p-5 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
                        {/* Header */}
                        <div className="flex items-center gap-3">
                            <img
                                src={order.deliverer.avatarUrl || FALLBACK_AVATAR}
                                alt={order.deliverer.name}
                                className="w-11 h-11 rounded-full object-cover border-2 border-orange-100 dark:border-gray-700 shrink-0"
                            />
                            <div>
                                <h3 className="text-[14px] font-black text-gray-900 dark:text-white leading-tight">
                                    {order.deliverer.name}
                                </h3>
                                <p className="text-[11px] font-semibold text-[#F26A1C]">
                                    Delivery Partner · ★ {order.deliverer.rating.toFixed(1)}
                                </p>
                            </div>
                        </div>

                        {/* Stars */}
                        <StarInput value={delivererRating} onChange={setDelivererRating} />

                        {/* Textarea */}
                        <textarea
                            value={delivererText}
                            onChange={(e) => setDelivererText(e.target.value)}
                            placeholder="How was the delivery speed, communication, and professionalism?"
                            rows={3}
                            className="w-full p-4 bg-[#FFF4ED] dark:bg-gray-800 rounded-[16px] text-[13px] font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-400 placeholder:font-medium focus:ring-1 focus:ring-[#F26A1C]/50 focus:outline-none resize-none"
                        />
                    </div>
                ) : (
                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-[18px] border border-gray-100 dark:border-gray-800">
                        <Bike size={20} className="text-gray-400 shrink-0" />
                        <p className="text-[13px] font-semibold text-gray-500 dark:text-gray-400">
                            No deliverer was assigned to this order.
                        </p>
                    </div>
                )}

                {/* ── Error ── */}
                {error && (
                    <p className="text-[13px] font-bold text-red-500 text-center">{error}</p>
                )}

                {/* ── Disclaimer ── */}
                <p className="text-[11px] font-semibold text-gray-400 text-center px-6 leading-relaxed">
                    Please submit genuine reviews. They help us improve the experience for everyone on ASTU Eats.
                </p>

                {/* ── Submit ── */}
                <button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className="w-full py-4 bg-[#F26A1C] disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 disabled:shadow-none text-white font-bold rounded-[20px] text-[15px] shadow-[0_8px_20px_rgba(242,106,28,0.25)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Submitting...
                        </>
                    ) : "Submit Review"}
                </button>

            </main>
        </div>
    );
}