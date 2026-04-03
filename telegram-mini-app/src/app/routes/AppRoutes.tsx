import { Routes, Route } from "react-router-dom";
import { ROUTES } from "./routePaths";

import OtpPage from "@/features/auth/pages/OtpPage";
import RestaurantListPage from "@/features/customer/pages/RestaurantListPage";
import RestaurantPage from "@/features/customer/pages/RestaurantPage";
import CartPage from "@/features/customer/pages/CartPage";
import CheckoutPage from "@/features/customer/pages/CheckoutPage";
import HistoryPage from "@/features/history/pages/HistoryPage";
import ProfilePage from "@/features/delivery/pages/ProfilePage";
export default function AppRoutes() {
  return (
    <Routes>

      <Route path={ROUTES.OTP} element={<OtpPage />} />
      <Route path={ROUTES.HOME} element={<RestaurantListPage />} />
      <Route path="/restaurantlist" element={<RestaurantListPage />} />
      <Route path="/restaurant/:id" element={<RestaurantPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}