import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, Camera } from "lucide-react";
import { useVendorStore, type MenuItem } from "@/store/vendorStore";
import { useAuthStore } from "@/store/auth/authStore";
import { useSavedItemsStore } from "@/store/savedItemsStore";
import { cn } from "@/lib/utils";

interface MenuFormProps {
  isEdit?: boolean;
  initialData?: MenuItem;
}

export default function MenuFormPage({ isEdit = false, initialData }: MenuFormProps) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { foodId } = useParams<{ foodId: string }>();
  const { addMenuItem, updateMenuItem, menuItems, fetchVendorData } = useVendorStore();
  const { user } = useAuthStore();
  const location = useLocation();
  const { toggleItem } = useSavedItemsStore();

  const fromSaved = location.state?.fromSaved;
  const savedItem = location.state?.savedItem;

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"
  });

  const [errors, setErrors] = useState({
    name: false,
    price: false
  });

  useEffect(() => {
    if (user?.id && menuItems.length === 0) {
      fetchVendorData(user.id);
    }
  }, [user?.id, menuItems.length, fetchVendorData]);

  useEffect(() => {
    if (isEdit && foodId) {
      const item = menuItems.find(i => i.id === foodId);
      if (item) {
        setFormData({
          name: item.name,
          price: item.price.toString(),
          description: item.description || "",
          image: item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"
        });
      }
    } else if (initialData) {
      setFormData({
        name: initialData.name,
        price: initialData.price.toString(),
        description: initialData.description || "",
        image: initialData.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"
      });
    } else if (fromSaved && savedItem) {
      setFormData({
        name: savedItem.name,
        price: (savedItem.price || "").toString(),
        description: savedItem.description || "",
        image: savedItem.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"
      });
    }
  }, [isEdit, foodId, menuItems, initialData, fromSaved, savedItem]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const validate = () => {
    const newErrors = {
      name: !formData.name.trim(),
      price: !formData.price || parseFloat(formData.price) <= 0
    };
    setErrors(newErrors);
    return !newErrors.name && !newErrors.price;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const itemData = {
      name: formData.name,
      price: parseFloat(formData.price),
      description: formData.description,
      image: formData.image
    };

    if (fromSaved && savedItem) {
      // Add to menu (carrying over the unique ID) and remove from saved
      addMenuItem(itemData, savedItem.id);
      toggleItem(savedItem);
    } else if (isEdit && foodId) {
      updateMenuItem(foodId, itemData);
    } else {
      addMenuItem(itemData);
    }

    navigate("/vendor/menu");
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
          <h1 className="text-2xl font-black text-black tracking-tight">
            {isEdit ? "Edit Item" : "Add Item"}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 px-4 space-y-6 pb-20 overflow-y-auto">
        {/* Image Upload Area */}
        <div className="relative group">
          <div className="w-full h-48 rounded-[32px] overflow-hidden bg-gray-100 shadow-md">
            <img
              src={formData.image}
              alt="Food preview"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={handleTriggerUpload}
                className="flex items-center gap-2 bg-orange-500 text-white px-6 py-2.5 rounded-full font-black text-sm shadow-xl shadow-orange-500/30 hover:bg-orange-600 transition-all active:scale-95"
              >
                <Camera className="w-4 h-4" />
                {isEdit || formData.image.startsWith('data:') ? "Change Image" : "Upload Photo"}
              </button>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Item Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-black text-gray-900 ml-1">Item Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter item name"
              className={cn(
                "w-full px-5 py-4 rounded-[20px] border-2 transition-all outline-none font-bold text-gray-800",
                errors.name ? "border-red-500 bg-red-50/30" : "border-gray-100 focus:border-orange-500 bg-gray-50/50"
              )}
            />
            {errors.name && (
              <p className="text-red-500 text-[10px] font-black uppercase tracking-wider ml-1 animate-in fade-in slide-in-from-top-1">
                Item Name Required
              </p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-1.5">
            <label className="text-sm font-black text-gray-900 ml-1">Price</label>
            <div className="relative">
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                className={cn(
                  "w-full px-5 py-4 rounded-[20px] border-2 transition-all outline-none font-bold text-gray-800 pr-12",
                  errors.price ? "border-red-500 bg-red-50/30" : "border-gray-100 focus:border-orange-500 bg-gray-50/50"
                )}
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 font-black text-xs uppercase tracking-wider">
                ETB
              </span>
            </div>
            {errors.price && (
              <p className="text-red-500 text-[10px] font-black uppercase tracking-wider ml-1 animate-in fade-in slide-in-from-top-1">
                Price Required
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-black text-gray-900 ml-1">Description(Optional)</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Write something about this food item..."
              className="w-full px-5 py-4 rounded-[20px] border-2 border-gray-100 focus:border-orange-500 bg-gray-50/50 transition-all outline-none font-bold text-gray-800 resize-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 pb-10">
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-5 rounded-full font-black text-lg shadow-2xl shadow-orange-500/40 hover:bg-orange-600 transition-all active:scale-95"
          >
            {isEdit ? "Save" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}
