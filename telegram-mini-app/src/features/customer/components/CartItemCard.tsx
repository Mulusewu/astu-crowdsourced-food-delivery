import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import type { CartItem } from "@/store/cart/cartStore";

interface CartItemCardProps {
  item: CartItem;
  currency: string;
  onIncrement: () => void;
  onDecrement: () => void;
  onCardClick: () => void;
}

export function CartItemCard({
  item,
  currency,
  onIncrement,
  onDecrement,
  onCardClick,
}: CartItemCardProps) {
  const itemTotal = (item.discountPrice ?? item.price) * item.quantity;

  return (
    <article className="flex items-center gap-3 rounded-[24px] border border-gray-100 bg-[#F8F9FA] p-3 shadow-sm">
      <button
        type="button"
        onClick={onCardClick}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[18px] bg-white ring-1 ring-gray-100">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xs font-semibold text-gray-400">No image</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-bold text-gray-900">
            {item.name}
          </p>
          <p className="mt-1 text-sm font-semibold text-[#F26A1C]">
            {itemTotal.toFixed(2)} {currency}
          </p>
          {item.specialInstructions ? (
            <p className="mt-1 line-clamp-2 text-xs text-gray-500">
              {item.specialInstructions}
            </p>
          ) : (
            <p className="mt-1 text-xs text-gray-400">Tap to add instructions</p>
          )}
        </div>
      </button>

      <div className="flex h-9 items-center justify-between gap-1 rounded-[12px] bg-white p-1 shadow-inner ring-1 ring-gray-200">
        <button
          type="button"
          onClick={onDecrement}
          disabled={item.quantity <= 1}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-lg transition select-none",
            item.quantity > 1
              ? "bg-white ring-1 ring-gray-100"
              : "cursor-not-allowed bg-white opacity-40",
          )}
          aria-label="Decrease quantity"
        >
          <Minus
            size={18}
            className={item.quantity > 1 ? "text-gray-500" : "text-gray-300"}
          />
        </button>

        <span className="w-6 select-none text-center text-[15px] font-bold text-gray-900">
          {item.quantity}
        </span>

        <button
          type="button"
          onClick={onIncrement}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F26A1C] text-white transition select-none"
          aria-label="Increase quantity"
        >
          <Plus size={18} strokeWidth={2.5} />
        </button>
      </div>
    </article>
  );
}
