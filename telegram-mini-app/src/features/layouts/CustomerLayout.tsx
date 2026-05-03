import { Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth/authStore";
import CustomerBottomNav from "../customer/components/CustomerBottomNav";
import { TMAStatusBar } from "../customer/components/layout/TMAStatusBar";

/**
 * CustomerLayout
 * Responsibility: Provide the common UI shell for Customer-facing pages.
 * Note: Mode & Role guarding is handled by the parent ProtectedRoute in AppRoutes.tsx.
 */
export default function CustomerLayout() {
  const { isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDFDFD] dark:bg-gray-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#F26A1C] border-t-transparent" />
      </div>
    );
  }

  // We no longer perform Navigate redirects here to avoid conflicts with the 
  // ProtectedRoute's Auto-Fix mechanism and the top-level AppRoutes logic.

  const isCartPage = location.pathname.includes("/cart") || location.pathname.includes("/checkout");

  return (
    <>
      <TMAStatusBar />
      <main className={`flex-1 flex flex-col min-h-screen ${isCartPage ? "" : "pb-28"}`}>
        <Outlet />
        {!isCartPage && <CustomerBottomNav />}
      </main>
    </>
  );
}
