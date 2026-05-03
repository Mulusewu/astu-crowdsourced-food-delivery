import { Suspense } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { LocationProvider } from "./contexts/LocationContext";
import { TelegramProvider } from "./contexts/TelegramContext";
import { ThemeProvider } from "./components/common/ThemeProvider";
import AppRoutes from "./routes/AppRoutes";
import ErrorBoundary from "./components/common/ErrorBoundary";
import LoadingSkeleton from "./components/common/LoadingSkeleton";
import WaitingForPaymentModal from "./components/delivery-person/WaitingForPaymentModal";
import PaymentSuccessModal from "./components/delivery-person/PaymentSuccessModal";
import { Toaster } from "@/components/ui/sonner";

/**
 * AppContent
 * Wraps the main application logic with necessary context providers.
 * Telegram initialization is now handled within TelegramProvider.
 */
function AppContent() {
  return (
    <ErrorBoundary>
      <TelegramProvider>
        <AuthProvider>
          <LocationProvider>
            <CartProvider>
              <Suspense fallback={<LoadingSkeleton />}>
                <div className="min-h-screen bg-background text-foreground">
                  <AppRoutes />
                </div>
              </Suspense>
              {/* Global modals — react to Zustand orderStatus from any page */}
              <WaitingForPaymentModal />
              <PaymentSuccessModal />
              <Toaster position="top-center" expand={false} richColors />
            </CartProvider>
          </LocationProvider>
        </AuthProvider>
      </TelegramProvider>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;