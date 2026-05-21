import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Image as ImageIcon, Loader2, UploadCloud, User } from "lucide-react";
import { Header, ActionButton } from "../components/profileShared";
import { useAuthStore } from "@/store/auth/authStore";

export default function UploadProfilePage() {
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
      // 1. Prepare FormData (Standard way to upload files to backend/cloud)
      const formData = new FormData();
      formData.append("file", selectedFile);
      // formData.append("upload_preset", "your_cloudinary_preset"); // Optional: if uploading directly to Cloudinary

      // 2. Simulate Backend / Cloud API Call
      // const response = await fetch("https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload", {
      //   method: "POST",
      //   body: formData,
      // });
      // const data = await response.json();
      
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // 3. Extract the returned URL from the mock backend response
      // In production, this would be: const uploadedUrl = data.secure_url;
      // For now, we simulate success by keeping the local preview URL, but structurally it mimics receiving a cloud URL.
      const mockCloudinaryUrl = previewUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=NewAvatar";
      
      // 4. Save the returned Cloud URL to the local Zustand store (and sync to your backend database)
      updateProfile({ avatarUrl: mockCloudinaryUrl });
      
      // Go back to profile page on success
      navigate(-1);
    } catch (error) {
      console.error("Failed to upload image", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 font-sans flex flex-col">
      <Header title="Profile Picture" showBack />

      <div className="flex-1 px-5 pt-8 pb-10 flex flex-col items-center">
        {/* Avatar Preview */}
        <div className="relative mb-10">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-gray-900 shadow-[0_8px_30px_rgba(0,0,0,0.08)] bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden relative group">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={48} className="text-gray-400" />
            )}

            {/* Overlay on hover/active for visual feedback */}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={handleUploadClick}>
              <Camera className="text-white" size={28} />
            </div>
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
            className="w-full flex items-center p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[20px] shadow-sm active:scale-[0.98] transition-transform"
          >
            <div className="w-12 h-12 rounded-full bg-[#FFF4ED] dark:bg-orange-900/20 flex items-center justify-center text-[#F26A1C] mr-4">
              <ImageIcon size={20} />
            </div>
            <div className="text-left">
              <p className="font-bold text-[15px] text-gray-900 dark:text-white">Choose from Gallery</p>
              <p className="text-[12px] font-medium text-gray-500">JPG, PNG up to 5MB</p>
            </div>
          </button>

          <button
            onClick={() => {
              // Stub for taking photo natively
              handleUploadClick(); 
            }}
            className="w-full flex items-center p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[20px] shadow-sm active:scale-[0.98] transition-transform"
          >
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 mr-4">
              <Camera size={20} />
            </div>
            <div className="text-left">
              <p className="font-bold text-[15px] text-gray-900 dark:text-white">Take a Photo</p>
              <p className="text-[12px] font-medium text-gray-500">Use your camera</p>
            </div>
          </button>
        </div>

        <div className="mt-auto w-full max-w-sm pt-8">
          <ActionButton
            onClick={handleSave}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 size={18} className="animate-spin mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <UploadCloud size={18} className="mr-2" />
                Save Changes
              </>
            )}
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
