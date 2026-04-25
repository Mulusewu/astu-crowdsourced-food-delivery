import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth/authStore";
import DeliveryBottomNav from "../delivery/components/DeliveryBottomNav";

export default function DeliveryLayout() {
  const { activeRole } = useAuthStore();

  // Guard for Delivery drivers
  if (activeRole !== "delivery") {
    return <Navigate to={`/${activeRole}/dashboard`} replace />;
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 font-sans relative flex flex-col">
      <main className="flex-1 pb-28 overflow-y-auto">
        <Outlet />
      </main>
      <DeliveryBottomNav />
    </div>
  );
}
