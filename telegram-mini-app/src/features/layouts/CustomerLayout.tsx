import { Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth/authStore";
import { TMAStatusBar } from "../customer/components/layout/TMAStatusBar"; // If you are using this

export default function CustomerLayout() {
  // Auth is handled by ProtectedRoute

  return (
    <>
      <TMAStatusBar />
      <main className="flex-1 pb-28">
        <Outlet />
      </main>
    </>
  );
}
