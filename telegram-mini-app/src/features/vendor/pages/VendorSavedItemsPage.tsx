import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Trash2 } from "lucide-react";

interface SavedItem {
  id: string;
  orderNo: string;
  location: string;
  image: string;
}

export default function VendorSavedItemsPage() {
  const navigate = useNavigate();
  
  const [savedItems, setSavedItems] = useState<SavedItem[]>([
    { 
      id: "1", 
      orderNo: "123", 
      location: "Men's Dorm Block 368", 
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80" 
    },
    { 
      id: "2", 
      orderNo: "234", 
      location: "Men's Dorm Block 355", 
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80" 
    },
    { 
      id: "3", 
      orderNo: "456", 
      location: "Men's Dorm Block 343", 
      image: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=400&q=80" 
    },
    { 
      id: "4", 
      orderNo: "467", 
      location: "Female's Dorm Block 251", 
      image: "https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?w=400&q=80" 
    },
    { 
      id: "5", 
      orderNo: "789", 
      location: "Men's Dorm Block 368", 
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80" 
    },
  ]);

  const removeSavedItem = (id: string) => {
    setSavedItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-outfit max-w-md mx-auto relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center px-4 py-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-10 h-10 rounded-xl border-2 border-orange-200 text-orange-500 hover:bg-orange-50 transition-all active:scale-95 shadow-sm"
        >
          <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
        </button>
        <div className="flex-1 text-center pr-10">
          <h1 className="text-2xl font-black text-black tracking-tight">Saved Items</h1>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 px-4 space-y-4 pb-32 overflow-y-auto">
        {savedItems.map((item, index) => (
          <div key={item.id} className="group">
            <div className="bg-white rounded-[28px] p-4 flex items-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-50 transition-all active:scale-[0.98]">
              {/* Image */}
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm flex-shrink-0">
                <img 
                  src={item.image} 
                  alt={`Order ${item.orderNo}`} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-black text-gray-900 tracking-tight">
                  Order #{item.orderNo}
                </h3>
                <div className="flex items-center mt-1 text-orange-500">
                  <MapPin className="w-3.5 h-3.5 mr-1 fill-current" />
                  <span className="text-[11px] font-bold tracking-tight text-gray-500">
                    {item.location}
                  </span>
                </div>
              </div>

              {/* Action */}
              <button 
                onClick={() => removeSavedItem(item.id)}
                className="w-10 h-10 flex items-center justify-center text-orange-500 hover:bg-orange-50 rounded-full transition-colors active:scale-90"
              >
                <Trash2 className="w-6 h-6" />
              </button>
            </div>
            
            {/* Divider */}
            {index < savedItems.length - 1 && (
              <div className="mt-4 mx-8 h-[1.5px] bg-orange-100 rounded-full opacity-60" />
            )}
          </div>
        ))}

        {savedItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <MapPin className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 font-bold tracking-tight">No saved items found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
