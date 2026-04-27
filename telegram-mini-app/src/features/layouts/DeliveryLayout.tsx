import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth/authStore";

export default function DeliveryLayout() {
  const { user, activeRole } = useAuthStore();

  // 1. Authentication Guard
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 2. Role Guard
  if (activeRole !== "delivery") {
    const dashboardPath = activeRole === "customer" ? "/customer/dashboard" : `/${activeRole}/dashboard`;
    return <Navigate to={dashboardPath} replace />;
  }

  return (
    <>
      <main className="flex-1 pb-28">
        <Outlet />
      </main>
    </>
  );
}
