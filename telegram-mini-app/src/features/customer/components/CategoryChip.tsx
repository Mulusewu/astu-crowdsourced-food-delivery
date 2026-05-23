// src/features/customer/components/CategoryChip.tsx
import {type ReactNode } from "react";

interface CategoryChipProps {
  name: string;
  icon: ReactNode;
  onClick?: () => void;
  isActive?: boolean;
}

export default function CategoryChip({
  name,
  icon,
  onClick,
  isActive = false,
}: CategoryChipProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center min-w-[78px] h-20 rounded-3xl border transition-all active:scale-95
        ${isActive 
          ? "border-[#F26A1C] bg-[#F26A1C]/5 text-[#F26A1C]" 
          : "border-gray-200 hover:border-gray-300 bg-white"
        }
      `}
    >
      <div className="text-3xl mb-1">{icon}</div>
      <span className="text-xs font-medium text-gray-700">{name}</span>
    </button>
  );
}