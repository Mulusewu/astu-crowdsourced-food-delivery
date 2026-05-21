import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Image as ImageIcon, Loader2, UploadCloud, User } from "lucide-react";
import { Header, ActionButton } from "@/features/shared/components/ProfileShared";
import { useAuthStore } from "@/store/auth/authStore";
import { cn } from "@/lib/utils";

export default function DeliveryAvatarUploadPage() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.avatarUrl || null);
  const [isUploading, setIsUploading] = useState(false);

  // Handle file selection (local preview)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Simulate upload process
  const handleSave = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      // Standard upload logic (simulated for now)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const mockCloudinaryUrl = previewUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Deliverer";
      
      // Update the global store
      await updateProfile({ avatarUrl: mockCloudinaryUrl });
      
      // Go back
      navigate(-1);
    } catch (error) {
      console.error("Failed to upload image", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 font-sans flex flex-col">
      <Header 
        title="Identity Photo" 
        showBack 
        onBackClick={() => navigate(-1)} 
      />

      <div className="flex-1 px-5 pt-8 pb-10 flex flex-col items-center">
        {/* Status indicator */}
        <div className="mb-10 text-center">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/20 text-[#F26A1C] text-[10px] font-black uppercase tracking-widest mb-2">
              <Camera size={12} /> Live Preview
           </div>
           <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Update your profile picture to help customers recognize you.</p>
        </div>

        {/* Avatar Preview */}
        <div className="relative mb-12 group">
          <div className="absolute inset-0 bg-[#F26A1C] rounded-[48px] rotate-3 scale-105 opacity-10 group-hover:rotate-6 transition-transform" />
          <div className="w-44 h-44 rounded-[40px] border-4 border-white dark:border-gray-900 shadow-[0_20px_50px_rgba(0,0,0,0.12)] bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden relative">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Profile Preview"
                className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
              />
            ) : (
              <User size={64} className="text-gray-300" />
            )}

            {/* Overlay on hover/active for visual feedback */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={handleUploadClick}>
              <Camera className="text-white" size={32} strokeWidth={2.5} />
            </div>
          </div>
          
          {/* Badge */}
          <div className="absolute -bottom-4 -right-4 h-12 w-12 rounded-2xl bg-[#F26A1C] border-4 border-[#FDFDFD] dark:border-gray-950 flex items-center justify-center shadow-lg">
             <UploadCloud className="text-white" size={20} />
          </div>
        </div>

        <div className="w-full space-y-4 max-w-sm">
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/jpg"
            className="hidden"
          />

          {/* Action Buttons */}
          <button
            onClick={handleUploadClick}
            className="w-full flex items-center p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[28px] shadow-[0_4px_12px_rgba(0,0,0,0.02)] active:scale-[0.98] transition-all hover:border-[#F26A1C]/30"
          >
            <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center text-[#F26A1C] mr-4">
              <ImageIcon size={22} />
            </div>
            <div className="text-left">
              <p className="font-black text-[15px] text-gray-900 dark:text-white">Choose from Gallery</p>
              <p className="text-[12px] font-bold text-gray-400">Pick a clear, front-facing photo</p>
            </div>
          </button>

          <button
            onClick={handleUploadClick}
            className="w-full flex items-center p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[28px] shadow-[0_4px_12px_rgba(0,0,0,0.02)] active:scale-[0.98] transition-all hover:border-[#F26A1C]/30"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center text-blue-500 mr-4">
              <Camera size={22} />
            </div>
            <div className="text-left">
              <p className="font-black text-[15px] text-gray-900 dark:text-white">Take Instant Photo</p>
              <p className="text-[12px] font-bold text-gray-400">Use your device camera</p>
            </div>
          </button>
        </div>

        <div className="mt-auto w-full max-w-sm pt-8">
          <ActionButton
            onClick={handleSave}
            disabled={!selectedFile || isUploading}
            className={cn(
              "w-full h-16 rounded-full text-lg font-black transition-all",
              !selectedFile ? "opacity-50 grayscale" : "shadow-[0_12px_32px_rgba(242,106,28,0.25)]"
            )}
          >
            {isUploading ? (
              <div className="flex items-center gap-3">
                <Loader2 size={24} className="animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <CheckCircle2 size={24} />
                <span>Update Photo</span>
              </div>
            )}
          </ActionButton>
          
          <p className="text-center mt-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
             ASTU Eats Delivery Partner Network
          </p>
        </div>
      </div>
    </div>
  );
}

// Re-using some components or just adding icons if missing
const CheckCircle2 = ({ size, className }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);
