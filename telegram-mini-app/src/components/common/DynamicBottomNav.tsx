import { useAuthStore } from "@/store/auth/authStore";
import DeliveryBottomNav from "./BottomNav1"; // Your delivery nav
import CustomerBottomNav from "./CustomerBottomNav"; // Assume you have this
// import VendorBottomNav from "./VendorBottomNav";

export default function DynamicBottomNav() {
  const { activeRole } = useAuthStore();

  switch (activeRole) {
    case "delivery":
      return <DeliveryBottomNav />;
    case "vendor":
      // return <VendorBottomNav />;
      return null;
    case "customer":
    default:
      return <CustomerBottomNav />;
  }
}
