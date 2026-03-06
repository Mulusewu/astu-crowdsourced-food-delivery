import { useEffect, useState } from "react";

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

export function useTelegram() {
  const [webApp, setWebApp] = useState<any>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  const initTelegram = () => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;

      tg.ready();
      tg.expand();

      setWebApp(tg);
      setUser(tg.initDataUnsafe?.user || null);
      setIsReady(true);

      // Set theme
      document.documentElement.style.setProperty(
        "--tg-theme-bg-color",
        tg.themeParams?.bg_color || "#ffffff",
      );
    }
  };

  const hapticFeedback = {
    impact: (style: "light" | "medium" | "heavy" = "medium") => {
      webApp?.HapticFeedback?.impactOccurred(style);
    },
    notification: (type: "error" | "success" | "warning" = "success") => {
      webApp?.HapticFeedback?.notificationOccurred(type);
    },
  };

  const showAlert = (message: string) => {
    webApp?.showAlert(message);
  };

  const showConfirm = async (message: string): Promise<boolean> => {
    return webApp?.showConfirm(message) || false;
  };

  const close = () => {
    webApp?.close();
  };

  return {
    webApp,
    user,
    isReady,
    isTelegram: !!webApp,
    initTelegram,
    hapticFeedback,
    showAlert,
    showConfirm,
    close,
  };
}
