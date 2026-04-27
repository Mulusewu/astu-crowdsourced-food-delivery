import { Outlet } from "react-router-dom";
import BottomNav from "@/components/common/BottomNav";

const AppLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-[#FDFDFD]">
      <main className="flex-1 pb-28">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default AppLayout;
