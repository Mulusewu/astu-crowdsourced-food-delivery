import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  AlertCircle, 
  Upload, 
  Send, 
  CheckCircle2,
  Loader2,
  FileText,
  ShieldAlert
} from "lucide-react";
import { useAuthStore } from "@/store/auth/authStore";
import { useCustomerOrderStore } from "@/store/orders/customerOrderStore";
import { useDisputeStore } from "@/store/orders/disputeStore";
import { ROUTES } from "@/routes/routePaths";

export default function RaiseDisputePage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  
  const { user } = useAuthStore();
  const order = useCustomerOrderStore((state) => 
    state.orders.find((o) => o.id === orderId)
  );
  const { raiseDispute, isLoading, error, clearError } = useDisputeStore();

  const [reason, setReason] = useState("");
  const [evidence, setEvidence] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!orderId || !order) {
      // If order not found in local store, we might need to fetch it
      // but for now let's assume it's there if they came from OrderDetails
    }
  }, [orderId, order]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !orderId || !reason.trim()) return;

    try {
      await raiseDispute({
        orderId: orderId,
        raisedById: user.id,
        reason: reason,
        evidence: evidence,
      });
      setIsSuccess(true);
      setTimeout(() => navigate(ROUTES.CUSTOMER.ORDERS.DETAILS.replace(":orderId", orderId)), 2000);
    } catch (err) {
      console.error("Dispute submission failed:", err);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 flex flex-col items-center justify-center px-6 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={48} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Dispute Raised</h2>
        <p className="text-gray-500 dark:text-gray-400 font-medium">
          Our support team will review your case and get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 font-sans pb-10">
      {/* ── Header ── */}
      <header className="px-5 pt-6 pb-4 sticky top-0 bg-[#FDFDFD]/90 dark:bg-gray-950/90 backdrop-blur-md z-30 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[14px] flex items-center justify-center text-gray-600 dark:text-gray-400 active:scale-95 transition-transform shadow-sm"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
        <h1 className="text-[17px] font-black text-gray-900 dark:text-white">Raise a Dispute</h1>
        <div className="w-10" />
      </header>

      <main className="px-5 mt-6">
        {/* Info Card */}
        <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800/30 rounded-[24px] p-5 mb-8">
          <div className="flex gap-3 items-start">
            <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shrink-0 shadow-sm">
              <ShieldAlert size={20} className="text-[#F26A1C]" />
            </div>
            <div>
              <h3 className="text-[15px] font-black text-gray-900 dark:text-white mb-1">Order #{order?.shortId}</h3>
              <p className="text-[12px] font-medium text-gray-500 dark:text-gray-400 leading-relaxed">
                Please describe the issue with your order from <span className="font-bold text-[#F26A1C]">{order?.restaurantName}</span>. 
                Include as much detail as possible.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Reason Section */}
          <div className="space-y-2.5">
            <label className="flex items-center gap-2 text-[13px] font-bold text-gray-700 dark:text-gray-300 ml-1">
              <FileText size={16} className="text-[#F26A1C]" />
              Reason for Dispute
            </label>
            <textarea
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="E.g. Food was cold, missing items, wrong order..."
              className="w-full h-40 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[24px] p-5 text-[14px] font-medium text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F26A1C]/20 focus:border-[#F26A1C] transition-all resize-none shadow-sm"
            />
          </div>

          {/* Evidence Section */}
          <div className="space-y-2.5">
            <label className="flex items-center gap-2 text-[13px] font-bold text-gray-700 dark:text-gray-300 ml-1">
              <Upload size={16} className="text-[#F26A1C]" />
              Attach Evidence (Optional)
            </label>
            <div className="relative group">
              <div className="w-full h-32 bg-gray-50 dark:bg-gray-900/50 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[24px] flex flex-col items-center justify-center transition-colors group-hover:border-[#F26A1C]/30">
                <Upload size={24} className="text-gray-400 mb-2 group-hover:text-[#F26A1C] transition-colors" />
                <span className="text-[12px] font-bold text-gray-400 group-hover:text-gray-500 transition-colors">Tap to upload photo</span>
              </div>
              <input 
                type="file" 
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={() => {
                  // In a real app, handle file upload here
                  setEvidence("https://storage.astueats.com/evidence/new_dispute_photo.jpg");
                }}
              />
            </div>
            {evidence && (
              <p className="text-[11px] font-bold text-green-500 mt-2 ml-2 flex items-center gap-1">
                <CheckCircle2 size={12} /> Evidence attached successfully
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30 rounded-xl p-4 flex items-center gap-3 animate-in shake duration-300">
              <AlertCircle size={18} className="text-red-500 shrink-0" />
              <p className="text-[12px] font-bold text-red-600 dark:text-red-400">{error}</p>
              <button onClick={clearError} className="ml-auto text-red-400 hover:text-red-600">
                <X size={14} />
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !reason.trim()}
            className="w-full py-4.5 bg-[#F26A1C] hover:bg-[#e05d15] text-white font-bold rounded-[24px] text-[15px] shadow-[0_8px_20px_rgba(242,106,28,0.25)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 mt-8"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                <Send size={18} />
                Submit Dispute
              </>
            )}
          </button>
        </form>
      </main>

      <footer className="px-10 mt-12 text-center">
        <p className="text-[11px] font-bold text-gray-400 leading-relaxed">
          Disputes are usually reviewed within 24 hours. You will receive a notification once a decision is made.
        </p>
      </footer>
    </div>
  );
}

function X({ size, className }: { size?: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
