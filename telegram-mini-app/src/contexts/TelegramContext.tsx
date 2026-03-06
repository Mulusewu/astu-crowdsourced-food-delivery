import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
}

interface TelegramContextType {
  user: TelegramUser | null;
  initTelegram: () => void;
}

const TelegramContext = createContext<TelegramContextType | undefined>(
  undefined,
);

export function TelegramProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<TelegramUser | null>(null);

  const initTelegram = () => {
    // Mock initialization
    setUser({ id: 1, first_name: "Test", username: "testuser" });
  };

  return (
    <TelegramContext.Provider value={{ user, initTelegram }}>
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
