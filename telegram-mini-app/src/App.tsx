import { Suspense, useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { LocationProvider } from "./contexts/LocationContext";
import { TelegramProvider } from "./contexts/TelegramContext";
import { ThemeProvider } from "./components/common/ThemeProvider";
import AppRoutes from "./routes/AppRoutes";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { useTelegram } from "./hooks/useTelegram";
import LoadingSkeleton from "./components/common/LoadingSkeleton";

function AppContent() {
  const { initTelegram } = useTelegram();

  useEffect(() => {
    // Initialize Telegram Mini-App
    initTelegram();
  }, [initTelegram]);

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