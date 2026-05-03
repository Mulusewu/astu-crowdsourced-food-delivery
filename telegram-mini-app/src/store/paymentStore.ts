import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PaymentMethod {
  id: string;
  type: string;
  accountInfo: string;
  isSelected: boolean;
  providerId?: string;
  accountHolder?: string;
  status?: "active" | "pending";
}

interface PaymentStore {
  paymentMethods: PaymentMethod[];
  setSelectedPayment: (id: string) => void;
  addPaymentMethod: (method: Omit<PaymentMethod, "isSelected">) => void;
  removePaymentMethod: (id: string) => void;
}

const INITIAL_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "1",
    type: "Telebirr",
    accountInfo: "+251912345678",
    isSelected: true,
  },
  {
    id: "2",
    type: "CBE Birr",
    accountInfo: "1000123456789",
    isSelected: false,
  },
];

export const usePaymentStore = create<PaymentStore>()(
  persist(
    (set) => ({
      paymentMethods: INITIAL_PAYMENT_METHODS,
      setSelectedPayment: (id) =>
        set((state) => ({
          paymentMethods: state.paymentMethods.map((method) => ({
            ...method,
            isSelected: method.id === id,
          })),
        })),
      addPaymentMethod: (method) =>
        set((state) => ({
          paymentMethods: [
            ...state.paymentMethods,
            { ...method, isSelected: state.paymentMethods.length === 0 },
          ],
        })),
      removePaymentMethod: (id) =>
        set((state) => {
          const remaining = state.paymentMethods.filter((method) => method.id !== id);
          const hasSelected = remaining.some((method) => method.isSelected);

          return {
            paymentMethods: remaining.map((method, index) =>
              hasSelected
                ? method
                : { ...method, isSelected: index === 0 },
            ),
          };
        }),
    }),
    {
      name: "payment-storage",
    }
  )
);
