import { Suspense, useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import CartProvider from "./contexts/CartContext";
import LocationProvider from "./contexts/LocationContext";
import TelegramProvider from "./contexts/TelegramContext";
import AppRoutes from "./routes/AppRoutes";
// import LoadingSpinner from "./components/common/LoadingSkeleton";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { useTelegram } from "./hooks/useTelegram";
import LoadingSkeleton from "./components/common/LoadingSkeleton";

function App() {
  const { initTelegram } = useTelegram();

  useEffect(() => {
    // Initialize Telegram Mini-App
    initTelegram();
  }, []);

  return (
    <ErrorBoundary>
      <TelegramProvider>
        <AuthProvider>
          <LocationProvider>
            <CartProvider>
              <Suspense fallback={<LoadingSkeleton />}>
                <div className="min-h-screen bg-white mobile-container">
                  <AppRoutes />
                </div>
              </Suspense>
            </CartProvider>
          </LocationProvider>
        </AuthProvider>
      </TelegramProvider>
    </ErrorBoundary>
  );
}

export default App;
