import { Outlet, useLocation } from "react-router-dom";
// import { useAuthStore } from "@/store/auth/authStore";
import { ROUTES } from "@/routes/routePaths";
// import { getRoleRedirectPath } from "@/types/user.types";
import CustomerBottomNav from "../customer/components/CustomerBottomNav";
import { TMAStatusBar } from "../customer/components/layout/TMAStatusBar";

export default function CustomerLayout() {
  // const { user, isLoading } = useAuthStore();

  // if (isLoading) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center bg-[#FDFDFD]">
  //       <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#F26A1C] border-t-transparent" />
  //     </div>
  //   );
  // }

  // if (!user) return <Navigate to={ROUTES.AUTH} replace />;
  // if (user.role !== "CUSTOMER") return <Navigate to={getRoleRedirectPath(user.role)} replace />;

  const location = useLocation();
  const isCartPage = location.pathname === ROUTES.CUSTOMER.CART;

  return (
    <>
      <TMAStatusBar />
      <main className={`flex-1 ${isCartPage ? "" : "pb-28"}`}>
        <Outlet />
        {!isCartPage && <CustomerBottomNav />}
      </main>
    </>
  );
}
