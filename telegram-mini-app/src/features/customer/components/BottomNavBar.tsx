import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface BottomNavBarProps {
  activeTab?: 'home' | 'bookmarks' | 'history' | 'profile';
  bgColor?: string;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, bgColor = "bg-transparent" }) => {
  const location = useLocation();

  const getIconWrapperClass = (isActive: boolean) =>
    isActive
      ? "w-10 h-10 bg-white text-[#F46424] rounded-full flex items-center justify-center shadow-[0_10px_18px_rgba(0,0,0,0.10)] transition-transform active:scale-95"
      : "w-10 h-10 bg-transparent text-white/90 rounded-full flex items-center justify-center transition-transform active:scale-95";

  const getSvgClass = (_isActive: boolean) => "w-[22px] h-[22px]";

  const isHome = activeTab === 'home' || (!activeTab && location.pathname === '/');
  const isBookmark = activeTab === 'bookmarks' || (!activeTab && location.pathname === '/bookmarks');
  const isHistory = activeTab === 'history' || (!activeTab && location.pathname === '/history');
  const isProfile = activeTab === 'profile' || (!activeTab && location.pathname === '/profile');

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-[420px] px-4 pb-4 safe-bottom pointer-events-none">
      <div className="relative h-[62px] rounded-[30px] bg-[#F46424] shadow-[0_16px_34px_rgba(244,100,36,0.35)] border border-orange-400/20 flex items-center justify-between px-5 overflow-visible pointer-events-auto">
        
        {/* Left Side: Home & Bookmark */}
        <div className="flex items-center gap-5 z-10 justify-start">
          <Link to="/" className="flex items-center justify-center relative">
            <div className={getIconWrapperClass(isHome)}>
               <svg className={getSvgClass(isHome)} fill="currentColor" viewBox="0 0 24 24"><path d="M12 3l8 6v12h-5v-7h-6v7H4V9l8-6z"/></svg>
            </div>
          </Link>
          <Link to="/bookmarks" className="flex items-center justify-center relative">
            <div className={getIconWrapperClass(isBookmark)}>
               <svg className={getSvgClass(isBookmark)} fill="currentColor" viewBox="0 0 24 24"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
            </div>
          </Link>
        </div>

        {/* Center: Floating action (matches notch + white circle) */}
        <div
          className={`absolute left-1/2 -top-7 -translate-x-1/2 w-[78px] h-[78px] rounded-full flex items-center justify-center ${
            bgColor === "bg-transparent" ? "bg-[#FAFAFA]" : bgColor
          }`}
        >
          <Link
            to="/restaurantlist"
            className="w-[56px] h-[56px] bg-white rounded-full shadow-[0_14px_22px_rgba(244,100,36,0.30)] flex items-center justify-center transition-transform active:scale-95"
          >
            <div className="w-[46px] h-[46px] rounded-full border-2 border-[#F46424] flex items-center justify-center text-[#F46424] relative">
              {/* Cube/box icon */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              {/* tiny dots line */}
              <div className="absolute -bottom-1 flex items-center gap-1">
                <span className="w-[3px] h-[3px] rounded-full bg-[#F46424]" />
                <span className="w-[14px] h-[2px] rounded-full bg-[#F46424]" />
                <span className="w-[3px] h-[3px] rounded-full bg-[#F46424]" />
              </div>
            </div>
          </Link>
        </div>

        {/* Right Side: Document/Orders & Profile */}
        <div className="flex items-center gap-5 z-10 justify-end">
          <Link to="/history" className="flex items-center justify-center relative">
            <div className={getIconWrapperClass(isHistory)}>
               <svg className={getSvgClass(isHistory)} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
          </Link>
          <Link to="/profile" className="flex items-center justify-center relative">
            <div className={getIconWrapperClass(isProfile)}>
               <svg className={getSvgClass(isProfile)} fill="currentColor" viewBox="0 0 24 24"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zm-7 8c0-3.866 3.134-7 7-7s7 3.134 7 7H5z"/></svg>
            </div>
          </Link>
        </div>
        
      </div>
    </div>
  );
};

export default BottomNavBar;
