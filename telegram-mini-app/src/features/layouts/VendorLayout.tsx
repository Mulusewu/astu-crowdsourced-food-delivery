import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth/authStore";
// import { TMAStatusBar } from "@/components/layout/TMAStatusBar"; // Optional: Add if using a custom status bar

export default function VendorLayout() {
  const { user, activeRole } = useAuthStore();

  // 1. Authentication Guard
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 2. Role Guard
  if (activeRole !== "vendor") {
    const dashboardPath = activeRole === "customer" ? "/customer/dashboard" : `/${activeRole}/dashboard`;
    return <Navigate to={dashboardPath} replace />;
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 font-sans relative flex flex-col antialiased">
      {/* <TMAStatusBar /> */}

      <main className="flex-1 pb-28">
        <Outlet />
      </main>
    </div>
  );
}
