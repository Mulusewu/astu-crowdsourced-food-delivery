import React, { useState, useEffect } from "react";
import { ArrowLeft, MapPin, CheckCircle2, Star, Mail, Bookmark } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import db from "@/data/database.json";
import { useVendorStore } from "@/store/vendorStore";
import { useSavedItemsStore } from "@/store/savedItemsStore";

export default function OrderDetailsPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { activeOrders, declineOrder } = useVendorStore();
  const order = activeOrders.find(o => o.id === orderId);
  
  const [isDeclining, setIsDeclining] = useState(false);
  const [showDeclineMsg, setShowDeclineMsg] = useState(false);
  const { toggleItem, isSaved } = useSavedItemsStore();
  
  // Use data from store to stay perfectly synced with dashboard
  const orderNumber = order?.orderNo || "123";
  const deliveryLocation = "Male Dorm B 321 R54";
  
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    try {
      const rawOrderItems = (db as any).vendorDashboard?.orderDetails?.[orderId || "o1"] || [];
      const menuItems = (db as any).vendorDashboard?.menuItems || [];

      const initialItems = rawOrderItems.map((orderItem: any) => {
        const menuItem = menuItems.find((m: any) => m.id === orderItem.id);
        return {
          ...orderItem,
          name: menuItem?.name || "Unknown Item",
          price: menuItem?.price || 0,
          image: menuItem?.image || ""
        };
      });
      setItems(initialItems);
    } catch (err) {
      console.error("Error initializing order items:", err);
    }
  }, [orderId]);


  const toggleOutOfStock = (itemId: string) => {
    setItems(prevItems => prevItems.map(item => 
      item.id === itemId ? { ...item, outOfStock: !item.outOfStock } : item
    ));
  };

  const subTotal = (items || [])
    .filter((item: any) => item && !item.outOfStock)
    .reduce((sum: number, item: any) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 0;
      return sum + (price * qty);
    }, 0);

  return (
    <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center px-4 py-4 bg-white sticky top-0 z-10 shadow-sm">
        <button 
          onClick={() => navigate("/vendor/dashboard")}
          className="flex items-center justify-center w-10 h-10 rounded-xl border-2 border-orange-200 text-orange-500 hover:bg-orange-50 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 flex items-center justify-center gap-2 pr-10">
          <span className="text-2xl">🍔</span>
          <h1 className="text-2xl font-extrabold text-black">Order #{orderNumber}</h1>
        </div>
      </div>

      {/* Content - Items List */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-48 flex flex-col gap-4">
        {items.map((item) => (
          <div 
            key={item.id} 
            className={`bg-white rounded-[24px] p-3 shadow-sm border ${item.outOfStock ? 'border-orange-200 bg-orange-50/30' : 'border-gray-100'} flex relative`}
          >
            {/* Out Of Stock Toggle */}
            <div className="absolute top-3 right-4 flex items-center gap-1 cursor-pointer z-10" onClick={() => toggleOutOfStock(item.id)}>
              <div className="relative flex items-center justify-center">
                {item.outOfStock ? (
                  <CheckCircle2 className="w-4 h-4 text-orange-500" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-orange-500 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-orange-500 font-semibold">Out Of Stock?</span>
            </div>

            {/* Circular Image and Save Icon */}
            <div className="w-20 h-20 shrink-0 mr-4 mt-2 relative">
              <img 
                src={item.image} 
                alt={item.name} 
                className={`w-full h-full object-cover rounded-full shadow-md border-2 border-white ${item.outOfStock ? 'opacity-50 grayscale' : ''}`}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    category: "Main Dish"
                  });
                }}
                className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-90 ${
                  isSaved(item.id) 
                    ? "bg-orange-500 text-white" 
                    : "bg-white text-gray-400 border border-gray-100"
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved(item.id) ? "fill-white" : ""}`} />
              </button>
            </div>

            {/* Details */}
            <div className="flex flex-col justify-center pt-5 pb-1 w-full">
              <h3 className={`font-bold text-gray-900 leading-tight ${item.outOfStock ? 'line-through text-gray-400' : ''}`}>
                {item.name}(X{item.quantity})
              </h3>
              <p className="text-sm font-semibold text-gray-800 my-1">{item.price} ETB</p>
              <div className="flex items-center gap-1 text-gray-500 mt-auto">
                <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
                <span className="text-[11px] font-medium truncate">{deliveryLocation}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fixed Bottom Action Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.08)] px-6 py-6 pb-8 z-20">
        {/* Sub Total */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
          <span className="text-lg font-bold text-black">Sub Total</span>
          <span className="text-lg font-semibold text-orange-500">{subTotal} ETB</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button 
            onClick={() => {
              try {
                if (!orderId) throw new Error("Order ID is missing");
                
                // Update status to preparing and move to the integrated tracking list
                const { updateOrderStatus } = useVendorStore.getState();
                updateOrderStatus(orderId, "preparing");
                
                navigate("/vendor/orders");
              } catch (err) {
                console.error("Accept button click error:", err);
                navigate("/vendor/orders");
              }
            }}
            className="flex-1 bg-orange-500 text-white font-bold py-3.5 rounded-full shadow-lg shadow-orange-200 hover:bg-orange-600 active:scale-95 transition-all text-base"
          >
            Accept
          </button>
          <button 
            onClick={() => {
              setIsDeclining(true);
              setShowDeclineMsg(true);
              
              // Remove from store and navigate back after 2s
              setTimeout(() => {
                if (orderId) declineOrder(orderId);
                navigate("/vendor/dashboard");
              }, 2000);
            }}
            disabled={isDeclining}
            className={`flex-1 ${isDeclining ? 'opacity-50 grayscale' : ''} bg-white text-orange-500 font-bold py-3.5 rounded-full border-2 border-orange-300 hover:bg-orange-50 active:scale-95 transition-all text-base relative overflow-hidden`}
          >
            {isDeclining ? "Declining..." : "Decline"}
          </button>
        </div>

        {/* Decline Notification Toast */}
        <div className={`fixed top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-4 rounded-3xl shadow-2xl flex flex-col gap-1 z-[100] transition-all duration-500 w-[90%] max-w-sm ${showDeclineMsg ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-10 scale-95 pointer-events-none'}`}>
           <div className="flex items-center gap-2 text-orange-400 font-bold text-sm">
             <Star className="w-4 h-4 fill-orange-400" />
             ORDER DECLINED
           </div>
           <p className="text-xs text-gray-300 leading-relaxed">
             Customer notified. Suggestion sent: "Please place another order in another restaurant."
           </p>
        </div>
      </div>
    </div>
  );
}
