import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/routePaths";

const ORANGE = "#F97316";

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

      <div className="flex items-center gap-2">
        {/* Text */}
        <div
          className="flex flex-col leading-none"
          style={{ filter: "drop-shadow(2px 3px 3px rgba(0,0,0,0.25))" }}
        >
          <span className="text-[2.8rem] font-black text-gray-900">ASTU</span>
          <span className="text-[2.8rem] font-black italic text-orange-500">
            EATS
          </span>
        </div>

        {/* Motorcycle */}
        <div className="flex flex-col items-center">
          <div
            className="relative"
            style={{ animation: "bike-move 0.6s ease-in-out infinite" }}
          >
            <svg viewBox="0 0 140 90" className="w-28 h-[5rem]">

              {/* Speed lines */}
              <line x1="0" y1="60" x2="20" y2="60" stroke={ORANGE} strokeWidth="3"
                style={{ animation: "speed-line 0.5s linear infinite" }} />
              <line x1="5" y1="70" x2="25" y2="70" stroke={ORANGE} strokeWidth="2"
                style={{ animation: "speed-line 0.5s linear infinite 0.2s" }} />

              {/* Bike body */}
              <path
                d="M30 60 Q60 40 100 55"
                stroke={ORANGE}
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
              />

              {/* Seat */}
              <rect x="55" y="40" width="25" height="10" rx="3" fill={ORANGE} />

              {/* Rider */}
              <circle cx="70" cy="25" r="10" fill={ORANGE} />
              <ellipse cx="70" cy="45" rx="12" ry="15" fill={ORANGE} />

              {/* Rear wheel */}
              <g style={{ transformOrigin: "35px 72px", animation: "wheel-spin 0.5s linear infinite" }}>
                <circle cx="35" cy="72" r="12" stroke={ORANGE} strokeWidth="4" />
                <circle cx="35" cy="72" r="4" fill={ORANGE} />
              </g>

              {/* Front wheel */}
              <g style={{ transformOrigin: "105px 72px", animation: "wheel-spin 0.5s linear infinite" }}>
                <circle cx="105" cy="72" r="12" stroke={ORANGE} strokeWidth="4" />
                <circle cx="105" cy="72" r="4" fill={ORANGE} />
              </g>
            </svg>
          </div>

          {/* Delivery text */}
          <span className="text-[1.1rem] font-bold italic text-orange-500 -mt-1">
            Delivery
          </span>
        </div>
      </div>
    </div>
  );
};

// ✅ Main Page
const OfflinePage: React.FC = () => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(false);

  const handleToggle = () => {
    if (isOnline) return;

    setIsOnline(true);

    setTimeout(() => {
      navigate(ROUTES.DELIVERY.DASHBOARD);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">

      {/* Logo */}
      <ASTULogo />

      {/* Title */}
      <h1 className="text-4xl font-bold mt-10 mb-12">
        {isOnline ? "Going Online..." : "You're Offline"}
      </h1>

      {/* Status Message */}
      <div className="flex items-center gap-4 mb-20 max-w-sm">
        <div className={`w-10 h-10 ${isOnline ? 'bg-green-400' : 'bg-yellow-300'} rounded-full flex items-center justify-center text-white text-xl font-bold transition-colors duration-300`}>
          {isOnline ? '✓' : '!'}
        </div>
        <p className="text-lg font-medium text-gray-900">
          {isOnline ? "Connecting..." : "Go Online To Start Receiving Orders"}
        </p>
      </div>

      {/* Toggle Button */}
      <div
        onClick={handleToggle}
        className={`relative flex items-center w-[200px] h-16 border-2 rounded-full cursor-pointer transition-colors duration-300 select-none ${isOnline ? "border-green-500" : "border-gray-500"}`}
        role="button"
        tabIndex={0}
      >
        <div
          className={`absolute w-[50px] h-[50px] rounded-full transition-all duration-300 top-1/2 -translate-y-1/2 ${isOnline ? "bg-green-500 left-[142px]" : "bg-gray-500 left-[6px]"}`}
        ></div>

        <span className={`w-full text-center text-xl font-medium transition-colors duration-300 z-10 ${isOnline ? "text-green-500 pr-9" : "text-gray-500 pl-9"}`}>
          {isOnline ? "Online" : "Offline"}
        </span>
      </div>

    </div>
  );
};

export default OfflinePage;