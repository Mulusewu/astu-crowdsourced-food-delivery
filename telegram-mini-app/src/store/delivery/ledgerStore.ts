import { create } from "zustand";
import db from "@/data/database.json";
import { useAuthStore } from "@/store/auth/authStore";

export type TransactionType = 
  | "REIMBURSEMENT_PAYMENT" 
  | "WITHDRAWAL" 
  | "REFUND" 
  | "ORDER_PAYMENT"
  | "BONUS";

export type TransactionStatus = "COMPLETED" | "PENDING" | "FAILED" | "CANCELLED";

export interface LedgerEntry {
  id: string;
  orderId: string | null;
  userId: string | null;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  description: string;
  reference: string;
  transferRef: string | null;
  createdAt: string;
}

interface LedgerState {
  entries: LedgerEntry[];
  isLoading: boolean;
  error: string | null;
  fetchUserLedger: () => Promise<void>;
  requestWithdrawal: (amount: number, method: string) => Promise<void>;
}

const delay = (ms = 800) => new Promise((r) => setTimeout(r, ms));

export const useLedgerStore = create<LedgerState>((set) => ({
  entries: [],
  isLoading: false,
  error: null,

  fetchUserLedger: async () => {
    set({ isLoading: true, error: null });
    await delay(500); // UI feel

    const { user } = useAuthStore.getState();
    const userId = user?.id;

    if (!userId) {
      set({ error: "User not authenticated", isLoading: false });
      return;
    }

    try {
      // Filter entries where this user is the recipient (userId)
      // or if they are a vendor and the entry is related to their restaurant (future expansion)
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
      set({ error: "Failed to fetch transaction history", isLoading: false });
    }
  },

  requestWithdrawal: async (amount: number, method: string) => {
    set({ isLoading: true, error: null });
    await delay(1200); 

    const { user } = useAuthStore.getState();
    if (!user) return;

    const newEntry: LedgerEntry = {
      id: `le_${Date.now()}`,
      orderId: null,
      userId: user.id,
      amount: -Math.abs(amount), // Ensure negative
      type: "WITHDRAWAL",
      status: "PENDING",
      description: `Withdrawal to ${method}`,
      reference: `ref_wd_${Math.random().toString(36).substring(7)}`,
      transferRef: null,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      entries: [newEntry, ...state.entries],
      isLoading: false,
    }));
    
    console.log(`🏦 Withdrawal requested: ${amount} ETB via ${method}`);
  },
}));
