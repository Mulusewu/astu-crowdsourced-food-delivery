import { Navigate } from "react-router-dom";
import TabsLine from "../components/auth-tabs";
import { useAuthStore } from "@/store/auth/authStore";
import { ROUTES } from "@/routes/routePaths";

function AuthPage() {
  const { user, activeRole } = useAuthStore();

  if (user && activeRole) {
    if (activeRole === "delivery") {
      return <Navigate to={ROUTES.DELIVERY.DASHBOARD} replace />;
    }
    if (activeRole === "vendor") {
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
