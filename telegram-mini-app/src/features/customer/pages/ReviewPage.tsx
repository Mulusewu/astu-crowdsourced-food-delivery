import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Star, CheckCircle2, ChefHat, Bike, AlertCircle, X } from "lucide-react";

import { useReviewStore } from "@/store/reviewStore";
import { useCustomerOrderStore } from "@/store/orders/customerOrderStore";
import { ROUTES } from "@/routes/routePaths";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

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

    const label = (r: number) => ["Select Rating", "Poor experience", "Fair quality", "Good food", "Great service", "Excellent!"][r] ?? "";

    return (
        <div className="flex flex-col items-center gap-3 py-2">
            <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onChange(star)}
                        onMouseEnter={() => setHovered(star)}
                        onMouseLeave={() => setHovered(0)}
                        className="transition-all active:scale-90 hover:scale-110"
                    >
                        <Star
                            size={34}
                            className={cn(
                                "transition-all duration-300",
                                star <= active
                                    ? "text-[#F26A1C] fill-[#F26A1C] drop-shadow-[0_0_8px_rgba(242,106,28,0.3)]"
                                    : "text-orange-100 dark:text-gray-800",
                            )}
                            strokeWidth={1.5}
                        />
                    </button>
                ))}
            </div>
            <span className={cn(
                "text-[13px] font-bold transition-all duration-300 px-3 py-0.5 rounded-full",
                active > 0 ? "text-[#F26A1C] bg-orange-50 dark:bg-orange-950/20" : "text-gray-300 dark:text-gray-700"
            )}>
                {label(active)}
            </span>
        </div>
    );
}

const reviewSchema = z.object({
  restaurantRating: z.number(),
  restaurantText: z.string().trim().optional(),
  delivererRating: z.number(),
  delivererText: z.string().trim().optional(),
}).refine(data => data.restaurantRating > 0 || data.delivererRating > 0, {
  message: "Please provide at least one rating.",
});

type ReviewData = z.infer<typeof reviewSchema>;

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function ReviewPage() {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();

    const order = useCustomerOrderStore((s) =>
        s.orders.find((o) => o.id === orderId)
    );
    const fetchOrders = useCustomerOrderStore((s) => s.fetchCustomerOrders);

    const {
        submitReviews, 
        reset,
        isSubmitted,
        isLoading,
        error: storeError,
        setRestaurantRating,
        setRestaurantText,
        setDelivererRating,
        setDelivererText
    } = useReviewStore();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { isValid }
    } = useForm<ReviewData>({
        resolver: zodResolver(reviewSchema),
        mode: "onChange",
        defaultValues: {
            restaurantRating: 0,
            restaurantText: "",
            delivererRating: 0,
            delivererText: ""
        }
    });

    const [dataReady, setDataReady] = useState(false);

    const watchRestaurantRating = watch("restaurantRating");
    const watchDelivererRating = watch("delivererRating");

    useEffect(() => {
        reset(); 
        const load = async () => {
            if (!order) await fetchOrders();
            // Small delay for smooth entry
            setTimeout(() => setDataReady(true), 150);
        };
        load();
    }, [orderId, order, fetchOrders, reset]);

    // ── Loading state ────────────────────────────────────────────────────────────
    if (!dataReady) {
        return (
            <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 p-5 flex flex-col gap-4">
                <div className="flex justify-between items-center mb-2">
                    <Skeleton className="h-10 w-10 rounded-[14px]" />
                    <Skeleton className="h-6 w-32 rounded-lg" />
                    <Skeleton className="h-10 w-10 rounded-[14px]" />
                </div>
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-56 w-full rounded-[24px]" />
                <Skeleton className="h-56 w-full rounded-[24px]" />
                <Skeleton className="h-14 w-full rounded-2xl mt-auto" />
            </div>
        );
    }

    // ── Not found ────────────────────────────────────────────────────────────────
    if (!order) {
        return (
            <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 flex flex-col items-center justify-center px-5 text-center">
                <div className="w-20 h-20 bg-red-50 dark:bg-red-950/20 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle size={40} className="text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Order Not Found</h2>
                <p className="text-sm text-gray-500 mb-8">We couldn't find the order you're trying to review.</p>
                <button
                    type="button"
                    onClick={() => navigate(ROUTES.CUSTOMER.ORDERS.LIST)}
                    className="bg-[#F26A1C] text-white px-10 py-3.5 rounded-full font-bold shadow-lg shadow-orange-200 dark:shadow-none"
                >
                    Back to My Orders
                </button>
            </div>
        );
    }

    const onSubmit = async (data: ReviewData) => {
        // Sync local form state to global store before submission
        setRestaurantRating(data.restaurantRating);
        setRestaurantText(data.restaurantText || "");
        setDelivererRating(data.delivererRating);
        setDelivererText(data.delivererText || "");

        try {
            await submitReviews({
                orderId: order.id,
                restaurantId: order.restaurantId,
                restaurantName: order.restaurantName,
                delivererName: order.deliverer?.name,
            });
            toast.success("Review submitted!");
        } catch (err) {
            toast.error("Failed to submit review. Please try again.");
        }
    };

    // ── Submitted success screen ─────────────────────────────────────────────────
    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 flex flex-col items-center justify-center px-8 text-center animate-in fade-in duration-500">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full animate-pulse" />
                    <div className="relative w-28 h-28 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow-xl border-4 border-green-500">
                        <CheckCircle2 size={56} className="text-green-500" />
                    </div>
                </div>
                
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">
                    You're Awesome! 🎉
                </h2>
                <p className="text-[15px] font-medium text-gray-500 dark:text-gray-400 mb-10 max-w-[280px] leading-relaxed">
                    Your feedback helps {order.restaurantName} and the community grow.
                </p>
                
                <button
                    type="button"
                    onClick={() => {
                        reset();
                        navigate(ROUTES.CUSTOMER.ORDERS.LIST);
                    }}
                    className="w-full max-w-xs py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-[22px] text-[16px] shadow-xl active:scale-[0.98] transition-all"
                >
                    Back to My Orders
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 font-sans pb-32 overflow-x-hidden">

            {/* ── Header ── */}
            <header className="px-5 pt-6 pb-4 sticky top-0 bg-[#FDFDFD]/90 dark:bg-gray-950/90 backdrop-blur-md z-30 flex items-center justify-between border-b border-transparent dark:border-gray-900">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[14px] flex items-center justify-center text-gray-900 dark:text-white active:scale-95 transition-transform shadow-sm"
                >
                    <ArrowLeft size={20} strokeWidth={2.5} />
                </button>
                <div className="text-center">
                    <h1 className="text-[17px] font-black text-gray-900 dark:text-white leading-tight">Review Order</h1>
                    <p className="text-[11px] font-bold text-gray-400">#{order.shortId}</p>
                </div>
                <button
                    type="button"
                    onClick={() => navigate(ROUTES.CUSTOMER.ORDERS.LIST)}
                    className="w-10 h-10 bg-gray-50 dark:bg-gray-900 rounded-[14px] flex items-center justify-center text-gray-400 active:scale-95 transition-transform"
                    aria-label="Skip review"
                >
                    <X size={18} strokeWidth={2.5} />
                </button>
            </header>

            <main className="px-5 mt-4 space-y-6">

                {/* ── Restaurant Review Card ── */}
                <div className="bg-white dark:bg-gray-900 rounded-[28px] p-6 border border-gray-100 dark:border-gray-800 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-5 animate-in slide-in-from-bottom-4 duration-300">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-gray-800 border border-orange-100 dark:border-gray-700 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                            {order.restaurantImageUrl ? (
                                <img
                                    src={order.restaurantImageUrl}
                                    alt={order.restaurantName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <ChefHat size={28} className="text-[#F26A1C]" />
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="text-[11px] font-black uppercase tracking-wider text-[#F26A1C] mb-1">Restaurant</p>
                            <h3 className="text-[17px] font-black text-gray-900 dark:text-white leading-tight">
                                {order.restaurantName}
                            </h3>
                        </div>
                    </div>

                    <div className="h-[1px] w-full bg-gray-50 dark:bg-gray-800" />

                    <div className="text-center">
                        <p className="text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-2">How was the food?</p>
                        <StarInput value={watchRestaurantRating} onChange={(v) => setValue("restaurantRating", v, { shouldValidate: true })} />
                    </div>

                    <textarea
                        {...register("restaurantText")}
                        placeholder="Share your experience with the food..."
                        rows={3}
                        className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 rounded-[20px] text-[14px] font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-400 placeholder:font-medium focus:ring-2 focus:ring-orange-100 dark:focus:ring-[#F26A1C]/20 border-none outline-none resize-none transition-all"
                    />
                </div>

                {/* ── Deliverer Review Card ── */}
                {order.deliverer ? (
                    <div className="bg-white dark:bg-gray-900 rounded-[28px] p-6 border border-gray-100 dark:border-gray-800 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-5 animate-in slide-in-from-bottom-6 duration-400">
                        <div className="flex items-center gap-4">
                            <div className="relative shrink-0">
                                <img
                                    src={order.deliverer.avatarUrl || FALLBACK_AVATAR}
                                    alt={order.deliverer.name}
                                    className="w-14 h-14 rounded-2xl object-cover border border-orange-100 dark:border-gray-800 shadow-sm"
                                />
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-gray-950 rounded-full flex items-center justify-center">
                                    <Bike size={10} className="text-white" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <p className="text-[11px] font-black uppercase tracking-wider text-[#F26A1C] mb-1">Delivery Partner</p>
                                <h3 className="text-[17px] font-black text-gray-900 dark:text-white leading-tight">
                                    {order.deliverer.name}
                                </h3>
                                <p className="text-[11px] font-bold text-gray-400 mt-0.5">★ {order.deliverer.rating.toFixed(1)} Overall</p>
                            </div>
                        </div>

                        <div className="h-[1px] w-full bg-gray-50 dark:bg-gray-800" />

                        <div className="text-center">
                            <p className="text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-2">How was the delivery?</p>
                            <StarInput value={watchDelivererRating} onChange={(v) => setValue("delivererRating", v, { shouldValidate: true })} />
                        </div>

                        <textarea
                            {...register("delivererText")}
                            placeholder="Speed, attitude, communication..."
                            rows={3}
                            className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 rounded-[20px] text-[14px] font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-400 placeholder:font-medium focus:ring-2 focus:ring-orange-100 dark:focus:ring-[#F26A1C]/20 border-none outline-none resize-none transition-all"
                        />
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-3 bg-gray-50/50 dark:bg-gray-900/30 p-8 rounded-[28px] border border-dashed border-gray-200 dark:border-gray-800">
                        <Bike size={32} className="text-gray-300 dark:text-gray-700" />
                        <p className="text-[13px] font-bold text-gray-400 dark:text-gray-500 text-center">
                            Delivery service was not rated for this order.
                        </p>
                    </div>
                )}

                {/* ── Error ── */}
                {storeError && (
                    <div className="flex items-center gap-2 justify-center p-3 bg-red-50 dark:bg-red-950/20 rounded-xl text-red-500">
                        <AlertCircle size={16} />
                        <p className="text-[13px] font-bold">{storeError}</p>
                    </div>
                )}

                {/* ── Footer / Submit ── */}
                <div className="pt-4 pb-8">
                    <button
                        type="submit"
                        disabled={!isValid || isLoading}
                        className="w-full py-4 bg-[#F26A1C] disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:text-gray-400 disabled:shadow-none text-white font-black rounded-[24px] text-[16px] shadow-[0_12px_24px_rgba(242,106,28,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-3 relative overflow-hidden"
                    >
                        {isLoading ? (
                            <>
                                <span className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Submitting...</span>
                            </>
                        ) : (
                            <>
                                <span>Submit Review</span>
                                <Star size={18} className="fill-white" />
                            </>
                        )}
                    </button>
                    <p className="mt-4 text-[11px] font-bold text-gray-400 text-center px-8 leading-relaxed">
                        Your reviews are anonymous to the restaurant and deliverer.
                    </p>
                </div>

            </main>
        </form>
    );
}