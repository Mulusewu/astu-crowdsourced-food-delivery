import { Button } from "./Button";

interface CartFooterProps {
  subtotal: number;
  discount: number;
  total: number;
  currency: string;
  isCartEmpty: boolean;
  onPlaceOrder: () => void;
}

export const CartFooter: React.FC<CartFooterProps> = ({
  subtotal,
  discount,
  total,
  currency,
  isCartEmpty,
  onPlaceOrder,
}) => {
  return (
    <div className="bg-[#F4F5F6] dark:bg-gray-900 rounded-t-[24px] px-6 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] mt-auto z-10">
      {/* Summary Lines */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center border-b border-gray-200/80 dark:border-gray-800 pb-3">
          <span className="text-[14px] font-bold text-gray-800 dark:text-gray-300">
            Subtotal
          </span>
          <span
            className={`text-[14px] font-black ${isCartEmpty ? "text-gray-400" : "text-gray-900 dark:text-white"}`}
          >
            {subtotal} {currency}
          </span>
        </div>

        <div className="flex justify-between items-center border-b border-gray-200/80 dark:border-gray-800 pb-3">
          <span className="text-[14px] font-bold text-gray-800 dark:text-gray-300">
            Discount
          </span>
          <span
            className={`text-[14px] font-black ${isCartEmpty ? "text-gray-400" : "text-gray-900 dark:text-white"}`}
          >
            {discount} {currency}
          </span>
        </div>

        <div className="flex justify-between items-center pt-1">
          <span className="text-[15px] font-bold text-gray-900 dark:text-white">
            Total
          </span>
          <span
            className={`text-[15px] font-black ${isCartEmpty ? "text-gray-400" : "text-gray-900 dark:text-white"}`}
          >
            {total} {currency}
          </span>
        </div>
      </div>

      {/* Place Order Button */}
      <Button
        variant="primary"
        fullWidth
        disabled={isCartEmpty}
        onClick={onPlaceOrder}
        // Override the background color to match the gray empty state from your design
        className={isCartEmpty ? "!bg-[#6B7280] !text-white opacity-100" : ""}
      >
        Place Order
      </Button>
    </div>
  );
};
