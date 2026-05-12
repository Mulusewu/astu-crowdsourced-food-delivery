import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVendorStore, type MenuItem } from "@/store/vendorStore";
import { useAuthStore } from "@/store/auth/authStore";
import { ArrowLeft, Plus, Pencil, EyeOff, Eye } from "lucide-react";
import { ROUTES, buildRoute } from "@/routes/routePaths";

export default function MenuPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { menuItems, toggleMenuItemStock, fetchVendorData, isLoading } = useVendorStore();
  const [activeTab, setActiveTab] = useState<"available" | "unavailable">("available");

  useEffect(() => {
    if (user?.id && menuItems.length === 0) {
      fetchVendorData(user.id);
    }
  }, [fetchVendorData, user?.id, menuItems.length]);

  const filteredItems = menuItems.filter((item: MenuItem) => 
    activeTab === "available" ? item.inStock : !item.inStock
  );

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="text-gray-500 font-medium">Loading your menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 max-w-md mx-auto relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center px-4 py-4 bg-white sticky top-0 z-10">
        <button 
          onClick={() => navigate("/vendor/dashboard")}
          className="flex items-center justify-center w-10 h-10 rounded-xl border-2 border-orange-200 text-orange-500 hover:bg-orange-50 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 flex items-center justify-center pr-10">
          <h1 className="text-xl font-black text-black">Menu Management</h1>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="px-4 mt-2">
        <div className="relative h-44 w-full rounded-[32px] overflow-hidden bg-gray-900 shadow-xl">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80" 
            alt="Menu Header" 
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent p-6 flex flex-col justify-center">
            <h2 className="text-2xl font-black text-white leading-tight">
              Manage Your<br />Food <span className="text-orange-500">Items</span>
            </h2>
            <button 
              onClick={() => navigate(ROUTES.VENDOR.MENU.ADD)}
              className="mt-4 flex items-center gap-1.5 bg-orange-500 text-white px-4 py-2 rounded-full text-xs font-black shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-all w-fit uppercase tracking-wider"
            >
              <Plus className="h-3.5 w-3.5 stroke-[3]" /> Add Item
            </button>
          </div>
          {/* Decorative Food image removed as per user request */}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-4 mt-6 gap-3">
        <button 
          onClick={() => setActiveTab("available")}
          className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === "available" ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'bg-white text-gray-500 border border-gray-100'}`}
        >
          Available
        </button>
        <button 
          onClick={() => setActiveTab("unavailable")}
          className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === "unavailable" ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'bg-white text-gray-400 border border-gray-100'}`}
        >
          Unavailable
        </button>
      </div>

      {/* Menu List */}
      <div className="flex-1 px-4 mt-6 pb-32 overflow-y-auto space-y-8">
        {filteredItems.map((item: MenuItem) => (
          <div key={item.id} className="relative bg-white rounded-[32px] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50">
            {/* Top Row: Label and Status */}
            <div className="flex justify-between items-center mb-3 px-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Item</span>
              <span className={`text-[10px] font-black uppercase tracking-widest ${item.inStock ? 'text-green-500' : 'text-red-500'}`}>
                {item.inStock ? 'Available' : 'Unavailable'}
              </span>
            </div>

            {/* Middle Row: Image, Name, Price */}
            <div className="flex items-center gap-4 border-b border-gray-50 pb-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className={`w-full h-full object-cover ${item.inStock ? '' : 'grayscale opacity-70'}`}
                />
              </div>
              <div className="flex-1 flex justify-between items-center">
                <h3 className={`font-black text-gray-900 ${item.inStock ? '' : 'text-gray-400'}`}>{item.name}</h3>
                <span className="text-orange-500 font-black text-sm">{item.price} Birr</span>
              </div>
            </div>

            {/* Bottom Row: Actions */}
            <div className="flex gap-2 mt-4 px-1">
              <button 
                onClick={() => navigate(buildRoute(ROUTES.VENDOR.MENU.EDIT, { foodId: item.id }))}
                className="flex items-center gap-1.5 bg-orange-500 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-lg shadow-orange-100 active:scale-95 transition-all"
              >
                <Pencil className="h-3 w-3" /> Edit
              </button>
              <button 
                onClick={() => toggleMenuItemStock(item.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border-2 active:scale-95 transition-all
                  ${item.inStock 
                    ? 'bg-white border-orange-500 text-orange-500 hover:bg-orange-50' 
                    : 'bg-green-500 border-green-500 text-white'}`}
              >
                {item.inStock ? <><EyeOff className="h-3 w-3" /> Unavailable</> : <><Eye className="h-3 w-3" /> Available</>}
              </button>
            </div>
            
            {/* Subtle Divider Line Below Card (to match design) */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-0.5 bg-orange-100 rounded-full opacity-50" />
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
            <EyeOff className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium tracking-tight">No {activeTab} items found.</p>
          </div>
        )}
      </div>

    </div>
  );
}

