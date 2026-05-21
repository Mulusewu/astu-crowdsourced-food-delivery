import { CheckCircle2, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDeliveryDashboardStore } from "@/store/deliveryDashboardStore";
import { ROUTES } from "@/routes/routePaths";

export default function PaymentSuccessModal() {
  const navigate = useNavigate();
  const { orderStatus, setOrderStatus } = useDeliveryDashboardStore();

  const isVisible = orderStatus === "paid";

  if (!isVisible) return null;

  const handleStartDelivery = () => {
    setOrderStatus("in_progress");
    // Navigate to active deliveries list as the next step
    navigate(ROUTES.DELIVERY.ACTIVE.LIST);
  };

  return (
    <>
      {/* Keyframe animations */}
      <style>{`
        @keyframes psm-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes psm-scale-in {
          from { opacity: 0; transform: scale(0.9) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes psm-check-bounce {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* ── Backdrop ──────────────────────────────────── */}
      <div
        className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-md"
        style={{ animation: "psm-fade-in 300ms ease both" }}
        aria-hidden="true"
      />

      {/* ── Modal panel ───────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
        style={{
          paddingTop: "env(safe-area-inset-top, 24px)",
          paddingBottom: "env(safe-area-inset-bottom, 24px)",
        }}
      >
        <div
          className="w-full max-w-sm rounded-[32px] bg-white shadow-2xl overflow-hidden"
          style={{ animation: "psm-scale-in 400ms cubic-bezier(0.16, 1, 0.3, 1) both" }}
        >
          {/* ── Content area ────────────────────────── */}
          <div className="flex flex-col items-center px-8 pt-10 pb-8 text-center">
            {/* Success Icon with Animation Container */}
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-emerald-100/50 animate-ping" />
              <div 
                className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-200"
                style={{ animation: "psm-check-bounce 600ms cubic-bezier(0.34, 1.56, 0.64, 1) both" }}
              >
                <CheckCircle2 className="h-10 w-10 text-white" strokeWidth={2.5} />
              </div>
            </div>

            <h2 className="mb-2 text-2xl font-black text-gray-900">
              Payment Successful
            </h2>

            <p className="mb-8 text-[15px] font-medium leading-relaxed text-gray-500">
              The customer has completed the payment. You can now proceed with the delivery process.
            </p>

            {/* ── Action Button ─────────────────────── */}
            <button
              onClick={handleStartDelivery}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[#F26A1C] py-4 text-[16px] font-bold text-white transition-all active:scale-95 hover:bg-[#e05d15] shadow-lg shadow-orange-500/25"
            >
              <span>Start Delivery</span>
              <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Bottom highlight bar */}
          <div className="h-2 w-full bg-emerald-500" />
        </div>
      </div>
    </>
  );
}
