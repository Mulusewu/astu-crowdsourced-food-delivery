import { create } from "zustand";
import database from "@/data/database.json";

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface SupportTicket {
  id: string;
  orderId?: string;
  reason: string;
  status: "PENDING" | "UNDER_REVIEW" | "RESOLVED" | "REJECTED";
  createdAt: string;
  resolution?: string;
}

interface SupportState {
  faqs: FAQ[];
  tickets: SupportTicket[];
  isLoading: boolean;
  error: string | null;
  fetchSupportData: (userId: string) => void;
  submitTicket: (ticket: Omit<SupportTicket, "id" | "status" | "createdAt">) => Promise<void>;
}

export const useSupportStore = create<SupportState>((set) => ({
  faqs: [
    {
      id: "1",
      category: "General",
      question: "How does ASTU Eats work?",
      answer: "ASTU Eats is a crowdsourced food delivery platform for ASTU students. You can order from your favorite cafes and have it delivered by fellow students.",
    },
    {
      id: "2",
      category: "Payment",
      question: "What payment methods are supported?",
      answer: "We currently support Telebirr and CBE Birr. We are working on adding more payment options soon.",
    },
    {
      id: "3",
      category: "Delivery",
      question: "How long does delivery take?",
      answer: "Delivery typically takes 15-30 minutes depending on your location and the cafe's preparation time.",
    },
    {
      id: "4",
      category: "Orders",
      question: "Can I cancel my order?",
      answer: "Orders can only be cancelled before they are accepted by the cafe. Once accepted, please contact support for assistance.",
    },
  ],
  tickets: [],
  isLoading: false,
  error: null,

  fetchSupportData: (userId: string) => {
    set({ isLoading: true });
    try {
      // Filter disputes from database.json for this user
      const userDisputes = database.disputes
        .filter((d) => d.raisedById === userId)
        .map((d) => ({
          id: d.id,
          orderId: d.orderId,
          reason: d.reason,
          status: d.status as any,
          createdAt: d.createdAt,
          resolution: d.resolution || undefined,
        }));
      set({ tickets: userDisputes, isLoading: false });
    } catch (err) {
      set({ error: "Failed to fetch support data", isLoading: false });
    }
  },

  submitTicket: async (ticketData) => {
    set({ isLoading: true });
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newTicket: SupportTicket = {
        ...ticketData,
        id: `disp_${Math.random().toString(36).substr(2, 9)}`,
        status: "PENDING",
        createdAt: new Date().toISOString(),
      };
      set((state) => ({
        tickets: [newTicket, ...state.tickets],
        isLoading: false,
      }));
    } catch (err) {
      set({ error: "Failed to submit ticket", isLoading: false });
    }
  },
}));
