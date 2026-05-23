import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import { useVendorStore } from "@/store/vendorStore";
import { cn } from "@/lib/utils";

export default function VendorOrderStatusPage() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { activeOrders, updateOrderStatus, fetchVendorData, isLoading } = useVendorStore();

    useEffect(() => {
        fetchVendorData();
    }, [fetchVendorData]);

    const order = activeOrders.find(o => o.id === orderId);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 text-center">
                 <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F26A1C] mb-4" />
                 <p className="text-gray-500 font-bold">Loading Order Status...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 text-center">
                <p className="font-bold text-gray-500 mb-4">Order not found in active queue.</p>
                <button onClick={() => navigate(-1)} className="text-[#F26A1C] font-bold">Go Back</button>
            </div>
        );
    }

    const STATUSES = ["ACCEPTED", "PREPARING", "READY", "PICKED_UP"] as const;

    // Custom display mapping to match design text
    const displayMap: Record<string, string> = {
        ACCEPTED: "Confirmed",
        PREPARING: "Preparing",
        READY: "Ready For Pickup",
        PICKED_UP: "Picked Up"
    };

    const currentIndex = STATUSES.indexOf(order.status as any);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans pb-32 w-full max-w-md mx-auto">
            <header className="px-5 pt-6 pb-4 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="w-10 h-10 border border-orange-200 rounded-[14px] flex items-center justify-center text-[#F26A1C] bg-white active:scale-95">
                    <ArrowLeft size={20} strokeWidth={2.5} />
                </button>
                <h1 className="text-[18px] font-black text-gray-900 dark:text-white">Order Status</h1>
                <div className="w-10" />
            </header>

            <main className="px-5 pt-4">
                <div className="bg-white dark:bg-gray-900 rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-gray-800">

                    {/* Info Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="font-black text-[16px] text-gray-900 dark:text-white mb-2">Helen Cafe</h2>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                                    <span className="text-[#F26A1C] font-black text-lg">🍔</span>
                                </div>
                                <div>
                                    <p className="font-bold text-[14px] text-gray-900">{order.items.reduce((a, b) => a + b.qty, 0)} Items</p>
                                    <p className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                                        <Clock size={12} /> {order.timeElapsed}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[12px] font-bold text-gray-400 mb-1">Order #{order.shortId}</p>
                            <p className="font-black text-[18px] text-[#F26A1C]">{order.totalPrice} Birr</p>
                        </div>
                    </div>

                    <div className="w-full h-px bg-gray-100 dark:bg-gray-800 mb-6" />

                    {/* Tracker Grid (2 Columns as per design) */}
                    <div className="grid grid-cols-2 gap-y-6">
                        {STATUSES.map((status, idx) => {
                            const isPast = idx < currentIndex;
                            const isActive = idx === currentIndex;
                            const label = displayMap[status];

                            return (
                                <div
                                    key={status}
                                    onClick={() => updateOrderStatus(order.id, status)}
                                    className="flex items-center gap-3 cursor-pointer group"
                                >
                                    {/* Custom Radio Button */}
                                    <div className={cn(
                                        "w-5 h-5 rounded-full border-[2px] flex items-center justify-center transition-all",
                                        isActive || isPast ? "border-[#F26A1C]" : "border-gray-300"
                                    )}>
                                        {(isActive || isPast) && <div className="w-2.5 h-2.5 bg-[#F26A1C] rounded-full" />}
                                    </div>
                                    <span className={cn(
                                        "text-[13px] font-bold transition-all",
                                        isActive || isPast ? "text-gray-900 dark:text-white" : "text-gray-400",
                                        isActive && "text-[#F26A1C] underline underline-offset-4 decoration-2" // Highlight active state heavily as requested
                                    )}>
                                        {label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </main>
        </div>
    );
}