import React from "react";
import { useNavigate } from "react-router-dom";
import BottomNavBar from "../../customer/components/BottomNavBar";
import localDb from "@/lib/localDb.json";

const HISTORY_DATA = localDb.orders;

const HistoryPage: React.FC = () => {
  const navigate = useNavigate();

  // UX Improvement: Dynamic Stars renderer
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <svg 
        key={index} 
        className={`w-4 h-4 ${index < rating ? 'text-[#F46424] fill-[#F46424]' : 'text-gray-300 fill-transparent'}`} 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth="1.5"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.898 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.518-4.674z" />
      </svg>
    ));
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-24 flex justify-center">
      <div className="w-full max-w-[420px] bg-[#FAFAFA] min-h-screen relative shadow-sm font-sans flex flex-col">
        
        {/* Header (Functional Back Button) */}
        <div className="px-4 pt-6 pb-4 flex items-center relative bg-white sticky top-0 z-40 shadow-sm border-b border-gray-100">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-[#F46424] hover:bg-orange-100 transition-colors shadow-sm active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-2xl font-extrabold text-gray-900 absolute left-1/2 -translate-x-1/2">
            History
          </h1>
        </div>

        {/* List mapping */}
        <div className="flex-1 overflow-y-auto px-4 pt-6 pb-8 space-y-6">
          {HISTORY_DATA.map((order) => (
            <div key={order.id} className="relative group perspective">
              
              {/* Main Card */}
              <div className="bg-white rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/50 flex flex-col transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] cursor-pointer">
                
                {/* Top Row: Name // Order # */}
                <div className="flex justify-between items-center">
                  <h2 className="font-extrabold text-gray-900 text-base">{order.restaurantName}</h2>
                  <span className="text-gray-400 text-xs font-semibold">{order.orderNo}</span>
                </div>

                {/* Middle Row: Image // Detail // Price */}
                <div className="flex mt-4 gap-3 items-center">
                  
                  {/* Image Render Logic (Grid vs Single) */}
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-gray-50 flex items-center justify-center bg-gray-50">
                    {order.items.images.length > 1 ? (
                      <div className="grid grid-cols-2 gap-0.5 w-full h-full p-0.5">
                        {order.items.images.map((img, i) => (
                          <img key={i} src={img} alt="item" className="w-full h-full object-cover rounded-sm" />
                        ))}
                      </div>
                    ) : (
                      <img src={order.items.images[0]} alt="item" className="w-full h-full object-cover" />
                    )}
                  </div>

                  <div className="flex flex-col justify-center">
                    <h3 className="font-bold text-gray-900 text-sm leading-tight">{order.items.name}</h3>
                    <p className="text-gray-400 text-[11px] font-medium mt-0.5">{order.items.qty}</p>
                  </div>

                  <div className="ml-auto flex items-center">
                    <p className="font-extrabold text-[#F46424] text-sm">{order.price}</p>
                  </div>
                </div>

                {/* Bottom Row: Stars // Status Badge */}
                <div className="flex justify-between items-end mt-4">
                  <div className="flex gap-1">
                    {order.status === 'Delivered' ? (
                      renderStars(order.rating)
                    ) : (
                      <span className="text-gray-400 text-xs font-semibold italic">Refunded/Void</span>
                    )}
                  </div>

                  <div 
                    className={`px-4 py-1.5 rounded-xl text-white font-bold text-xs shadow-sm transition-transform active:scale-95 ${
                      order.status === 'Delivered' 
                        ? 'bg-[#10B981] hover:bg-[#059669]' 
                        : 'bg-[#EF4444] hover:bg-[#DC2626]'
                    }`}
                  >
                    {order.status}
                  </div>
                </div>
              </div>
              
              {/* Faint Decorative Divider matching Figma structure */}
              {order.id !== HISTORY_DATA[HISTORY_DATA.length - 1].id && (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[70%] h-[2px] bg-orange-100/60 rounded-full"></div>
              )}
            </div>
          ))}
        </div>

        <BottomNavBar activeTab="history" bgColor="bg-[#FAFAFA]" />
      </div>
    </div>
  );
};

export default HistoryPage;