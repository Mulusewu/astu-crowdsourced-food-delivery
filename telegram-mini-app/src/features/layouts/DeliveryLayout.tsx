import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth/authStore";
import { ROUTES } from "@/routes/routePaths";
import { getRoleRedirectPath } from "@/types/user.types";
import DeliveryBottomNav from "@/features/delivery/components/DeliveryBottomNav";

export default function DeliveryLayout() {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDFDFD]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#F26A1C] border-t-transparent" />
      </div>
    );
  }

  if (!user) return <Navigate to={ROUTES.AUTH} replace />;
  if (user.role !== "DELIVERER") return <Navigate to={getRoleRedirectPath(user.role)} replace />;

  return (
    <>
      <main className="flex-1 pb-28">
        <Outlet />
      </main>
      <DeliveryBottomNav />
    </>
  );
}
