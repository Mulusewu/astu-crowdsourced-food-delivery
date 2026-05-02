import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Camera,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  BookOpen,
  CheckCircle,
  Info,
} from "lucide-react";
import { useAuthStore } from "@/store/auth/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Header, SoftInput, ActionButton } from "../components/profileShared";
import { ROUTES } from "@/routes/routePaths";

const PAYMENT_METHODS = [
  { id: "card", label: "Card" },
  { id: "telebirr", label: "Telebirr" },
  { id: "cbe", label: "CBE Birr" },
  { id: "amole", label: "Amole" },
];

const editProfileSchema = z.object({
  fullName: z.string().trim().min(2, "Name is too short"),
  phoneNumber: z.string().trim().optional().or(z.literal("")),
  email: z.string().trim().email("Invalid email").optional().or(z.literal("")),
  astuEmail: z.string().trim().email("Invalid ASTU email").optional().or(z.literal("")),
  defaultLocation: z.string().trim().optional().or(z.literal("")),
});

type EditProfileData = z.infer<typeof editProfileSchema>;

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="w-full bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-[20px] px-4 py-3.5">
      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-0.5">{label}</p>
      <p className="text-[13px] font-semibold text-gray-500 dark:text-gray-400">{value}</p>
    </div>
  );
}

export default function CustomerEditProfilePage() {
  const navigate = useNavigate();
  const { user, updateProfile, isLoading } = useAuthStore();
  const cp = user?.customerProfile;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<EditProfileData>({
    resolver: zodResolver(editProfileSchema),
    mode: "onChange",
    defaultValues: {
      fullName: user?.fullName ?? "",
      email: user?.email ?? "",
      astuEmail: user?.astuEmail ?? "",
      phoneNumber: user?.phoneNumber ?? "",
      defaultLocation: cp?.defaultLocation ?? "",
    },
  });

  const [preferredPayment, setPreferredPayment] = useState(cp?.prefferedPaymentMethod ?? "card");
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data: EditProfileData) => {
    try {
      await updateProfile({
        fullName: data.fullName,
        email: data.email || null,
        astuEmail: data.astuEmail || null,
        phoneNumber: data.phoneNumber || null,
        customerProfile: {
          defaultLocation: data.defaultLocation || null,
          prefferedPaymentMethod: preferredPayment || null,
        },
      });
      setSuccess(true);
      setTimeout(() => navigate(ROUTES.CUSTOMER.PROFILE), 1200);
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
    <form onSubmit={handleSubmit(onSubmit)} className="bg-[#FDFDFD] dark:bg-gray-950 font-sans flex flex-col pb-10 min-h-screen">
      <Header title="Edit Profile" showBack />

      {/* Avatar */}
      <div className="flex flex-col items-center mt-4 mb-6 px-5">
        <div className="relative">
          <div className="absolute inset-0 bg-[#F26A1C] rounded-full scale-105" />
          <Avatar className="relative w-24 h-24 border-[3px] border-white dark:border-gray-900 shadow-md">
            <AvatarImage src={user?.avatarUrl || undefined} className="object-cover" />
            <AvatarFallback className="bg-[#F26A1C] text-white text-2xl font-bold">
              {user?.fullName?.[0] ?? "C"}
            </AvatarFallback>
          </Avatar>
          <button type="button" className="absolute bottom-0 right-0 bg-[#F26A1C] p-2 rounded-full text-white border-2 border-white dark:border-gray-900 shadow-sm active:scale-95 transition-transform">
            <Camera size={14} />
          </button>
        </div>
        <p className="text-[#F26A1C] text-xs font-bold mt-3 cursor-pointer hover:underline">
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
              {...register("fullName")}
              placeholder="Your full name"
            />
            {errors.fullName && <p className="text-xs text-red-500 font-semibold px-2">{errors.fullName.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase px-1 flex items-center gap-1">
              <Phone size={10} /> Phone Number
            </label>
            <SoftInput
              {...register("phoneNumber")}
              type="tel"
              placeholder="+251 9XX XXX XXX"
            />
            {errors.phoneNumber && <p className="text-xs text-red-500 font-semibold px-2">{errors.phoneNumber.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase px-1 flex items-center gap-1">
              <Mail size={10} /> Email
            </label>
            <SoftInput
              {...register("email")}
              type="email"
              placeholder="your@email.com"
            />
            {errors.email && <p className="text-xs text-red-500 font-semibold px-2">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase px-1 flex items-center gap-1">
              <BookOpen size={10} /> ASTU Email
              <span className="text-[9px] font-normal text-gray-400 normal-case ml-1">(optional)</span>
            </label>
            <SoftInput
              {...register("astuEmail")}
              type="email"
              placeholder="your.name@astu.edu.et"
            />
            {errors.astuEmail && <p className="text-xs text-red-500 font-semibold px-2">{errors.astuEmail.message}</p>}
          </div>
        </div>

        {/* ─── Preferences ─── */}
        <div className="bg-white dark:bg-gray-900 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:border dark:border-gray-800 p-4 space-y-4">
          <p className="text-[11px] font-black uppercase tracking-widest text-[#F26A1C]">
            Preferences
          </p>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase px-1 flex items-center gap-1">
              <MapPin size={10} /> Default Delivery Location
            </label>
            <SoftInput
              {...register("defaultLocation")}
              placeholder="e.g. Bole Atlas, Addis Ababa"
            />
            {errors.defaultLocation && <p className="text-xs text-red-500 font-semibold px-2">{errors.defaultLocation.message}</p>}
          </div>

          {/* Preferred Payment Method */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-gray-500 uppercase px-1 flex items-center gap-1">
              <CreditCard size={10} /> Preferred Payment Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PAYMENT_METHODS.map((pm) => (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setPreferredPayment(pm.id)}
                  className={`py-3 rounded-[16px] text-[13px] font-bold transition-all active:scale-[0.98] border ${
                    preferredPayment === pm.id
                      ? "bg-[#FFF1E8] border-[#F26A1C] text-[#F26A1C]"
                      : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500"
                  }`}
                >
                  {pm.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Read-only Account Stats ─── */}
        {cp && (
          <div className="bg-white dark:bg-gray-900 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:border dark:border-gray-800 p-4 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                Account Statistics
              </p>
              <Info size={12} className="text-gray-400" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <ReadOnlyField label="Total Orders" value={String(cp.totalOrders)} />
              <ReadOnlyField label="Rating" value={cp.rating.toFixed(1) + " ★"} />
              <ReadOnlyField
                label="Saved Restaurants"
                value={String(cp.bookmarkRestaurants?.length ?? 0)}
              />
              <ReadOnlyField
                label="Saved Meals"
                value={String(cp.bookmarkMeals?.length ?? 0)}
              />
            </div>
            <p className="text-[11px] text-gray-400 px-1">
              These values are managed by the platform and update automatically.
            </p>
          </div>
        )}

        <ActionButton type="submit" disabled={!isValid || isSubmitting || isLoading}>
          {isLoading || isSubmitting ? "Saving…" : "Save Changes"}
        </ActionButton>
      </div>
    </form>
  );
}
