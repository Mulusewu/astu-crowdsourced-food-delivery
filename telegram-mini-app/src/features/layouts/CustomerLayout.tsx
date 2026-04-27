import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth/authStore";
import { TMAStatusBar } from "../customer/components/layout/TMAStatusBar"; // If you are using this

export default function CustomerLayout() {
  const { user, activeRole } = useAuthStore();

  // 1. Authentication Guard
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 2. Role Guard
  if (activeRole !== "customer") {
    return <Navigate to={`/${activeRole}/dashboard`} replace />;
  }

  return (
    <>
      <TMAStatusBar />
      <main className="flex-1 pb-28">
        <Outlet />
      </main>
    </>
  );
}
