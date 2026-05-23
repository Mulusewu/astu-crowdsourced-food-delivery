import { Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth/authStore";
import DeliveryBottomNav from "@/features/delivery/components/DeliveryBottomNav";

/**
 * DeliveryLayout
 * Responsibility: Provide the common UI shell for Delivery-facing pages.
 * Note: Mode & Role guarding is handled by the parent ProtectedRoute in AppRoutes.tsx.
 */
export default function DeliveryLayout() {
  const { isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDFDFD] dark:bg-gray-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#F26A1C] border-t-transparent" />
      </div>
    );
  }

  // Redundant guards removed to allow ProtectedRoute to manage session synchronization safely.

  return (
    <>
      <main className="flex-1 flex flex-col min-h-screen pb-28">
        <Outlet />
      </main>
      <DeliveryBottomNav />
    </>
  );
}
