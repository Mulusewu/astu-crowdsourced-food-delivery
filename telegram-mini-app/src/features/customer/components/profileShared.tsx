import { forwardRef } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const SoftInput = forwardRef<HTMLInputElement, any>(
  ({ icon: Icon, ...props }, ref) => (
    <div className="relative flex items-center mb-4">
      {Icon && <Icon size={18} className="absolute left-4 text-gray-400" />}
      <input
        ref={ref}
        className={`w-full bg-[#FFF4ED] dark:bg-gray-900 border border-transparent focus:border-[#F26A1C] rounded-[20px] ${Icon ? "pl-11" : "pl-4"} pr-4 py-3.5 text-[13px] font-medium text-gray-900 dark:text-white outline-none transition-colors shadow-sm`}
        {...props}
      />
    </div>
  )
);
SoftInput.displayName = "SoftInput";

export const BorderedInput = forwardRef<HTMLInputElement, any>(
  ({ error, ...props }, ref) => (
    <div className="relative flex items-center">
      <input
        ref={ref}
        className={`w-full bg-white dark:bg-gray-900 border ${error ? "border-red-500" : "border-gray-300 dark:border-gray-700"} focus:border-[#F26A1C] rounded-[14px] px-4 py-3 text-[13px] font-medium text-gray-900 dark:text-white outline-none transition-colors`}
        {...props}
      />
    </div>
  )
);
BorderedInput.displayName = "BorderedInput";

export const ActionButton = ({ children, onClick, disabled, type = "button" }: any) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className="w-full bg-[#F26A1C] hover:bg-[#e05d15] disabled:bg-gray-300 disabled:dark:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-[20px] font-bold text-[15px] py-4 shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all"
  >
    {children}
  </button>
);

export const Header = ({
  title,
  showBack,
}: {
  title: string;
  showBack?: boolean;
}) => {
  const navigate = useNavigate();
  return (
    <div className="relative flex items-center justify-center pt-6 pb-4 mb-2">
      {showBack && (
        <button
          onClick={() => navigate(-1)} // Native router back
          className="absolute left-0 w-10 h-10 bg-orange-50 dark:bg-gray-800 rounded-xl flex items-center justify-center text-[#F26A1C] active:scale-95 transition-transform"
        >
          <ArrowLeft size={20} />
        </button>
      )}
      <h1 className="font-bold text-lg text-gray-900 dark:text-white tracking-wide">
        {title}
      </h1>
    </div>
  );
};
