import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Search, 
  Package, 
  Edit3, 
  ArrowUpRight,
  Bookmark,
  Trash2
} from "lucide-react";
import { useSavedItemsStore, type SavedItem } from "@/store/savedItemsStore";
import { useVendorStore } from "@/store/vendorStore";

export default function VendorSavedItemsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { items: savedItems, toggleItem } = useSavedItemsStore();
  const { addMenuItem } = useVendorStore();

  const filteredItems = useMemo(() => {
    return savedItems.filter(item => {
      return item.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery, savedItems]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-outfit max-w-md mx-auto relative overflow-hidden pb-24">
      {/* Header */}
      <div className="bg-white px-4 pb-6 pt-6 shadow-sm sticky top-0 z-20">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate("/vendor/dashboard")}
            className="flex items-center justify-center w-10 h-10 rounded-xl border-2 border-orange-200 text-orange-500 hover:bg-orange-50 transition-all active:scale-95"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
          </button>
          <div className="flex-1 text-center pr-10">
            <h1 className="text-xl font-black text-black">Saved for Later</h1>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative group text-gray-500">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-orange-500 transition-colors">
            <Search className="w-5 h-5" />
          </div>
          <input 
            type="text" 
            placeholder="Search saved items..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border-2 border-gray-100 rounded-[20px] py-4 pl-12 pr-4 outline-none focus:border-orange-500 focus:bg-white transition-all font-bold text-gray-800 placeholder:text-gray-400 placeholder:font-medium text-sm"
          />
        </div>


      </div>

      {/* List */}
      <div className="flex-1 px-4 space-y-6 pt-6 overflow-y-auto no-scrollbar">
        {filteredItems.map((item) => (
          <div key={item.id} className="relative bg-white rounded-[32px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-gray-100 transition-all group">
            {/* Top Info Row */}
            <div className="flex gap-4">
              <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md flex-shrink-0 relative">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 py-1">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{(item as any).category || "Main Dish"}</span>
                  <button 
                    onClick={() => toggleItem(item)}
                    className="p-2 -mt-1 -mr-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="text-lg font-black text-gray-900 leading-tight mb-2">{item.name}</h3>
                
                {/* Price Display */}
                <div className="flex items-center gap-3">
                  <span className="text-xl font-black text-gray-900">{(item as any).price || 0} <span className="text-xs">Birr</span></span>
                </div>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
              <button 
                onClick={() => navigate(`/vendor/menu/${item.id}/edit`, { state: { fromSaved: true, savedItem: item } })}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-50 text-gray-600 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-100"
              >
                <Edit3 className="w-3.5 h-3.5" /> Quick Edit
              </button>
              <button 
                onClick={() => {
                  // Direct move logic
                  addMenuItem({
                    name: item.name,
                    price: item.price || 0,
                    image: item.image,
                    description: (item as any).description || ""
                  });
                  // Remove from saved
                  toggleItem(item);
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all active:scale-95"
              >
                <ArrowUpRight className="w-3.5 h-3.5" /> Move to Menu
              </button>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 rounded-full bg-orange-50 flex items-center justify-center mb-6">
              <Bookmark className="w-10 h-10 text-orange-300" />
            </div>
            <h4 className="text-xl font-black text-gray-900 mb-2">No Saved Items</h4>
            <p className="text-sm font-medium text-gray-500 max-w-[200px]">Save food items from order details to see them here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
