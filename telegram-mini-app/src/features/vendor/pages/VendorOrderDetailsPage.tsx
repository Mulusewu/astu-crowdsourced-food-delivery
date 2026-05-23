import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, AlertTriangle } from "lucide-react";
import { useVendorStore } from "@/store/vendorStore";
import { toast } from "sonner";
import { ROUTES, buildRoute } from "@/routes/routePaths";

export default function VendorOrderDetailsPage() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { availableOrders, activeOrders, acceptOrder, declineOrder, fetchVendorData } = useVendorStore();

    useEffect(() => {
        fetchVendorData();
    }, [fetchVendorData]);

    const order = availableOrders.find(o => o.id === orderId);
    const alreadyActive = activeOrders.find(o => o.id === orderId);

    // If it's already active, redirect to the status tracker
    useEffect(() => {
        if (alreadyActive) {
            navigate(buildRoute(ROUTES.VENDOR.ORDERS.ACTIVE_STATUS, { orderId: alreadyActive.id }));
        }
    }, [alreadyActive, navigate]);

    // If order is not found in "available", it might have been accepted already or declined.
    if (!order && !alreadyActive) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 text-center">
                <p className="font-bold text-gray-500 mb-4">Order no longer available.</p>
                <button onClick={() => navigate(-1)} className="text-[#F26A1C] font-bold">Go Back</button>
            </div>
        );
    }
    
    if (alreadyActive) return null; // Avoid flicker before navigation
    if (!order) return null; // Satisfy TypeScript null check

    const handleAccept = () => {
        acceptOrder(order.id);
        toast.success(`Order #${order.shortId} Accepted!`, { description: "Moved to Active Orders." });
        navigate(buildRoute(ROUTES.VENDOR.ORDERS.ACTIVE_STATUS, { orderId: order.id }));
    };

    const handleDecline = () => {
        // In production, trigger a modal asking for a reason first.
        if (confirm("Are you sure you want to decline this order?")) {
            declineOrder(order.id);
            toast.error(`Order #${order.shortId} Declined`);
            navigate(-1);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans pb-32 w-full max-w-md mx-auto">
            {/* ── Header ── */}
            <header className="px-5 pt-6 pb-4 flex items-center justify-between sticky top-0 bg-gray-50/90 dark:bg-gray-950/90 backdrop-blur-md z-30 border-b border-gray-200 dark:border-gray-800">
                <button onClick={() => navigate(-1)} className="w-10 h-10 border border-orange-200 rounded-[14px] flex items-center justify-center text-[#F26A1C] active:scale-95 transition-transform bg-white">
                    <ArrowLeft size={20} strokeWidth={2.5} />
                </button>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <span className="text-[#F26A1C] font-black">☰</span>
                    </div>
                    <h1 className="text-[18px] font-black text-gray-900 dark:text-white">Order #{order.shortId}</h1>
                </div>
                <div className="w-10" />
            </header>

            <main className="px-5 pt-6 space-y-4">
                {order.items.map((item, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-900 rounded-[24px] p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-gray-800 flex gap-4 relative">
                        <button className="absolute top-4 right-4 text-[10px] font-bold text-[#F26A1C] flex items-center gap-1 active:opacity-60">
                            <AlertTriangle size={12} /> Out Of Stock?
                        </button>

                        <img src={item.image} alt={item.name} className="w-[70px] h-[70px] rounded-full object-cover border border-gray-100" />
                        <div className="flex flex-col pt-1">
                            <h3 className="font-bold text-[15px] text-gray-900 dark:text-white leading-tight mb-1">
                                {item.name} <span className="text-gray-400 text-[12px]">(X{item.qty})</span>
                            </h3>
                            <p className="font-bold text-[13px] text-gray-700 mb-2">{item.price} ETB</p>
                            <div className="flex items-center gap-1 text-gray-500 text-[11px] font-semibold">
                                <MapPin size={12} className="text-[#F26A1C]" /> {order.customerLocation}
                            </div>
                        </div>
                    </div>
                ))}
            </main>

            {/* ── Fixed Footer Action ── */}
            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 p-6 border-t border-gray-100 dark:border-gray-800 max-w-md mx-auto rounded-t-[32px] shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-center mb-6 px-2">
                    <span className="font-black text-[16px] text-gray-900 dark:text-white">Sub Total</span>
                    <span className="font-black text-[16px] text-[#F26A1C]">{order.totalPrice} ETB</span>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={handleAccept}
                        className="flex-1 py-4 bg-[#F26A1C] text-white font-black rounded-full text-[15px] shadow-[0_8px_20px_rgba(242,106,28,0.25)] active:scale-95 transition-transform"
                    >
                        Accept
                    </button>
                    <button
                        onClick={handleDecline}
                        className="flex-1 py-4 border-[2px] border-[#F26A1C] text-[#F26A1C] bg-white font-black rounded-full text-[15px] active:scale-95 transition-transform"
                    >
                        Decline
                    </button>
                </div>
            </div>
        </div>
    );
}