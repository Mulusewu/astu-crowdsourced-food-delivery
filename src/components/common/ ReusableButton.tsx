import { Button } from "@/components/ui/button";
import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

// Define button variants/types
export type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";
export type ButtonSize = "default" | "sm" | "lg" | "icon";

// Extended props interface
export interface ReusableButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button content */
  children: ReactNode;

  /** Button variant - maps to shadcn variants */
  variant?: ButtonVariant;

  /** Button size - mobile-optimized */
  size?: ButtonSize;

  /** Loading state */
  isLoading?: boolean;

  /** Full width on mobile */
  fullWidth?: boolean;

  /** Optional ID for testing/analytics */
  id?: string;

  /** Custom width override */
  width?: string | number;

  /** Value attribute */
  value?: string | number;

  /** Icon position */
  icon?: ReactNode;
  iconPosition?: "left" | "right";

  /** Optional context/data attribute for global state */
  dataAttribute?: Record<string, string | number | boolean>;

  /** Optional name for form submission */
  name?: string;

  /** Optional form attribute */
  form?: string;
}

// Mobile-first button component
const ReusableButton = forwardRef<HTMLButtonElement, ReusableButtonProps>(
  (
    {
      children,
      variant = "default",
      size = "default",
      isLoading = false,
      fullWidth = false,
      id,
      width,
      value,
      icon,
      iconPosition = "left",
      dataAttribute,
      className = "",
      disabled,
      type = "button",
      name,
      form,
      onClick,
      ...props
    },
    ref,
  ) => {
    // Mobile-optimized size mappings
    const sizeClasses = {
      default: "h-12 px-6 text-base", // 48px touch target
      sm: "h-10 px-4 text-sm", // 40px touch target
      lg: "h-14 px-8 text-lg", // 56px touch target
      xl: "h-16 px-10 text-xl", // 64px touch target
      icon: "h-12 w-12", // 48x48 touch target
    };

    // Base mobile styles
    const baseStyles =
      "rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]";

    // Width styles
    const widthStyles = fullWidth
      ? "w-full"
      : width
        ? `w-[${typeof width === "number" ? width + "px" : width}]`
        : "w-auto";

    // Combine all styles
    const combinedClassName = `
      ${baseStyles}
      ${sizeClasses[size]}
      ${widthStyles}
      ${className}
    `.trim();

    // Handle data attributes for global state
    const dataAttributes = dataAttribute
      ? Object.entries(dataAttribute).reduce(
          (acc, [key, value]) => {
            acc[`data-${key}`] = String(value);
            return acc;
          },
          {} as Record<string, string>,
        )
      : {};

    return (
      <Button
        ref={ref}
        type={type}
        variant={variant}
        size={size}
        disabled={disabled || isLoading}
        className={combinedClassName}
        id={id}
        value={value}
        name={name}
        form={form}
        onClick={onClick}
        aria-busy={isLoading}
        aria-disabled={disabled || isLoading}
        {...dataAttributes}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            {icon && iconPosition === "left" && (
              <span className="flex-shrink-0">{icon}</span>
            )}
            <span>{children}</span>
            {icon && iconPosition === "right" && (
              <span className="flex-shrink-0">{icon}</span>
            )}
          </div>
        )}
      </Button>
    );
  },
);

ReusableButton.displayName = "ReusableButton";

export default ReusableButton;
