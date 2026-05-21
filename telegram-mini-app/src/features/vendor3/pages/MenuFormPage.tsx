import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Camera, Loader2, ChevronDown } from "lucide-react";
import { useVendorMenuStore, type MenuItem } from "@/store/vendor/vendorMenuStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MenuFormProps {
  isEdit?: boolean;
}

export default function MenuFormPage({ isEdit = false }: MenuFormProps) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { foodId } = useParams<{ foodId: string }>();
  
  // Bring in Categories to populate the required dropdown
  const { createItem, updateItem, items, categories, fetchMenu } = useVendorMenuStore();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    categoryId: "",
    prepTimeMins: "15",
    isFasting: false,
    image: "" // Placeholder for UI preview
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Ensure we have categories loaded
    if (categories.length === 0) {
      fetchMenu();
    }
  }, [fetchMenu, categories.length]);

  useEffect(() => {
    if (isEdit && foodId) {
      const item = items.find(i => i.id === foodId);
      if (item) {
        setFormData({
          name: item.name,
          price: item.price.toString(),
          description: item.description || "",
          categoryId: item.categoryId,
          prepTimeMins: item.prepTimeMins.toString(),
          isFasting: item.isFasting,
          image: item.imageUrl || ""
        });
      }
    }
  }, [isEdit, foodId, items]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // For UI preview only. 
        // Real implementation requires uploading to Cloudinary and getting URL.
        setFormData(prev => ({ ...prev, image: reader.result as string }));
        toast.info("Image attached. (Note: Cloud upload required in prod)");
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {
      name: !formData.name.trim(),
      price: !formData.price || parseFloat(formData.price) <= 0,
      categoryId: !formData.categoryId,
      prepTime: parseInt(formData.prepTimeMins) < 5 || parseInt(formData.prepTimeMins) > 120
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill all required fields correctly.");
      return;
    }

    setIsLoading(true);

    const payload = {
      categoryId: formData.categoryId,
      name: formData.name,
      price: parseFloat(formData.price),
      description: formData.description,
      prepTimeMins: parseInt(formData.prepTimeMins),
      isFasting: formData.isFasting,
      isAvailable: true, // New items default to available. Editing doesn't change stock status.
      // Pass null to let backend handle missing image safely
      imageUrl: formData.image.startsWith('data:') ? null : (formData.image || null)
    };

    try {
      if (isEdit && foodId) {
        await updateItem(foodId, payload);
        toast.success("Menu item updated successfully!");
      } else {
        await createItem(payload);
        toast.success("Menu item added successfully!");
      }
      navigate("/vendor/menu");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save menu item");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-outfit max-w-md mx-auto relative overflow-hidden">
      <div className="flex items-center px-4 py-6">
        <button onClick={() => navigate(-1)} className="flex items-center justify-center w-10 h-10 rounded-xl border-2 border-orange-200 text-orange-500 hover:bg-orange-50 transition-all active:scale-95 shadow-sm">
          <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
        </button>
        <div className="flex-1 text-center pr-10">
          <h1 className="text-2xl font-black text-black tracking-tight">{isEdit ? "Edit Item" : "Add Item"}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 px-4 space-y-6 pb-20 overflow-y-auto">
        
        {/* Image Upload Area */}
        <div className="relative group">
          <div className="w-full h-48 rounded-[32px] overflow-hidden bg-gray-100 shadow-md flex items-center justify-center">
            {formData.image ? (
              <img src={formData.image} alt="Food preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-4xl">🍲</div>
            )}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
              <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 bg-orange-500 text-white px-6 py-2.5 rounded-full font-black text-sm shadow-xl hover:bg-orange-600 transition-all active:scale-95">
                <Camera className="w-4 h-4" /> Change Image
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          
          {/* CRITICAL FIX: Category Dropdown */}
          <div className="space-y-1.5">
            <label className="text-sm font-black text-gray-900 ml-1">Category <span className="text-red-500">*</span></label>
            <div className="relative">
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className={cn("w-full px-5 py-4 rounded-[20px] border-2 transition-all outline-none font-bold text-gray-800 appearance-none bg-white", errors.categoryId ? "border-red-500 bg-red-50/30" : "border-gray-100 focus:border-orange-500")}
              >
                <option value="" disabled>Select a category...</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {errors.categoryId && <p className="text-red-500 text-[10px] font-black uppercase ml-1">Category is required</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-black text-gray-900 ml-1">Item Name <span className="text-red-500">*</span></label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Special Firfir" className={cn("w-full px-5 py-4 rounded-[20px] border-2 transition-all outline-none font-bold text-gray-800", errors.name ? "border-red-500 bg-red-50/30" : "border-gray-100 focus:border-orange-500")} />
          </div>

          <div className="flex gap-4">
            <div className="flex-1 space-y-1.5">
              <label className="text-sm font-black text-gray-900 ml-1">Price <span className="text-red-500">*</span></label>
              <div className="relative">
                <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="0.00" className={cn("w-full px-5 py-4 rounded-[20px] border-2 transition-all outline-none font-bold text-gray-800 pr-12", errors.price ? "border-red-500 bg-red-50/30" : "border-gray-100 focus:border-orange-500")} />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-black text-xs uppercase">ETB</span>
              </div>
            </div>

            {/* CRITICAL FIX: Prep Time (SLA constraint) */}
            <div className="flex-1 space-y-1.5">
              <label className="text-sm font-black text-gray-900 ml-1">Prep Time <span className="text-red-500">*</span></label>
              <div className="relative">
                <input type="number" value={formData.prepTimeMins} onChange={(e) => setFormData({ ...formData, prepTimeMins: e.target.value })} className={cn("w-full px-5 py-4 rounded-[20px] border-2 transition-all outline-none font-bold text-gray-800 pr-12", errors.prepTime ? "border-red-500 bg-red-50/30" : "border-gray-100 focus:border-orange-500")} />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-black text-xs uppercase">MIN</span>
              </div>
            </div>
          </div>

          {/* CRITICAL FIX: Fasting Toggle */}
          <div className="flex items-center justify-between bg-gray-50/50 p-4 rounded-[20px] border-2 border-gray-100">
            <div>
              <p className="font-black text-sm text-gray-900">Fasting Item? (የፆም)</p>
              <p className="text-xs font-semibold text-gray-500">Enable if item is 100% vegan.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={formData.isFasting} onChange={(e) => setFormData({ ...formData, isFasting: e.target.checked })} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-black text-gray-900 ml-1">Description (Optional)</label>
            <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Ingredients, spice level..." className="w-full px-5 py-4 rounded-[20px] border-2 border-gray-100 focus:border-orange-500 transition-all outline-none font-bold text-gray-800 resize-none" />
          </div>
        </div>

        <div className="pt-4 pb-10">
          <button type="submit" disabled={isLoading} className="w-full bg-orange-500 text-white flex justify-center items-center h-14 rounded-full font-black text-lg shadow-2xl shadow-orange-500/40 hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50">
            {isLoading ? <Loader2 className="animate-spin" /> : isEdit ? "Save Changes" : "Add to Menu"}
          </button>
        </div>
      </form>
    </div>
  );
}