import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/profileShared";
import { Upload, CheckCircle2, Loader2, ChevronDown, Camera } from "lucide-react";
import { useCustomerStore } from "@/store/customer/customerStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function CustomerApplyDelivererPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { applyForDeliverer, isLoading } = useCustomerStore();

  const [formData, setFormData] = useState({
    payoutProvider: "TELEBIRR",
    payoutAccount: "",
    idCardUrl: ""
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        // Note: For dev, we send placeholder. In prod, upload to S3 first.
        setFormData(prev => ({ ...prev, idCardUrl: "https://example.com/idcard.jpg" }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.idCardUrl) newErrors.idCardUrl = "ID Card photo is required";
    if (!formData.payoutAccount) newErrors.payoutAccount = "Payout account number is required";
    else if (formData.payoutAccount.length < 10) newErrors.payoutAccount = "Invalid account length";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await applyForDeliverer(formData);
      toast.success("Application Submitted Successfully!");
      navigate(-1); // Returns to profile
    } catch (error: any) {
      toast.error(error.message || "Failed to submit application");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 font-sans flex flex-col items-center pt-8 pb-12">
      <Header title="Deliverer Application" showBack />

      <div className="w-full max-w-[360px] px-4 flex flex-col mt-8">
        
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-sm">
            <span className="text-4xl">🛵</span>
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">Join The Fleet</h2>
          <p className="text-sm font-medium text-gray-500 mt-2 px-4">
            Start earning money today by delivering food across the ASTU campus.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          
          {/* ID Card Upload */}
          <div className="space-y-2">
            <label className="text-[15px] font-bold text-gray-900 ml-1">Student ID Card</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "w-full h-32 border-2 border-dashed rounded-[20px] flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-orange-50/30 overflow-hidden relative",
                imagePreview ? "border-green-400 bg-green-50/30" : "border-gray-200 bg-gray-50/50"
              )}
            >
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="ID Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                  <div className="relative z-10 flex flex-col items-center bg-white/80 px-4 py-2 rounded-full backdrop-blur-sm shadow-sm">
                    <CheckCircle2 size={20} className="text-green-600 mb-1" />
                    <span className="text-xs font-bold text-gray-900">ID Uploaded</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <Camera size={28} className="mb-2" />
                  <span className="text-[13px] font-bold text-gray-600">Tap to take photo</span>
                </div>
              )}
            </div>
            {errors.idCardUrl && <p className="text-xs text-red-500 font-semibold ml-1">{errors.idCardUrl}</p>}
          </div>

          <div className="w-full h-px bg-gray-100 my-6" />

          {/* Payout Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Payout Settings</h3>
            
            <div className="relative">
              <select
                value={formData.payoutProvider}
                onChange={(e) => setFormData({ ...formData, payoutProvider: e.target.value })}
                className="w-full h-14 bg-white border border-gray-200 rounded-[14px] px-5 text-[15px] font-bold text-gray-900 appearance-none focus:border-[#F26A1C] focus:outline-none transition-all shadow-sm"
              >
                <option value="TELEBIRR">Telebirr Wallet</option>
                <option value="CBE_BIRR">CBE Birr</option>
              </select>
              <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <div>
              <input
                type="tel"
                value={formData.payoutAccount}
                onChange={(e) => setFormData({ ...formData, payoutAccount: e.target.value })}
                placeholder="Phone Number (e.g., 0911...)"
                className={cn(
                  "w-full h-14 bg-white border rounded-[14px] px-5 text-[15px] font-bold text-gray-900 placeholder:text-gray-300 focus:border-[#F26A1C] focus:outline-none transition-all shadow-sm",
                  errors.payoutAccount ? "border-red-500" : "border-gray-200"
                )}
              />
              {errors.payoutAccount && <p className="text-xs text-red-500 font-semibold ml-1 mt-1">{errors.payoutAccount}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-8 pb-10">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#F26A1C] hover:bg-[#e05d15] text-white flex justify-center items-center h-14 rounded-full font-black text-lg shadow-xl shadow-orange-500/30 active:scale-95 transition-all disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}