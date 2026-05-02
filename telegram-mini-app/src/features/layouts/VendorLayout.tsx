import { Outlet } from "react-router-dom";
import BottomNav from "@/components/common/BottomNav";

export default function VendorLayout() {
  // Authentication check currently bypassed for development

  // 1. Authentication Guard (Bypassed for development)
  // if (!user) {
  //   return <Navigate to="/" replace />;
  // }

  // 2. Role Guard - Allow vendor role to pass (Bypassed for development)
  // if (activeRole !== "vendor") {
  //   const dashboardPath = activeRole === "customer" ? "/customer/dashboard" : `/${activeRole}/dashboard`;
  //   return <Navigate to={dashboardPath} replace />;
  // }

  return (
    <div className="min-h-screen bg-[#FDFDFD] relative flex flex-col font-outfit antialiased">
      <main className="flex-1 pb-32">
        <Outlet />
      </main>

      {/* Fixed Vendor Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pointer-events-none">
        <div className="pointer-events-auto mx-auto max-w-md">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
