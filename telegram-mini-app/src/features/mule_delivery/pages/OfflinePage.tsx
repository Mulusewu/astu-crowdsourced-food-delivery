import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routePaths";
import { useDeliveryDashboardStore } from "@/store/deliveryDashboardStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ✅ Logo Component with Realistic Motorcycle Animation
const ASTULogo: React.FC = () => {
  return (
    <div className="flex flex-col items-center select-none">
      <style>
        {`
          @keyframes bike-move {
            0% { transform: translateX(0px) translateY(0px) rotate(0deg); }
            50% { transform: translateX(2px) translateY(-2px) rotate(0.5deg); }
            100% { transform: translateX(0px) translateY(0px) rotate(0deg); }
          }

          @keyframes wheel-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @keyframes speed-line {
            0% { opacity: 1; transform: translateX(0); }
            100% { opacity: 0; transform: translateX(-20px); }
          }
        `}
      </style>

      <div className="flex items-center gap-3">
        {/* Text */}
        <div
          className="flex flex-col leading-none"
        >
          <span className="text-[3rem] font-black text-gray-900 dark:text-white tracking-tighter">ASTU</span>
          <span className="text-[3rem] font-black italic text-[#F26A1C] tracking-tighter -mt-2">
            EATS
          </span>
        </div>

        {/* Motorcycle Icon */}
        <div className="flex flex-col items-center">
          <div
            className="relative"
            style={{ animation: "bike-move 0.6s ease-in-out infinite" }}
          >
            <svg viewBox="0 0 140 90" className="w-28 h-20">
              {/* Speed lines */}
              <line x1="0" y1="60" x2="20" y2="60" stroke="#F26A1C" strokeWidth="3"
                style={{ animation: "speed-line 0.5s linear infinite" }} />
              <line x1="5" y1="70" x2="25" y2="70" stroke="#F26A1C" strokeWidth="2"
                style={{ animation: "speed-line 0.5s linear infinite 0.2s" }} />

              {/* Bike body */}
              <path
                d="M30 60 Q60 40 100 55"
                stroke="#F26A1C"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
              />

              {/* Seat */}
              <rect x="55" y="40" width="25" height="10" rx="3" fill="#F26A1C" />

              {/* Rider */}
              <circle cx="70" cy="25" r="10" fill="#F26A1C" />
              <ellipse cx="70" cy="45" rx="12" ry="15" fill="#F26A1C" />

              {/* Wheels */}
              <g style={{ transformOrigin: "35px 72px", animation: "wheel-spin 0.5s linear infinite" }}>
                <circle cx="35" cy="72" r="12" stroke="#F26A1C" strokeWidth="4" fill="none" />
                <circle cx="35" cy="72" r="4" fill="#F26A1C" />
              </g>
              <g style={{ transformOrigin: "105px 72px", animation: "wheel-spin 0.5s linear infinite" }}>
                <circle cx="105" cy="72" r="12" stroke="#F26A1C" strokeWidth="4" fill="none" />
                <circle cx="105" cy="72" r="4" fill="#F26A1C" />
              </g>
            </svg>
          </div>
          <span className="text-[1.2rem] font-black italic text-[#F26A1C] -mt-1 tracking-widest uppercase">
            Delivery
          </span>
        </div>
      </div>
    </div>
  );
};

export default function OfflinePage() {
  const navigate = useNavigate();
  const { toggleActiveStatus } = useDeliveryDashboardStore();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleGoOnline = () => {
    setIsTransitioning(true);
    // Sync with store
    toggleActiveStatus();
    
    // Smooth transition
    setTimeout(() => {
      navigate(ROUTES.DELIVERY.DASHBOARD);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 flex flex-col items-center justify-center px-6 font-sans">
      
      {/* Animated Logo Section */}
      <div className={cn(
        "transition-all duration-1000 ease-in-out transform",
        isTransitioning ? "scale-110 opacity-0 translate-y-[-20px]" : "scale-100 opacity-100"
      )}>
        <ASTULogo />
      </div>

      <div className={cn(
        "mt-12 text-center transition-all duration-700 delay-200",
        isTransitioning ? "opacity-0 translate-y-10" : "opacity-100"
      )}>
        <h1 className="text-[32px] font-black text-gray-900 dark:text-white leading-tight">
          Ready to Earn?
        </h1>
        <p className="mt-4 text-lg font-medium text-gray-500 dark:text-gray-400 max-w-[280px] mx-auto leading-relaxed">
          Go online to start receiving delivery requests near you.
        </p>
      </div>

      {/* Modern Status Switch */}
      <div className={cn(
        "mt-16 w-full max-w-[280px] transition-all duration-700 delay-300",
        isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
      )}>
        <Button
          onClick={handleGoOnline}
          className="w-full h-16 rounded-[24px] bg-[#F26A1C] hover:bg-[#e05d15] text-white text-xl font-black shadow-[0_12px_32px_rgba(242,106,28,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
        >
          {isTransitioning ? (
            <div className="h-6 w-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Go Online"
          )}
        </Button>
        
        <p className="mt-6 text-[13px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">
          Status: <span className="text-red-500">Offline</span>
        </p>
      </div>

      {/* Decorative Speed Lines */}
      {!isTransitioning && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10 dark:opacity-5">
           <div className="absolute top-1/4 -left-20 w-64 h-1 bg-orange-500 rounded-full blur-sm" />
           <div className="absolute top-2/3 -right-20 w-80 h-1 bg-orange-500 rounded-full blur-sm" />
        </div>
      )}
    </div>
  );
}