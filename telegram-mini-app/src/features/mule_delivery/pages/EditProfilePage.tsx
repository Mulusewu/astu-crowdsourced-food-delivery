import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  User,
  Phone,
  Mail,
  MapPin,
  Wallet,
  CheckCircle,
  Info,
} from "lucide-react";
import { useAuthStore } from "@/store/auth/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Header, SoftInput, ActionButton } from "@/features/shared/components/ProfileShared";
import { ROUTES } from "@/routes/routePaths";

const PAYOUT_PROVIDERS = [
  { id: "telebirr", label: "Telebirr" },
  { id: "cbe", label: "CBE Birr" },

];

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="w-full bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-[20px] px-4 py-3.5">
      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-0.5">{label}</p>
      <p className="text-[13px] font-semibold text-gray-500 dark:text-gray-400">{value}</p>
    </div>
  );
}

export default function DeliveryEditProfilePage() {
  const navigate = useNavigate();
  const { user, updateProfile, isLoading } = useAuthStore();
  const dp = user?.delivererProfile;

  // User-level fields
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [astuEmail, setAstuEmail] = useState(user?.astuEmail ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // DelivererProfile fields
  const [currentLocation, setCurrentLocation] = useState(dp?.currentLocation ?? "");
  const [payoutProvider, setPayoutProvider] = useState(dp?.payoutProvider ?? "telebirr");
  const [payoutAccount, setPayoutAccount] = useState(dp?.payoutAccount ?? "");

  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    if (!astuEmail.trim()) {
      newErrors.astuEmail = "ASTU email is mandatory";
    } else if (!/^[a-zA-Z0-9._%+-]+@astu\.edu\.et$/.test(astuEmail)) {
      newErrors.astuEmail = "Please use your university email (@astu.edu.et)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      await updateProfile({
        fullName: fullName.trim(),
        astuEmail: astuEmail.trim(),
        email: email.trim() || null,
        phoneNumber: phoneNumber.trim() || null,
        delivererProfile: {
          currentLocation: currentLocation.trim() || null,
          payoutProvider: payoutProvider || null,
          payoutAccount: payoutAccount.trim() || null,
        },
      });
      setSuccess(true);
      setTimeout(() => navigate(ROUTES.DELIVERY.PROFILE), 1200);
    } catch {
      // error stored in authStore.error
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
          <CheckCircle size={32} className="text-green-500" />
        </div>
        <h2 className="text-xl font-black text-gray-900 dark:text-white">Profile Updated!</h2>
        <p className="text-sm text-gray-500">Redirecting back to your profile…</p>
      </div>
    );
  }

  return (
    <div className="bg-[#FDFDFD] dark:bg-gray-950 font-sans flex flex-col pb-10">
      <Header title="Edit Profile" showBack onBackClick={() => navigate(ROUTES.DELIVERY.PROFILE)} />

      {/* Avatar */}
      <div className="flex flex-col items-center mt-4 mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-[#F26A1C] rounded-full scale-105" />
          <Avatar className="relative w-24 h-24 border-[3px] border-white dark:border-gray-900 shadow-md">
            <AvatarImage src={user?.avatarUrl || undefined} className="object-cover" />
            <AvatarFallback className="bg-[#F26A1C] text-white text-2xl font-bold">
              {user?.fullName?.[0] ?? "D"}
            </AvatarFallback>
          </Avatar>
          <button 
            onClick={() => navigate(ROUTES.DELIVERY.UPLOAD_AVATAR)}
            className="absolute bottom-0 right-0 bg-[#F26A1C] p-2 rounded-full text-white border-2 border-white dark:border-gray-900 shadow-sm active:scale-95 transition-transform"
          >
            <Camera size={14} />
          </button>
        </div>
        <p 
          onClick={() => navigate(ROUTES.DELIVERY.UPLOAD_AVATAR)}
          className="text-[#F26A1C] text-xs font-bold mt-3 cursor-pointer hover:underline"
        >
          Change Profile Picture
        </p>
      </div>

      <div className="px-5 space-y-5">
        {/* ─── Personal Info ─── */}
        <div className="bg-white dark:bg-gray-900 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:border dark:border-gray-800 p-4 space-y-4">
          <p className="text-[11px] font-black uppercase tracking-widest text-[#F26A1C]">
            Personal Information
          </p>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase px-1 flex items-center gap-1">
              <User size={10} /> Full Name
            </label>
            <SoftInput
              value={fullName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
              placeholder="Your full name"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase px-1 flex items-center gap-1">
              <Mail size={10} /> ASTU Email
              <span className="text-[9px] font-black text-[#F26A1C] normal-case ml-1">(Mandatory)</span>
            </label>
            <SoftInput
              value={astuEmail}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAstuEmail(e.target.value)}
              type="email"
              placeholder="name.surname@astu.edu.et"
            />
            {errors.astuEmail && <p className="text-xs text-red-500 font-semibold px-2">{errors.astuEmail}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase px-1 flex items-center gap-1">
              <Mail size={10} /> Personal Email
              <span className="text-[9px] font-normal text-gray-400 normal-case ml-1">(Optional)</span>
            </label>
            <SoftInput
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              type="email"
              placeholder="your@email.com"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase px-1 flex items-center gap-1">
              <Phone size={10} /> Phone Number
            </label>
            <SoftInput
              value={phoneNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
              type="tel"
              placeholder="+251 9XX XXX XXX"
            />
          </div>
        </div>

        {/* ─── Delivery Settings ─── */}
        <div className="bg-white dark:bg-gray-900 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:border dark:border-gray-800 p-4 space-y-4">
          <p className="text-[11px] font-black uppercase tracking-widest text-[#F26A1C]">
            Delivery Settings
          </p>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase px-1 flex items-center gap-1">
              <MapPin size={10} /> Current Location
            </label>
            <SoftInput
              value={currentLocation}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentLocation(e.target.value)}
              placeholder="e.g. Bole, Addis Ababa"
            />
          </div>

          {/* Payout Provider */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-gray-500 uppercase px-1 flex items-center gap-1">
              <Wallet size={10} /> Payout Provider
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PAYOUT_PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPayoutProvider(p.id)}
                  className={`py-3 rounded-[16px] text-[13px] font-bold transition-all active:scale-[0.98] border ${payoutProvider === p.id
                      ? "bg-[#FFF1E8] border-[#F26A1C] text-[#F26A1C]"
                      : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500"
                    }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase px-1">
              Payout Account Number / Phone
            </label>
            <SoftInput
              value={payoutAccount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPayoutAccount(e.target.value)}
              placeholder="e.g. +251912345678 or 1000123456"
              type="tel"
            />
          </div>
        </div>

        {/* ─── Read-only Stats ─── */}
        {dp && (
          <div className="bg-white dark:bg-gray-900 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:border dark:border-gray-800 p-4 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                Account Statistics
              </p>
              <Info size={12} className="text-gray-400" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <ReadOnlyField label="Total Deliveries" value={String(dp.totalDeliveries)} />
              <ReadOnlyField label="Rating" value={dp.rating.toFixed(1) + " ★"} />
              <ReadOnlyField
                label="Total Earnings"
                value={"ETB " + dp.totalEarnings.toLocaleString()}
              />
              <ReadOnlyField
                label="Verification"
                value={dp.verificationStatus}
              />
            </div>
            <p className="text-[11px] text-gray-400 px-1">
              These values are managed by the platform and update automatically.
            </p>
          </div>
        )}

        <ActionButton onClick={handleSave}>
          {isLoading ? "Saving…" : "Save Changes"}
        </ActionButton>
      </div>
    </div>
  );
}
