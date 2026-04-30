import { Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth/authStore";
// import { TMAStatusBar } from "@/components/layout/TMAStatusBar"; // Optional: Add if using a custom status bar

export default function VendorLayout() {
  // Auth is handled by ProtectedRoute

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 font-sans relative flex flex-col antialiased">
      {/* <TMAStatusBar /> */}

      <main className="flex-1 pb-28">
        <Outlet />
      </main>
    </div>
  );
}
