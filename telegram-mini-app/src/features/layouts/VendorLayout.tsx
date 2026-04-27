import { Outlet } from "react-router-dom";
import VendorBottomNav from "../vendor/components/VendorBottomNav";
// import { TMAStatusBar } from "@/components/layout/TMAStatusBar"; // Optional: Add if using a custom status bar

export default function VendorLayout() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 font-sans relative flex flex-col antialiased">
      {/* <TMAStatusBar /> */}

      {/* pb-28 ensures the scrolling content doesn't get hidden behind the floating wavy nav */}
      <main className="flex-1 pb-28 overflow-y-auto">
        <Outlet />
      </main>

      {/* Locked to the bottom for all vendor pages */}
      <VendorBottomNav />
    </div>
  );
}
