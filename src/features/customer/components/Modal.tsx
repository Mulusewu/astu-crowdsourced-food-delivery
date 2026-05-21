import React, { useEffect } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
}) => {
  // Prevent body scrolling when the modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-5 transition-opacity">
      {/* Clickable backdrop to close the modal */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Content Container */}
      <div
        className={cn(
          "relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-[28px] p-6 shadow-2xl",
          "animate-in fade-in zoom-in-95 duration-200", // Smooth entrance animation
          className,
        )}
      >
        {title && (
          <h2 className="text-[18px] font-black text-center text-gray-900 dark:text-white mb-5">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
};
