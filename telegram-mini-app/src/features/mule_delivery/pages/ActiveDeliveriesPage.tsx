import { useEffect } from "react";
import { ArrowLeft, Phone, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOrderStore } from "@/store/orders/orderStore";
import { ROUTES, buildRoute } from "@/routes/routePaths";

// Helper for exact date formatting "03 June 2026"
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
};

const statusMap: Record<string, string> = {
    AWAITING_ACCEPT: "Waiting",
    ASSIGNED: "Assigned",
    VENDOR_BEING_PREPARED: "Preparing",
    VENDOR_FINISHED: "Ready",
    VENDOR_READY_FOR_PICKUP: "Ready for Pickup",
    PICKED_UP: "Picked Up",
    EN_ROUTE: "En Route",
    ARRIVED: "Arrived",
    RECEIVED: "Received",
    DELIVERED: "Delivered",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    DISPUTED: "Disputed",
};

export default function ActiveDeliveriesPage() {
    const navigate = useNavigate();
    const { activeOrders, fetchActiveOrders, isLoading } = useOrderStore();

    // Fetch active orders when the component mounts
    useEffect(() => {
        fetchActiveOrders();
    }, [fetchActiveOrders]);

    return (
        <div className="flex flex-col bg-[#FDFDFD] dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 min-h-screen">
            {/* Header */}
            <header className="px-5 pt-[max(2.5rem,env(safe-area-inset-top))] pb-8">
                <div className="relative flex items-center justify-center h-12">
                    <button
                        onClick={() => navigate(ROUTES.DELIVERY.DASHBOARD)}
                        className="absolute left-0 top-1/2 -translate-y-1/2 flex h-[42px] w-[42px] items-center justify-center rounded-[14px] bg-[#FFEFE5] dark:bg-orange-950/30 text-[#F26A1C] transition hover:bg-orange-200 dark:hover:bg-orange-900/50 active:scale-95"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="h-6 w-6" strokeWidth={2} />
                    </button>
                    <h1 className="text-[26px] font-black text-black dark:text-white tracking-tight">
                        Active Orders
                    </h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 px-5">
                <div className="flex flex-col gap-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <Truck size={48} className="animate-pulse text-gray-300 mb-4" />
                            <p className="text-gray-500 font-medium">Loading active deliveries...</p>
                        </div>
                    ) : activeOrders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center bg-orange-50/30 dark:bg-orange-900/10 rounded-[32px] border border-dashed border-orange-100 dark:border-orange-900/30">
                            <div className="w-16 h-16 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow-sm mb-4">
                                <Truck size={32} className="text-orange-200 dark:text-orange-800" />
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 font-bold text-lg">No active deliveries</p>
                            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Accept an order from the dashboard to get started.</p>
                        </div>
                    ) : (
                        activeOrders.map((order) => (
                            <div
                                key={order.id}
                                onClick={() => navigate(buildRoute(ROUTES.DELIVERY.ACTIVE.DETAILS, { orderId: order.id }))}
                                className="w-full rounded-[24px] border border-gray-100/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] cursor-pointer active:scale-[0.98] transition-all"
                            >
                                {/* Date & Time */}
                                <div className="flex items-center justify-between pb-[10px]">
                                    <span className="text-[14px] font-medium text-[#F26A1C]">
                                        {formatDate(order.createdAt)}
                                    </span>
                                    <span className="text-[15px] font-bold text-[#00A859]">
                                        {order.estimatedDeliveryTime || "Ready"}
                                    </span>
                                </div>
                                <div className="h-[1px] w-full bg-gray-100 dark:bg-gray-800 mb-[12px]" />

                                {/* Order Number & Status */}
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[16px] font-black tracking-tight text-[#F26A1C]">
                                        Order #{order.shortId}
                                    </span>
                                    <div className="flex items-center gap-[6px] text-gray-900 dark:text-gray-100">
                                        <Truck size={15} strokeWidth={1.5} className="text-gray-700 dark:text-gray-400" />
                                        <span className="text-[14px] font-medium text-black dark:text-white">
                                            {statusMap[order.status] || order.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Items List */}
                                <div className="flex flex-col">
                                    {order.items.map((item, index) => (
                                        <div key={item.id || index} className="flex flex-col">
                                            <div className="flex items-center py-[10px] text-[14px] font-medium text-black dark:text-white">
                                                <span className="flex-1">{item.name}</span>
                                                <span className="w-16 text-center">{item.quantity} Pcs</span>
                                                <span className="w-20 text-right">{item.unitPrice} Birr</span>
                                            </div>
                                            {/* Divider except after last item */}
                                            {index < order.items.length - 1 && (
                                                <div className="h-[1px] w-full bg-gray-100 dark:bg-gray-800" />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Phone & Total */}
                                <div className="mt-3 flex items-center justify-between py-2">
                                    <div className="flex items-center gap-1.5">
                                        <Phone size={16} strokeWidth={2.5} className="text-[#F26A1C] fill-[#F26A1C]" />
                                        <span className="text-[15px] font-medium text-[#F26A1C]">
                                            {order.customer?.phoneNumber || "N/A"}
                                        </span>
                                    </div>
                                    <div className="text-[15px]">
                                        <span className="font-bold text-black dark:text-white mr-2">Total</span>
                                        <span className="font-black text-black dark:text-white">{order.totalAmount} Birr</span>
                                    </div>
                                </div>


                                {/* Action Button */}
                                <div className="mt-[20px] flex flex-col gap-3 pb-2 sm:flex-row sm:justify-center">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                buildRoute(ROUTES.DELIVERY.ACTIVE.DETAILS, {
                                                    orderId: order.id,
                                                }),
                                            )
                                        }
                                        className="rounded-full bg-[#F26A1C] px-8 py-[8px] text-[15px] font-semibold text-white transition active:scale-95"
                                    >
                                        View Details
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                buildRoute(ROUTES.DELIVERY.ACTIVE.TRACK, {
                                                    orderId: order.id,
                                                }),
                                            )
                                        }
                                        className="rounded-full border-[1.5px] border-[#F26A1C]/60 bg-white dark:bg-gray-950 px-8 py-[6px] text-[15px] font-medium text-[#F26A1C] transition hover:bg-orange-50 dark:hover:bg-orange-900/20 active:scale-95"
                                    >
                                        Track
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                buildRoute(ROUTES.DELIVERY.COMMUNICATION.REPORT, {
                                                    orderId: order.id,
                                                }),
                                            )
                                        }
                                        className="rounded-full border-[1.5px] border-[#F26A1C]/60 bg-white dark:bg-gray-950 px-8 py-[6px] text-[15px] font-medium text-[#F26A1C] transition hover:bg-orange-50 dark:hover:bg-orange-900/20 active:scale-95"
                                    >
                                        Report Issue
                                    </button>
                                </div>

                            </div>
                        ))
                    )}
                </div>
            </main>

        </div>
    );
}

