import { ArrowLeft } from "lucide-react";

interface CartHeaderProps {
  onBackClick: () => void;
}

export const CartHeader: React.FC<CartHeaderProps> = ({ onBackClick }) => {
  return (
    <header className="relative flex items-center justify-center pt-4 pb-6 px-5 bg-white dark:bg-gray-950">
      <button
        onClick={onBackClick}
        className="absolute left-5 w-10 h-10 bg-[#FFF4ED] dark:bg-gray-900 rounded-[12px] flex items-center justify-center border border-[#F26A1C]/30 text-[#F26A1C] active:scale-95 transition-transform"
        aria-label="Go back"
      >
        <ArrowLeft size={20} strokeWidth={2.5} />
      </button>

      <h1 className="text-[18px] font-black text-gray-900 dark:text-white tracking-wide">
        Your Cart
      </h1>
    </header>
  );
};
