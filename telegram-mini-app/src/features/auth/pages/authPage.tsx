import { Navigate } from "react-router-dom";
import TabsLine from "../components/auth-tabs";
import { useAuthStore } from "@/store/auth/authStore";
import { ROUTES } from "@/routes/routePaths";

function AuthPage() {
  const { user } = useAuthStore();

  if (user) {
    if (user.role === "DELIVERER") {
      return <Navigate to={ROUTES.DELIVERY.DASHBOARD} replace />;
    }
    if (user.role === "VENDOR_STAFF") {
      return <Navigate to={ROUTES.VENDOR.DASHBOARD} replace />;
    }
    return <Navigate to={ROUTES.CUSTOMER.HOME} replace />;
  }

  return (
    <div>
      <TabsLine />
    </div>
  );
}

export default AuthPage;
