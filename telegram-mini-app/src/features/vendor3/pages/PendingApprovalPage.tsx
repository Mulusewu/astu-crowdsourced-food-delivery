import { useNavigate } from "react-router-dom";
import { Clock, Info, CheckCircle2, ArrowRight, LogOut } from "lucide-react";
import { ROUTES } from "@/routes/routePaths";
import { useAuthStore } from "@/store/auth/authStore";

export default function PendingApprovalPage() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.AUTH);
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col items-center justify-center px-6">
      <style>{`
        @keyframes pulse-soft {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        .animate-pulse-soft {
          animation: pulse-soft 3s ease-in-out infinite;
        }
      `}</style>

      <div className="w-full max-w-[400px] text-center space-y-8">
        {/* ICON SECTION */}
        <div className="relative flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-orange-50 flex items-center justify-center animate-pulse-soft">
            <Clock size={64} className="text-[#F26A1C]" strokeWidth={1.5} />
          </div>
          <div className="absolute top-0 right-1/4 w-10 h-10 rounded-full bg-green-500 border-4 border-white flex items-center justify-center shadow-lg">
            <CheckCircle2 size={20} className="text-white" />
          </div>
        </div>

        {/* MESSAGE SECTION */}
        <div className="space-y-4">
          <h1 className="text-[32px] font-black text-black leading-tight tracking-tight">
            Application <br />
            <span className="text-[#F26A1C]">Sent Successfully!</span>
          </h1>
          
          <div className="bg-orange-50/50 border border-orange-100 rounded-[24px] p-6 space-y-4 shadow-sm">
            <div className="flex items-start gap-3 text-left">
              <Info size={24} className="text-[#F26A1C] shrink-0 mt-1" />
              <p className="text-[16px] font-bold text-gray-700 leading-relaxed">
                Your application has been successfully sent to the Admin. You will be notified via email once your account is approved.
              </p>
            </div>
            
            <div className="h-[1px] bg-orange-200/30 w-full" />
            
            <p className="text-[14px] font-medium text-gray-500">
              Generally, the approval process takes 24-48 hours. Please check your inbox (and spam folder) for updates.
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="pt-8 space-y-4">
          <button
            onClick={() => navigate(ROUTES.AUTH)}
            className="w-full bg-[#F26A1C] hover:bg-[#e05d15] text-white font-black text-[18px] py-4 rounded-full shadow-xl shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            Go to Sign In <ArrowRight size={20} />
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-4 text-gray-400 font-bold text-sm uppercase tracking-widest hover:text-red-500 transition-all"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <div className="absolute bottom-10 text-center">
        <p className="text-gray-300 text-xs font-bold tracking-widest uppercase">
          ASTU EATS Vendor Portal
        </p>
      </div>
    </div>
  );
}
