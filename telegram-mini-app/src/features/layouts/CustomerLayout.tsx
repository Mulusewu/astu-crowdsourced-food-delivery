import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth/authStore";
import CustomerBottomNav from "../customer/components/customerBottomNav";
import { TMAStatusBar } from "../customer/components/layout/TMAStatusBar"; // If you are using this

export default function CustomerLayout() {
  const { activeRole } = useAuthStore();

  // 1. THE GUARD: If they aren't a customer, kick them out immediately.
  // This protects ALL routes inside this layout.
  if (activeRole !== "customer") {
    return <Navigate to={`/${activeRole}/dashboard`} replace />;
  }

  // 2. THE FRAME: This renders once and stays still.
  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 font-sans relative flex flex-col">
      <TMAStatusBar />

      {/* 3. THE PICTURE: pb-28 ensures content doesn't hide behind the nav */}
      <main className="flex-1 pb-28 overflow-y-auto">
        <Outlet />
      </main>

      {/* 4. THE NAVIGATION: Always locked to the bottom */}
      <CustomerBottomNav />
    </div>
  );
}
