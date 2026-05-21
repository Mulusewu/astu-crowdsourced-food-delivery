import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// src/lib/utils.ts

/**
 * Formats a number as Ethiopian Birr (ETB) currency
 * Example: 1250 → "ETB 1,250"
 */
export const formatCurrency = (amount: number): string => {
  return `ETB ${amount.toLocaleString("en-US")}`;
};

/**
 * Optional: More advanced version with options
 */
export const formatCurrencyAdvanced = (
  amount: number,
  options: {
    showSymbol?: boolean;
    decimals?: number;
  } = {},
): string => {
  const { showSymbol = true, decimals = 0 } = options;

  const formatted = amount.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return showSymbol ? `ETB ${formatted}` : formatted;
};
