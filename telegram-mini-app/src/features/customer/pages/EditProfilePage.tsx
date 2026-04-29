import { useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import { useAuthStore } from "@/store/auth/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Header, SoftInput, ActionButton } from "../components/profileShared";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleSave = () => {
    // API call here, then go back
    navigate(-1);
  };

  return (
    <div className="px-5 font-sans flex flex-col h-full bg-[#FDFDFD] dark:bg-gray-950">
      <Header title="Profile" showBack />

      <div className="flex flex-col items-center mt-4 mb-8 relative">
        <div className="relative">
          <Avatar className="w-24 h-24 border-[3px] border-white dark:border-gray-900 shadow-md">
            <AvatarImage
              src={user?.avatarUrl || "https://i.pravatar.cc/150?u=gray"}
            />
            <AvatarFallback className="bg-[#F26A1C] text-white text-2xl font-bold">
              G
            </AvatarFallback>
          </Avatar>
          <button className="absolute bottom-0 right-0 bg-[#F26A1C] p-2 rounded-full text-white border-2 border-white dark:border-gray-900 shadow-sm active:scale-95">
            <Camera size={14} />
          </button>
        </div>
        <h2 className="text-xl font-black text-gray-900 dark:text-white mt-3">
          {user?.fullName || "Gray Johnson"}
        </h2>
        <p className="text-[#F26A1C] text-xs font-bold mt-1 cursor-pointer hover:underline">
          Change Profile Picture
        </p>
      </div>

      <div className="flex-1 space-y-5">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-gray-500 uppercase px-2">
            Name
          </label>
          <SoftInput defaultValue={user?.fullName || "Gray Johnson"} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-gray-500 uppercase px-2">
            Phone Number
          </label>
          <SoftInput defaultValue="+251912345678" type="tel" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-gray-500 uppercase px-2">
            Email
          </label>
          <SoftInput defaultValue="Gray.Johnson@astu.edu.et" type="email" />
        </div>
      </div>

      <div className="mt-8 mb-4">
        <ActionButton onClick={handleSave}>Save Changes</ActionButton>
      </div>
    </div>
  );
}
