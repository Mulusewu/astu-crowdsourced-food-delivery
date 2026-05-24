import { useState, useRef } from "react";
import { ArrowLeft, Camera, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth/authStore";

export default function VendorEditProfilePage() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    businessName: user?.fullName || "Kaldi's Coffee",
    phone: user?.phoneNumber || "+251911789012",
    address: "Bole Gate", // Using a dummy default based on the design
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        setIsUploadingImage(true);
        try {
          await updateProfile({ avatarUrl: base64String });
        } catch (err) {
          console.error("Failed to update avatar", err);
          alert("Failed to update profile picture.");
        } finally {
          setIsUploadingImage(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        fullName: formData.businessName,
        phoneNumber: formData.phone,
      });
      navigate(-1);
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 max-w-md mx-auto font-outfit">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageChange}
      />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 bg-gray-50 sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors bg-white shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-extrabold text-[#0B1E40] tracking-tight">
          Edit Profile
        </h1>
        <div className="w-10 h-10" /> {/* Spacer */}
      </div>

      <div className="px-4 py-2">
        {/* Avatar Section */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center mb-5">
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-orange-100 mb-4 border-2 border-white shadow-sm flex items-center justify-center group">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className={`w-full h-full object-cover transition-opacity ${isUploadingImage ? "opacity-50" : "opacity-100"}`}
              />
            ) : (
              <img
                src="https://api.dicebear.com/7.x/notionists/svg?seed=chef&backgroundColor=f26a1c"
                alt="Avatar"
                className={`w-full h-full p-2 transition-opacity ${isUploadingImage ? "opacity-50" : "opacity-100"}`}
              />
            )}

            {isUploadingImage && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingImage}
            className="text-[#F26A1C] font-bold text-sm hover:text-orange-600 transition-colors disabled:opacity-50"
          >
            {isUploadingImage ? "Uploading..." : "Change Photo"}
          </button>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[#0B1E40] text-[13px] font-bold mb-2">
                Restaurant Name
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) =>
                  setFormData({ ...formData, businessName: e.target.value })
                }
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-[16px] text-[#0B1E40] text-sm font-medium focus:outline-none focus:border-[#F26A1C] focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-[#0B1E40] text-[13px] font-bold mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                disabled={true}
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-[16px] text-[#0B1E40] text-sm font-medium focus:outline-none focus:border-[#F26A1C] focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-[#0B1E40] text-[13px] font-bold mb-2">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-[16px] text-[#0B1E40] text-sm font-medium focus:outline-none focus:border-[#F26A1C] focus:bg-white transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pb-8">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center justify-center w-full bg-[#F26A1C] text-white py-4 rounded-2xl font-bold text-[15px] shadow-sm hover:bg-orange-600 transition-colors active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
          <button
            onClick={() => navigate(-1)}
            disabled={isSaving}
            className="w-full bg-gray-100 text-[#0B1E40] py-4 rounded-2xl font-bold text-[15px] hover:bg-gray-200 transition-colors active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
