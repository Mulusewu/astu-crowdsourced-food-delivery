import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Phone, Star, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRestaurantStore } from "@/store/restaurantStore";

// --- Mock Data Interfaces ---
interface Review {
    id: string;
    userName: string;
    userAvatar: string;
    rating: number;
    date: string;
    comment: string;
}

export default function RestaurantReviewsPage() {
    const navigate = useNavigate();
    const { restaurantId } = useParams<{ restaurantId: string }>();

    const {
        currentRestaurant: restaurant,
        isLoading,
        error,
        fetchRestaurantDetails,
    } = useRestaurantStore();

    useEffect(() => {
        if (restaurantId && (!restaurant || restaurant.id !== restaurantId)) {
            fetchRestaurantDetails(restaurantId);
        }
    }, [restaurantId, restaurant, fetchRestaurantDetails]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#F26A1C] mb-4" />
                <p className="text-gray-500 font-bold text-sm">Loading Reviews...</p>
            </div>
        );
    }

    if (error || !restaurant) {
        return (
            <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 flex flex-col items-center justify-center px-5 text-center">
                <AlertCircle size={48} className="text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Not Found</h2>
                <p className="text-gray-500 font-medium mb-8 text-sm">
                    {error || "Restaurant details could not be loaded."}
                </p>
                <button
                    onClick={() => navigate(-1)}
                    className="bg-[#F26A1C] text-white font-bold py-3 px-8 rounded-full active:scale-95 transition-transform"
                >
                    Go Back
                </button>
            </div>
        );
    }

    // Since we don't have real distribution data in the store, we generate a mock distribution based on the rating
    const ratingSummary = {
        overall: restaurant.rating,
        totalRatings: restaurant.reviews,
        totalReviewsText: `${restaurant.reviews} Reviews`,
        distribution: [
            { stars: 5, percentage: Math.round(restaurant.rating >= 4.5 ? 65 : 40) },
            { stars: 4, percentage: Math.round(restaurant.rating >= 4.0 ? 20 : 30) },
            { stars: 3, percentage: 10 },
            { stars: 2, percentage: 3 },
            { stars: 1, percentage: 2 },
        ]
    };

    const mockReviews: Review[] = Array(3).fill({
        id: "rev_1",
        userName: "Gray Johnson",
        userAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&fit=crop",
        rating: Math.floor(restaurant.rating),
        date: "Oct 20, 2026",
        comment: "I Am Very Satisfied By Their Service And Definitely Recommend You To Check Them Out"
    }).map((rev, index) => ({ ...rev, id: `rev_${index}` }));

    return (
        <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 font-sans pb-10">

            {/* ── Header ── */}
            <header className="px-5 pt-6 pb-4 flex items-center justify-between sticky top-0 bg-[#FDFDFD]/90 dark:bg-gray-950/90 backdrop-blur-md z-30">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 bg-orange-50 dark:bg-gray-900 border border-orange-100 dark:border-gray-800 rounded-[14px] flex items-center justify-center text-[#F26A1C] active:scale-95 transition-transform"
                >
                    <ArrowLeft size={20} strokeWidth={2.5} />
                </button>
                <h1 className="text-[19px] font-black text-gray-900 dark:text-white">Reviews</h1>
                <div className="w-10" /> {/* Spacer for centering */}
            </header>

            <main className="px-5">

                {/* ── Restaurant Info Card ── */}
                <div className="bg-white dark:bg-gray-900 rounded-[24px] p-3 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none dark:border dark:border-gray-800 mb-6">
                    <div className="flex items-center gap-3">
                        <img
                            src={restaurant.image}
                            alt={restaurant.name}
                            className="w-14 h-14 rounded-xl object-cover"
                        />
                        <div>
                            <h2 className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight">
                                {restaurant.name}
                            </h2>
                            <p className="text-[13px] font-medium text-gray-500 mt-0.5">
                                {restaurant.location}
                            </p>
                        </div>
                    </div>
                    {restaurant.contact?.phone && (
                        <a
                            href={`tel:${restaurant.contact.phone}`}
                            className="w-11 h-11 rounded-[14px] border border-gray-100 dark:border-gray-700 flex items-center justify-center text-[#F26A1C] active:scale-95 transition-transform mr-1"
                        >
                            <Phone size={20} strokeWidth={2} />
                        </a>
                    )}
                </div>

                {/* ── Rating Summary Card ── */}
                <div className="bg-white dark:bg-gray-900 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none dark:border dark:border-gray-800 mb-8">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-black text-gray-900 dark:text-white leading-none">
                                {ratingSummary.overall}
                            </span>
                            <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                                Out Of 5
                            </span>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-0.5 mb-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={16}
                                        className={cn(
                                            star <= Math.round(ratingSummary.overall)
                                                ? "fill-[#F26A1C] text-[#F26A1C]"
                                                : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                                        )}
                                    />
                                ))}
                            </div>
                            <span className="text-[11px] font-medium text-gray-500">
                                {ratingSummary.totalRatings} Ratings
                            </span>
                        </div>
                    </div>

                    {/* Distribution Bars */}
                    <div className="space-y-2.5">
                        {ratingSummary.distribution.map((dist) => (
                            <div key={dist.stars} className="flex items-center gap-3">
                                <div className="flex items-center gap-1 w-6 shrink-0">
                                    <span className="text-[13px] font-bold text-gray-900 dark:text-white leading-none">
                                        {dist.stars}
                                    </span>
                                    <Star size={12} className="fill-[#F26A1C] text-[#F26A1C]" />
                                </div>

                                {/* Progress Bar Track */}
                                <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#F26A1C] rounded-full"
                                        style={{ width: `${dist.percentage}%` }}
                                    />
                                </div>

                                <span className="text-[12px] font-medium text-gray-500 w-8 text-right shrink-0">
                                    {dist.percentage}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Reviews List Header ── */}
                <div className="flex justify-between items-center mb-6 px-1">
                    <h3 className="text-[14px] font-medium text-gray-500">
                        {ratingSummary.totalReviewsText}
                    </h3>
                    <button
                        onClick={() => navigate(`/customer/review/restaurant/${restaurantId || 'rest_001'}`)}
                        className="text-[14px] font-medium text-gray-500 active:opacity-70 transition-opacity"
                    >
                        Write A Review
                    </button>
                </div>

                {/* ── Reviews List ── */}
                <div className="space-y-5">
                    {mockReviews.map((review, idx) => (
                        <div
                            key={review.id}
                            className={cn(
                                "pb-5",
                                idx !== mockReviews.length - 1 && "border-b border-gray-100 dark:border-gray-800"
                            )}
                        >
                            <div className="flex gap-4">
                                <img
                                    src={review.userAvatar}
                                    alt={review.userName}
                                    className="w-12 h-12 rounded-full object-cover shrink-0 border border-gray-100 dark:border-gray-800"
                                />
                                <div>
                                    <h4 className="text-[14px] font-bold text-gray-900 dark:text-white mb-1">
                                        {review.userName}
                                    </h4>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex items-center gap-0.5">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    size={12}
                                                    className={cn(
                                                        star <= review.rating
                                                            ? "fill-[#F26A1C] text-[#F26A1C]"
                                                            : "fill-gray-200 text-gray-200"
                                                    )}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-[11px] font-medium text-gray-500 uppercase">
                                            {review.rating} Out Of 5, {review.date}
                                        </span>
                                    </div>
                                    <p className="text-[13px] font-bold text-gray-800 dark:text-gray-300 leading-snug">
                                        {review.comment}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </main>
        </div>
    );
}