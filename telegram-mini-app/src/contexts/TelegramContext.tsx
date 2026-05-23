import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";

/**
 * Telegram WebApp Types
 */
declare global {
  interface Window {
    Telegram?: {
      WebApp: any;
    };
  }
}

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramContextType {
  webApp: any;
  user: TelegramUser | null;
  isReady: boolean;
  initTelegram: () => void;
  hapticFeedback: {
    impact: (style?: "light" | "medium" | "heavy") => void;
    notification: (type?: "error" | "success" | "warning") => void;
  };
  showBackButton: (onClick: () => void) => void;
  hideBackButton: () => void;
  showAlert: (message: string) => void;
}

const TelegramContext = createContext<TelegramContextType | undefined>(undefined);

export function TelegramProvider({ children }: { children: ReactNode }) {
  const [webApp, setWebApp] = useState<any>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  const initTelegram = useCallback(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      
      setWebApp(tg);
      setUser(tg.initDataUnsafe?.user || null);
      setIsReady(true);

      // Sync background color
      if (tg.themeParams?.bg_color) {
        document.documentElement.style.setProperty("--tg-theme-bg-color", tg.themeParams.bg_color);
      }
    } else {
      // Mock for browser dev
      console.log("[Telegram] Mock initialization");
      setIsReady(true);
    }
  }, []);

  const hapticFeedback = {
    impact: (style: "light" | "medium" | "heavy" = "medium") => {
      webApp?.HapticFeedback?.impactOccurred(style);
    },
    notification: (type: "error" | "success" | "warning" = "success") => {
      webApp?.HapticFeedback?.notificationOccurred(type);
    },
  };

  const showBackButton = useCallback((onClick: () => void) => {
    if (webApp?.BackButton) {
      webApp.BackButton.show();
      webApp.BackButton.onClick(onClick);
    }
  }, [webApp]);

  const hideBackButton = useCallback(() => {
    if (webApp?.BackButton) {
      webApp.BackButton.hide();
      webApp.BackButton.offClick();
    }
  }, [webApp]);

  const showAlert = (message: string) => {
    webApp?.showAlert(message);
  };

  // Auto-init on mount if needed
  useEffect(() => {
    initTelegram();
  }, [initTelegram]);

  return (
    <TelegramContext.Provider 
      value={{ 
        webApp, 
        user, 
        isReady, 
        initTelegram, 
        hapticFeedback, 
        showBackButton, 
        hideBackButton,
        showAlert
      }}
    >
      {children}
    </TelegramContext.Provider>
  );
}

export function useTelegram() {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error("useTelegram must be used within a TelegramProvider");
  }
  return context;
}

export default TelegramProvider;
