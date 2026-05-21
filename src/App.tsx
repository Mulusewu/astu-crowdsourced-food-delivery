import { Suspense, useEffect } from "react";
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
import { useAuthStore } from "@/store/auth/authStore";
import { useOrderStore } from "@/store/orders/orderStore";

/**
 * AppContent
 * Wraps the main application logic with necessary context providers.
 * Telegram initialization is now handled within TelegramProvider.
 */
function AppContent() {
   const { token, logout, user, activeMode, refreshProfile } = useAuthStore();
const { connectDispatchSocket, disconnectDispatchSocket } = useOrderStore();

 useEffect(() => {
    if (token) {
      refreshProfile().catch(() => logout());
    }
  }, [token]); 

    useEffect(() => {
    // Only connect if they are explicitly in Deliverer mode
    if (token && user && activeMode === "DELIVERER") {
      connectDispatchSocket();
    } else {
      // If they switch to CUSTOMER mode, kill the socket to prevent ghost broadcasts
      disconnectDispatchSocket();
    }
     return () => {
      disconnectDispatchSocket();
    };
  }, [token, activeMode]); 

  //   useEffect(() => {
  //   const validateSession = async () => {
  //     if (token) {
  //       try {
  //         // Hit the backend to get the actual, untampered user profile
  //         const res = await apiClient.get('/users/me');
  //         setUser(res.data.data); // Hydrate Zustand with real DB data
  //       } catch (error) {
  //         console.error("Session invalid or expired", error);
  //         logout(); // Force them out if token is dead
  //       }
  //     }
  //   };
  //   validateSession();
  // }, []);

  return (
    <ErrorBoundary>
      <TelegramProvider>
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