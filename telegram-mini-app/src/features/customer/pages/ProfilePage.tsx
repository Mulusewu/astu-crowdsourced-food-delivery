import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Lock,
  CreditCard,
  ArrowLeft,
  Camera,
  Search,
  MapPin,
  Check,
  Plus,
} from "lucide-react";

import { useAuthStore } from "@/store/auth/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CustomerProfileFlow() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  // Extended state to handle the new payment flow screens
  const [activeView, setActiveView] = useState<
    | "menu"
    | "edit"
    | "address"
    | "password"
    | "payment"
    | "add-payment-list"
    | "add-telebirr-form"
    | "add-telebirr-success"
  >("menu");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // --- Sub-Components ---

  // Used in Profile & Password (soft orange background, no border)
  const SoftInput = ({ icon: Icon, ...props }: any) => (
    <div className="relative flex items-center mb-4">
      {Icon && <Icon size={18} className="absolute left-4 text-gray-400" />}
      <input
        className={`w-full bg-[#FFF4ED] dark:bg-gray-900 border border-transparent focus:border-[#F26A1C] rounded-[20px] ${Icon ? "pl-11" : "pl-4"} pr-4 py-3.5 text-[13px] font-medium text-gray-900 dark:text-white outline-none transition-colors shadow-sm`}
        {...props}
      />
    </div>
  );

  // Used in Telebirr Form (white background, thin gray border)
  const BorderedInput = ({ error, ...props }: any) => (
    <div className="relative flex items-center">
      <input
        className={`w-full bg-white dark:bg-gray-900 border ${error ? "border-red-500" : "border-gray-300 dark:border-gray-700"} focus:border-[#F26A1C] rounded-[14px] px-4 py-3 text-[13px] font-medium text-gray-900 dark:text-white outline-none transition-colors`}
        {...props}
      />
    </div>
  );

  const ActionButton = ({ children, onClick }: any) => (
    <button
      onClick={onClick}
      className="w-full bg-[#F26A1C] hover:bg-[#e05d15] text-white rounded-[20px] font-bold text-[15px] py-4 shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all"
    >
      {children}
    </button>
  );

  const Header = ({
    title,
    showBack,
    onBackClick,
  }: {
    title: string;
    showBack?: boolean;
    onBackClick?: () => void;
  }) => (
    <div className="relative flex items-center justify-center pt-6 pb-4 mb-2">
      {showBack && (
        <button
          onClick={onBackClick || (() => setActiveView("menu"))}
          className="absolute left-0 w-10 h-10 bg-orange-50 dark:bg-gray-800 rounded-xl flex items-center justify-center text-[#F26A1C] active:scale-95 transition-transform"
        >
          <ArrowLeft size={20} />
        </button>
      )}
      <h1 className="font-bold text-lg text-gray-900 dark:text-white tracking-wide">
        {title}
      </h1>
    </div>
  );

  // --- VIEW 1: Main Menu (History/Profile Root) ---
  if (activeView === "menu") {
    return (
      <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 px-5 pb-28 font-sans flex flex-col">
        <Header title="History" />

        <div className="flex flex-col items-center mt-4 mb-8">
          <Avatar className="w-24 h-24 border-[3px] border-white dark:border-gray-900 shadow-md mb-3">
            <AvatarImage
              src={user?.avatar || "https://i.pravatar.cc/150?u=gray"}
            />
            <AvatarFallback className="bg-[#F26A1C] text-white text-2xl font-bold">
              {user?.name?.[0] || "G"}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-black text-gray-900 dark:text-white">
            {user?.name || "Gray Johnson"}
          </h2>
          <p className="text-gray-500 text-sm font-medium mt-0.5">
            +251912345678
          </p>
        </div>

        <div className="flex-1 space-y-2">
          {[
            { label: "Profile", view: "edit" as const },
            { label: "Change Password", view: "password" as const },
            { label: "Payment Information", view: "payment" as const },
            { label: "Notification", view: "menu" as const },
            { label: "About Us", view: "menu" as const },
            { label: "Contact Us", view: "menu" as const },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveView(item.view)}
              className="w-full flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-800/60 active:opacity-70 transition-opacity"
            >
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                {item.label}
              </span>
              <ChevronRight size={18} className="text-gray-400" />
            </button>
          ))}
        </div>

        <div className="mt-8">
          <ActionButton onClick={handleLogout}>Log Out</ActionButton>
        </div>
      </div>
    );
  }

  // --- VIEW 2: Edit Profile ---
  if (activeView === "edit") {
    // ... (Keep existing Edit Profile code here)
    return (
      <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 px-5 pb-28 font-sans flex flex-col">
        <Header title="Profile" showBack />

        <div className="flex flex-col items-center mt-4 mb-8 relative">
          <div className="relative">
            <Avatar className="w-24 h-24 border-[3px] border-white dark:border-gray-900 shadow-md">
              <AvatarImage
                src={user?.avatar || "https://i.pravatar.cc/150?u=gray"}
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
            {user?.name || "Gray Johnson"}
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
            <SoftInput defaultValue={user?.name || "Gray Johnson"} />
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
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase px-2">
              Default Address
            </label>
            <SoftInput defaultValue="B-12/A40, G-23/A14" />
          </div>
        </div>

        <div className="mt-8">
          <ActionButton onClick={() => setActiveView("menu")}>
            Save Changes
          </ActionButton>
        </div>
      </div>
    );
  }

  // --- VIEW 3: Address / Map View ---
  if (activeView === "address") {
    // ... (Keep existing Address code here)
    return (
      <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 px-5 pb-28 font-sans flex flex-col">
        <Header title="Address" showBack />

        <div className="mt-4 mb-4">
          <div className="relative flex items-center">
            <Search size={18} className="absolute left-4 text-gray-400" />
            <input
              placeholder="Search location..."
              className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[20px] pl-11 pr-4 py-3.5 text-[13px] text-gray-900 shadow-sm outline-none focus:border-[#F26A1C]"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 py-3 px-2 mb-4">
          <MapPin size={18} className="text-[#F26A1C]" />
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            West Pine Avenue, Addis Ababa
          </p>
        </div>

        <div className="flex-1 w-full bg-gray-100 dark:bg-gray-800 rounded-[24px] relative overflow-hidden mb-8 border border-gray-200 dark:border-gray-800">
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop"
            alt="Map"
            className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
          />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-12 h-12 bg-[#F26A1C]/20 rounded-full flex items-center justify-center animate-pulse">
              <MapPin size={24} className="text-[#F26A1C] fill-[#F26A1C]" />
            </div>
          </div>
          <button className="absolute bottom-4 right-4 bg-white dark:bg-gray-900 p-3 rounded-full shadow-lg border border-gray-100">
            <MapPin size={20} className="text-[#F26A1C]" />
          </button>
        </div>

        <ActionButton onClick={() => setActiveView("menu")}>
          Save Location
        </ActionButton>
      </div>
    );
  }

  // --- VIEW 4: Change Password ---
  if (activeView === "password") {
    // ... (Keep existing Password code here)
    return (
      <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 px-5 pb-28 font-sans flex flex-col">
        <Header title="Change Password" showBack />

        <div className="flex-1 mt-6 space-y-6">
          <div>
            <label className="text-[12px] font-bold text-gray-700 dark:text-gray-300 mb-2 block px-2">
              Enter Old Password
            </label>
            <SoftInput icon={Lock} type="password" placeholder="••••••••" />
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <label className="text-[12px] font-bold text-gray-700 dark:text-gray-300 mb-2 block px-2">
              Create New Password
            </label>
            <SoftInput
              icon={Lock}
              type="password"
              placeholder="Create New Password"
            />
            <SoftInput
              icon={Lock}
              type="password"
              placeholder="Confirm New Password"
            />
          </div>
        </div>

        <div className="mt-8">
          <ActionButton onClick={() => setActiveView("menu")}>
            Change Password
          </ActionButton>
        </div>
      </div>
    );
  }

  // --- VIEW 5: Payment Information (Root) ---
  if (activeView === "payment") {
    return (
      <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 px-5 pb-28 font-sans flex flex-col">
        <Header title="Payment Information" showBack />

        <div className="flex-1 mt-6 space-y-4">
          <label className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-[20px] border border-orange-200 dark:border-orange-900/50 shadow-sm cursor-pointer active:scale-[0.98] transition-transform">
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 rounded-full border-2 border-[#F26A1C] flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#F26A1C]" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                  <CreditCard size={16} className="text-blue-600" />
                </div>
                <span className="font-bold text-sm text-gray-900 dark:text-white">
                  CBE Birr
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">
                +251912345678
              </span>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
          </label>

          <label className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-[20px] border border-gray-100 dark:border-gray-800 cursor-pointer active:scale-[0.98] transition-transform">
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center">
                  <CreditCard size={16} className="text-[#F26A1C]" />
                </div>
                <span className="font-bold text-sm text-gray-900 dark:text-white">
                  Amole
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">
                098923456789
              </span>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
          </label>

          {/* Navigates to the Add Payment List */}
          <button
            onClick={() => setActiveView("add-payment-list")}
            className="w-full flex items-center justify-between p-4 bg-transparent active:opacity-70 transition-opacity mt-4"
          >
            <span className="font-bold text-sm text-gray-700 dark:text-gray-300">
              Add Payment Method
            </span>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
        </div>
      </div>
    );
  }

  // --- VIEW 6: Add Payment Method (List) ---
  if (activeView === "add-payment-list") {
    return (
      <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 px-5 pb-28 font-sans flex flex-col">
        <Header
          title="Add Payment Method"
          showBack
          onBackClick={() => setActiveView("payment")}
        />

        <p className="text-xs font-semibold text-gray-500 mt-2 mb-6 px-1">
          Choose Payment Method To Add
        </p>

        <div className="flex-1 space-y-4">
          {/* Telebirr (Already added/selected state) */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-gray-900 cursor-default">
            <div className="flex items-center gap-3">
              <img
                src="https://telebirr.et/wp-content/uploads/2021/05/telebirr-logo.png"
                alt="Telebirr"
                className="h-8 object-contain"
              />
            </div>
            <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center">
              <Check size={12} className="text-white" strokeWidth={3} />
            </div>
          </div>

          {/* CBE (Already added/selected state) */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-gray-900 cursor-default">
            <div className="flex items-center gap-3">
              <img
                src="https://combanketh.et/cbe_logo.png"
                alt="CBE"
                className="h-8 object-contain bg-orange-50/50 p-1 rounded-md"
              />
            </div>
            <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center">
              <Check size={12} className="text-white" strokeWidth={3} />
            </div>
          </div>

          {/* Awash Birr (Available to add) - Navigates to Telebirr form for demo purposes */}
          <button
            onClick={() => setActiveView("add-telebirr-form")}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-gray-900 hover:bg-gray-50 active:scale-[0.98] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <img
                src="https://awashbank.com/wp-content/uploads/2020/11/awash-logo.png"
                alt="Awash Birr"
                className="h-8 object-contain"
              />
            </div>
            <div className="w-5 h-5 bg-[#F26A1C] rounded-full flex items-center justify-center">
              <Plus size={14} className="text-white" strokeWidth={3} />
            </div>
          </button>
        </div>
      </div>
    );
  }

  // --- VIEW 7: Add Telebirr Form ---
  if (activeView === "add-telebirr-form") {
    return (
      <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 px-5 pb-28 font-sans flex flex-col">
        <Header
          title="Add Telebirr"
          showBack
          onBackClick={() => setActiveView("add-payment-list")}
        />

        <div className="flex-1 mt-2">
          {/* Logo & Warning */}
          <div className="flex flex-col items-center mb-8 px-4 text-center">
            <img
              src="https://telebirr.et/wp-content/uploads/2021/05/telebirr-logo.png"
              alt="Telebirr"
              className="h-16 object-contain mb-6"
            />
            <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
              <b className="text-gray-900 dark:text-white">Warning:</b> Please
              Make Sure The Number You Enter Is Really Yours. Apart From
              Verifying The Number Via Otp, We Will Not Responsible For Any
              Inconvenience Regarding Your Account.
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            <div>
              <label className="text-[12px] font-bold text-gray-900 dark:text-white mb-2 block">
                Account Name
              </label>
              <BorderedInput placeholder="Enter Your Name" />
            </div>

            <div>
              <label className="text-[12px] font-bold text-gray-900 dark:text-white mb-2 block">
                Phone Number
              </label>
              <BorderedInput
                placeholder="Enter Your Phone Number"
                error={true}
              />
              <p className="text-[10px] text-red-500 font-semibold text-center mt-1.5">
                Please Enter Valid Phone Number
              </p>
            </div>

            <div>
              <label className="text-[12px] font-bold text-gray-900 dark:text-white mb-2 block">
                Enter OTP For Verification
              </label>
              <BorderedInput placeholder="Enter OTP" error={true} />
              <div className="flex flex-col items-center mt-1.5 gap-0.5">
                <p className="text-[10px] text-red-500 font-semibold">
                  Incorrect OTP Entered!
                </p>
                <p className="text-[10px] text-gray-500 font-medium">
                  Haven't Recieved OTP Yet?{" "}
                  <span className="text-[#F26A1C] font-bold cursor-pointer">
                    Resend
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <ActionButton onClick={() => setActiveView("add-telebirr-success")}>
            Add Payment Method
          </ActionButton>
        </div>
      </div>
    );
  }

  // --- VIEW 8: Add Telebirr Success ---
  if (activeView === "add-telebirr-success") {
    return (
      <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 px-5 pb-28 font-sans flex flex-col">
        <Header
          title="Add Telebirr"
          showBack
          onBackClick={() => setActiveView("payment")}
        />

        <div className="flex-1 flex flex-col items-center justify-center -mt-10 px-4 text-center">
          {/* Large Success Checkmark */}
          <div className="w-32 h-32 rounded-full border-[6px] border-[#34C759] flex items-center justify-center mb-8 bg-[#34C759]/5">
            <Check size={64} strokeWidth={3} className="text-[#34C759]" />
          </div>

          <h2 className="text-[15px] font-bold text-gray-800 dark:text-white leading-relaxed max-w-[280px]">
            We Have Successfully Recieved Your Submission And Processing It. We
            Will Let You Know Very Soon
          </h2>
        </div>

        <div className="mt-8">
          <ActionButton onClick={() => setActiveView("payment")}>
            Return
          </ActionButton>
        </div>
      </div>
    );
  }

  return null;
}
