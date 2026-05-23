// src/store/orders/disputeStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import db from "@/data/database.json";

export type DisputeStatus = "UNDER_REVIEW" | "RESOLVED" | "REJECTED";

export interface Dispute {
  id: string;
  orderId: string;
  raisedById: string;
  assignedAdminId: string | null;
  reason: string;
  evidence: string | null;
  status: DisputeStatus;
  resolution: string | null;
  createdAt: string;
  updatedAt: string;
}

interface DisputeState {
  disputes: Dispute[];
  isLoading: boolean;
  error: string | null;
  
  fetchUserDisputes: (userId: string) => Promise<void>;
  raiseDispute: (disputeData: Omit<Dispute, "id" | "status" | "resolution" | "assignedAdminId" | "createdAt" | "updatedAt">) => Promise<Dispute>;
  getDisputeByOrderId: (orderId: string) => Dispute | undefined;
  clearError: () => void;
}

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export const useDisputeStore = create<DisputeState>()(
  persist(
    (set, get) => ({
      disputes: (db.disputes as Dispute[]),
      isLoading: false,
      error: null,

      fetchUserDisputes: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          await delay(500);
          const userDisputes = (db.disputes as Dispute[]).filter(
            (d) => d.raisedById === userId
          );
          set({ disputes: userDisputes, isLoading: false });
        } catch (e) {
          set({ error: "Failed to fetch disputes", isLoading: false });
        }
      },

      raiseDispute: async (data) => {
        set({ isLoading: true, error: null });
        try {
          await delay(800);
          const now = new Date().toISOString();
          const newDispute: Dispute = {
            ...data,
            id: `disp_${Date.now()}`,
            assignedAdminId: null,
            status: "UNDER_REVIEW",
            resolution: null,
            createdAt: now,
            updatedAt: now,
          };

          // In a real app, this would be a POST request to the backend
          // Here we update the local store state
          set((state) => ({
            disputes: [newDispute, ...state.disputes],
            isLoading: false,
          }));

          return newDispute;
        } catch (e) {
          set({ error: "Failed to raise dispute", isLoading: false });
          throw e;
        }
      },

      getDisputeByOrderId: (orderId) => {
        return get().disputes.find((d) => d.orderId === orderId);
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "dispute-storage",
      partialize: (state) => ({ disputes: state.disputes }),
    }
  )
);
