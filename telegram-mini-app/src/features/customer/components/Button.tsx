import { cn } from "@/lib/utils"; // Assuming standard Tailwind cn utility

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outlined" | "ghost";
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  fullWidth = false,
  className,
  disabled,
  ...props
}) => {
  const baseClasses =
    "rounded-[20px] font-bold text-[15px] px-6 py-3 transition duration-150 flex items-center justify-center TMA-active-state select-none";

  const variants = {
    primary:
      "bg-[#F26A1C] text-white hover:bg-[#D95F1A] active:scale-[0.98] shadow-md",
    outlined:
      "border-[2.5px] border-[#F26A1C] text-[#F26A1C] bg-white hover:bg-orange-50 active:scale-[0.98]",
    ghost: "bg-transparent text-[#F26A1C] TMA-active-state",
  };

  const disabledClasses = disabled
    ? "opacity-60 cursor-not-allowed pointer-events-none"
    : "";

  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        fullWidth ? "w-full" : "",
        disabledClasses,
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
