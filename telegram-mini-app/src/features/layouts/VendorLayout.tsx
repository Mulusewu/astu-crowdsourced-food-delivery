import { Outlet, Navigate, useLocation } from "react-router-dom";
import BottomNav from "@/components/common/BottomNav";
import { useAuthStore } from "@/store/auth/authStore";
import { ROUTES } from "@/routes/routePaths";

export default function VendorLayout() {
  const { user, activeRole } = useAuthStore();
  const location = useLocation();

  // 1. Authentication Guard
  if (!user && location.pathname !== ROUTES.VENDOR.SIGNUP) {
    return <Navigate to={ROUTES.AUTH} replace />;
  }

  // 2. Pending Approval Guard
  // If the user is a vendor and their status is 'pending', restrict access to dashboard routes
  const isPending = user?.role === "vendor" && user?.status === "pending";
  const isPendingPage = location.pathname === ROUTES.VENDOR.PENDING;
  const isSignupPage = location.pathname === ROUTES.VENDOR.SIGNUP;

  if (isPending && !isPendingPage && !isSignupPage) {
    return <Navigate to={ROUTES.VENDOR.PENDING} replace />;
  }

  // 3. Role Guard
  if (user && activeRole !== "vendor" && !isSignupPage && !isPendingPage) {
    const dashboardPath = activeRole === "customer" ? ROUTES.CUSTOMER.HOME : `/${activeRole}/dashboard`;
    return <Navigate to={dashboardPath} replace />;
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] relative flex flex-col font-outfit antialiased">
      <main className="flex-1 pb-32">
        <Outlet />
      </main>

      {/* Hide BottomNav if on Pending or Signup page */}
      {!isPendingPage && !isSignupPage && (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pointer-events-none">
          <div className="pointer-events-auto mx-auto max-w-md">
            <BottomNav />
          </div>
        </div>
      )}
    </div>
  );
}
