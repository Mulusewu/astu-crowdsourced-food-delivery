import { Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth/authStore";

export default function DeliveryLayout() {
  // Auth is handled by ProtectedRoute

  return (
    <>
      <main className="flex-1 pb-28">
        <Outlet />
      </main>
    </>
  );
}
