import React from "react";

// TMA StatusBar simulation (top left/right in images)
export const TMAStatusBar: React.FC = () => {
  return (
    <div className="flex justify-between items-center px-4 pt-2 pb-1 text-xs text-black bg-white font-medium select-none z-50">
      {/* Derived time from images */}
      <div className="flex items-center gap-1.5">
        {/* Battery icon simulation (iOS look) */}
      </div>
    </div>
  );
};
