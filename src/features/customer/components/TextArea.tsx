import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  focusOnLoad?: boolean; // Useful for modals to pop open the keyboard instantly
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  className,
  focusOnLoad,
  ...props
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus logic when the component mounts
  useEffect(() => {
    if (focusOnLoad && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [focusOnLoad]);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-[12px] font-medium text-gray-400 ml-1">
          {label}
        </label>
      )}
      <textarea
        ref={textareaRef}
        className={cn(
          "w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-[16px] px-4 py-3 text-[14px] font-medium text-gray-900 dark:text-white placeholder:text-gray-300 outline-none transition-all shadow-sm",
          "focus:border-[#F26A1C] focus:ring-[3px] focus:ring-[#F26A1C]/10",
          "resize-none", // Prevents breaking the mobile layout
          className,
        )}
        {...props}
      />
    </div>
  );
};
