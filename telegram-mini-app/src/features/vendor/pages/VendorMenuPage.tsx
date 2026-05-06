import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { useVendorStore } from "@/store/vendorStore";
import { cn } from "@/lib/utils";

export default function VendorMenuPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"Available" | "Unavailable">("Available");
    const { menuItems, toggleMenuAvailability, fetchVendorData } = useVendorStore();

    useEffect(() => {
        fetchVendorData();
    }, [fetchVendorData]);

    const filteredItems = menuItems.filter(item =>
        activeTab === "Available" ? item.isAvailable : !item.isAvailable
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans pb-32 w-full max-w-md mx-auto">
            <header className="px-5 pt-6 pb-4 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="w-10 h-10 border border-orange-200 rounded-[14px] flex items-center justify-center text-[#F26A1C] bg-white active:scale-95">
                    <ArrowLeft size={20} strokeWidth={2.5} />
                </button>
                <h1 className="text-[18px] font-black text-gray-900 dark:text-white">Menu Management</h1>
                <div className="w-10" />
            </header>

            <main className="px-5 pt-2">
                {/* Banner */}
                <div className="w-full h-[140px] rounded-[24px] overflow-hidden relative mb-6 shadow-md">
                    <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600" alt="Restaurant Kitchen" className="w-full h-full object-cover brightness-50" />
                    <div className="absolute inset-0 p-5 flex flex-col justify-center">
                        <h2 className="text-white font-black text-[22px] leading-tight mb-3 w-[60%]">
                            Manage Your Food Items
                        </h2>
                        <button className="bg-[#F26A1C] text-white w-max px-4 py-2 rounded-[10px] text-[12px] font-bold flex items-center gap-1 active:scale-95 shadow-lg">
                            <Plus size={16} /> Add Item
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-3 mb-6">
                    {(["Available", "Unavailable"] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "px-5 py-2.5 rounded-[12px] text-[13px] font-bold border transition-all active:scale-95",
                                activeTab === tab
                                    ? "bg-[#F26A1C] text-white border-[#F26A1C] shadow-md"
                                    : "bg-white text-gray-500 border-gray-200"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* List */}
                <div className="space-y-4">
                    {filteredItems.map(item => (
                        <div key={item.id} className="bg-white dark:bg-gray-900 p-4 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <img src={item.image} alt={item.name} className="w-[60px] h-[60px] rounded-xl object-cover" />
                                <div className="flex flex-col gap-3">
                                    <h3 className="font-bold text-[14px] text-gray-900">{item.name}</h3>
                                    <button className="bg-[#F26A1C] text-white px-4 py-1.5 rounded-md text-[11px] font-bold w-max flex items-center gap-1 active:scale-95">
                                        ✏️ Edit
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-3">
                                <span className={cn("text-[11px] font-bold uppercase tracking-wider", item.isAvailable ? "text-green-500" : "text-gray-400")}>
                                    {item.isAvailable ? "Available" : "Unavailable"}
                                </span>
                                <span className="font-black text-[15px] text-[#F26A1C]">{item.price} Birr</span>
                                {/* Quick Toggle to swap states instantly */}
                                <button
                                    onClick={() => toggleMenuAvailability(item.id)}
                                    className="mt-1 border border-gray-200 text-gray-500 px-3 py-1 rounded-md text-[10px] font-bold active:bg-gray-100 transition-colors"
                                >
                                    Mark {item.isAvailable ? "Unavailable" : "Available"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}