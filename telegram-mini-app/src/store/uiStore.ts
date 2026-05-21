import { create } from "zustand";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface UIStore {
  // State
  isLoading: Record<string, boolean>;
  toasts: Toast[];
  modals: Record<string, boolean>;
  bottomSheets: Record<string, boolean>;

  // Actions
  setLoading: (key: string, isLoading: boolean) => void;

  // Toast actions
  showToast: (toast: Omit<Toast, "id">) => void;
  hideToast: (id: string) => void;
  clearToasts: () => void;

  // Modal actions
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  toggleModal: (modalId: string) => void;

  // Bottom sheet actions
  openBottomSheet: (sheetId: string) => void;
  closeBottomSheet: (sheetId: string) => void;
  toggleBottomSheet: (sheetId: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  // Initial state
  isLoading: {},
  toasts: [],
  modals: {},
  bottomSheets: {},

  // Set loading state for a specific key
  setLoading: (key, isLoading) => {
    set((state) => ({
      isLoading: { ...state.isLoading, [key]: isLoading },
    }));
  },

  // Show a toast notification
  showToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto-hide toast after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, toast.duration || 3000);
    }
  },

  // Hide a specific toast
  hideToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  // Clear all toasts
  clearToasts: () => {
    set({ toasts: [] });
  },

  // Open a modal
  openModal: (modalId) => {
    set((state) => ({
      modals: { ...state.modals, [modalId]: true },
    }));
  },

  // Close a modal
  closeModal: (modalId) => {
    set((state) => ({
      modals: { ...state.modals, [modalId]: false },
    }));
  },

  // Toggle a modal
  toggleModal: (modalId) => {
    set((state) => ({
      modals: { ...state.modals, [modalId]: !state.modals[modalId] },
    }));
  },

  // Open a bottom sheet
  openBottomSheet: (sheetId) => {
    set((state) => ({
      bottomSheets: { ...state.bottomSheets, [sheetId]: true },
    }));
  },

  // Close a bottom sheet
  closeBottomSheet: (sheetId) => {
    set((state) => ({
      bottomSheets: { ...state.bottomSheets, [sheetId]: false },
    }));
  },

  // Toggle a bottom sheet
  toggleBottomSheet: (sheetId) => {
    set((state) => ({
      bottomSheets: {
        ...state.bottomSheets,
        [sheetId]: !state.bottomSheets[sheetId],
      },
    }));
  },
}));
