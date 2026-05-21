import { Outlet, Navigate, useLocation } from "react-router-dom";
import BottomNav from "@/components/common/BottomNav";
import { useAuthStore } from "@/store/auth/authStore";
import { ROUTES } from "@/routes/routePaths";

export default function VendorLayout() {
  const { user, isLoading } = useAuthStore();
  const location = useLocation();

  // 1. Loading Guard (Prevent flashes of redirect)
  if (isLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-[#F26A1C] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 2. Authentication Guard
  if (!user) {
    return <Navigate to={ROUTES.AUTH} state={{ from: location }} replace />;
  }

  // 3. Strict Role Guard
  // Only VENDOR_STAFF or ADMIN can access the Vendor Layout
  if (user.role !== "VENDOR_STAFF" && user.role !== "ADMIN") {
    // If they aren't authorized, push them to the Customer Home
    return <Navigate to={ROUTES.CUSTOMER.HOME} replace />;
  }

  // 4. Pending Approval & Restaurant Assignment Guard
  // The Vendor flow requires an Admin to manually approve the license AND assign a restaurantId.
  const isApproved = user.status === "ACTIVE";
  const hasRestaurant = !!user.vendorProfile?.restaurantId;

  // We must define an 'unauthorized/pending' page route to trap them in if they aren't ready.
  // Assuming we create a simple 'PendingReviewPage' at '/vendor/pending'
  const isPendingPageRoute = location.pathname === "/vendor/pending";

  if ((!isApproved ) && !isPendingPageRoute && user.role !== "ADMIN") {
    return <Navigate to="/vendor/pending" replace />;
  }

  // If they are on the pending page but they ARE approved, push them to dashboard
  if (isApproved && isPendingPageRoute) {
    return <Navigate to={ROUTES.VENDOR.DASHBOARD} replace />;
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] relative flex flex-col font-outfit antialiased">
      <main className="flex-1 pb-32">
        <Outlet />
      </main>

      {/* Hide BottomNav if they are trapped on the Pending Review page */}
      {/* {!isPendingPageRoute && (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pointer-events-none">
          <div className="pointer-events-auto mx-auto max-w-md">
            
            <BottomNav />
          </div>
        </div>
      )} */}
    </div>
  );
}