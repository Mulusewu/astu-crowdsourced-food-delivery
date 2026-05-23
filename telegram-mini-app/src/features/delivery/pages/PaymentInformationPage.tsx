import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routePaths";

/**
 * PaymentInformationPage is a legacy page that contained hardcoded mock data.
 * The delivery app uses paymentMethod.tsx (accessible at ROUTES.DELIVERY.PAYMENT).
 * This file now redirects to the correct page immediately.
 */
const PaymentInformationPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(ROUTES.DELIVERY.PAYMENT, { replace: true });
  }, [navigate]);

  return null;
};

export default PaymentInformationPage;
