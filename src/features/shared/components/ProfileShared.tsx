import { ArrowLeft } from "lucide-react";
import RoleSwitcher from "@/features/shared/components/RoleSwitcher";

export const Header = ({
  title,
  showBack,
  onBackClick,
}: {
  title: string;
  showBack?: boolean;
  onBackClick?: () => void;
}) => {
  return (
    <div className="relative flex items-center justify-center pt-6 pb-4">
      {showBack && (
        <button
          onClick={onBackClick}
          className="absolute left-5 w-10 h-10 bg-orange-50 dark:bg-gray-800 rounded-xl flex items-center justify-center text-[#F26A1C] active:scale-95 transition-transform"
        >
          <ArrowLeft size={20} />
        </button>
      )}

      <h1 className="font-bold text-xl text-gray-900 dark:text-white tracking-wide">
        {title}
      </h1>

      <RoleSwitcher />
    </div>
  );
};

export const SoftInput = ({ icon: Icon, ...props }: any) => (
  <div className="relative flex items-center mb-4">
    {Icon && <Icon size={18} className="absolute left-4 text-gray-400" />}
    <input
      className={`w-full bg-[#FFF4ED] dark:bg-gray-900 border border-transparent focus:border-[#F26A1C] rounded-[20px] ${Icon ? "pl-11" : "pl-4"} pr-4 py-3.5 text-[13px] font-medium text-gray-900 dark:text-white outline-none transition-colors shadow-sm`}
      {...props}
    />
  </div>
);

export const ActionButton = ({ children, onClick }: any) => (
  <button
    onClick={onClick}
    className="w-full bg-[#F26A1C] hover:bg-[#e05d15] text-white rounded-[16px] font-bold text-[16px] py-4 shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all"
  >
    {children}
  </button>
);
