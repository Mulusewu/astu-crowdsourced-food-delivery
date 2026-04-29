import { create } from "zustand";
import db from "@/data/database.json";
import { useAuthStore } from "@/store/auth/authStore";

export interface LedgerEntry {
  id: string;
  orderId: string | null;
  userId: string | null;
  amount: number;
  type: string;
  status: string;
  description: string;
  reference: string;
  transferRef: string | null;
  createdAt: string;
}

interface LedgerState {
  entries: LedgerEntry[];
  isLoading: boolean;
  error: string | null;
  fetchDelivererLedger: () => void;
  requestWithdrawal: (amount: number, method: string) => Promise<void>;
}

export const useLedgerStore = create<LedgerState>((set, get) => ({
  entries: [],
  isLoading: false,
  error: null,

  fetchDelivererLedger: () => {
    set({ isLoading: true, error: null });
    const { user } = useAuthStore.getState();
    const userId = user?.id;

    if (!userId) {
      set({ error: "User not authenticated", isLoading: false });
      return;
    }

    try {
      const userEntries = (db.ledgerEntries as any[])
        .filter((entry) => entry.userId === userId)
        .map((entry) => ({
          ...entry,
          amount: Number(entry.amount),
        })) as LedgerEntry[];

      const sortedEntries = userEntries.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      set({ entries: sortedEntries, isLoading: false });
    } catch (err) {
      set({ error: "Failed to fetch ledger entries", isLoading: false });
    }
  },

  requestWithdrawal: async (amount: number, method: string) => {
    set({ isLoading: true, error: null });
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

    const { user } = useAuthStore.getState();
    const newEntry: LedgerEntry = {
      id: `le_${Date.now()}`,
      orderId: null,
      userId: user?.id ?? null,
      amount: -amount, // Negative for withdrawal
      type: "WITHDRAWAL",
      status: "PENDING",
      description: `Withdrawal via ${method}`,
      reference: `ref_wd_${Date.now()}`,
      transferRef: null,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      entries: [newEntry, ...state.entries],
      isLoading: false,
    }));
  },
}));
