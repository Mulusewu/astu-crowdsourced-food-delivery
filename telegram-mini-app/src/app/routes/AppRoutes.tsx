import { Routes, Route } from "react-router-dom";
import { ROUTES } from "./routePaths";

import OtpPage from "@/features/auth/pages/OtpPage";

export default function AppRoutes() {
  return (
    <Routes>
      
      <Route path={ROUTES.OTP} element={<OtpPage />} />
    </Routes>
  );
}