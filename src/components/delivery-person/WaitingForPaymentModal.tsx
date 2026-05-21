import { useEffect } from "react";
import { Clock, X, CreditCard, Eye, AlertCircle } from "lucide-react";
import { useDeliveryDashboardStore } from "@/store/deliveryDashboardStore";

/* ─── Helpers ─────────────────────────────────────────── */
function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/* ─── Component ───────────────────────────────────────── */
export default function WaitingForPaymentModal() {
  const {
    orderStatus,
    paymentTimer,
    customerActivity,
    setOrderStatus,
    decreasePaymentTimer,
    resetPaymentTimer,
  } = useDeliveryDashboardStore();

  const isVisible = orderStatus === "awaiting_payment";

  /* Timer countdown — runs only while modal is visible */
  useEffect(() => {
    if (!isVisible) return;
    if (paymentTimer <= 0) {
      setOrderStatus("cancelled");
      return;
    }
    const interval = setInterval(() => {
      decreasePaymentTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [isVisible, paymentTimer, decreasePaymentTimer, setOrderStatus]);

  /* Reset timer whenever modal opens fresh */
  useEffect(() => {
    if (isVisible) resetPaymentTimer(300);
  }, [isVisible]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isVisible) return null;

  /* ─── Activity config ───────────────────────────────── */
  const activityConfig = {
    idle: {
      icon: <AlertCircle className="h-4 w-4 text-amber-400" />,
      label: "Waiting for customer response…",
      color: "text-amber-500",
      bg: "bg-amber-50",
      border: "border-amber-100",
    },
    viewing: {
      icon: <Eye className="h-4 w-4 text-blue-500" />,
      label: "Customer viewing payment page",
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
    paying: {
      icon: <CreditCard className="h-4 w-4 text-emerald-500" />,
      label: "Payment in progress…",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
  } as const;

  const activity = activityConfig[customerActivity];

  const isLow = paymentTimer < 60;
  const timerColor = isLow ? "text-red-500" : "text-[#F26A1C]";
  const timerBg    = isLow ? "bg-red-50"    : "bg-orange-50";
  const timerBorder = isLow ? "border-red-100" : "border-orange-100";

  return (
    <>
      {/* Keyframe animations */}
      <style>{`
        @keyframes wfp-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes wfp-scale-in {
          from { opacity: 0; transform: scale(0.88) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      {/* ── Backdrop ──────────────────────────────────── */}
      <div
        className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm"
        style={{ animation: "wfp-fade-in 220ms ease both" }}
        aria-hidden="true"
      />

      {/*
       * ── Modal panel ─────────────────────────────────────
       * Telegram Mini App safe area handling:
       *   - env(safe-area-inset-top)    → avoids notch / status bar
       *   - env(safe-area-inset-bottom) → avoids iOS home indicator
       * We use inline styles (not Tailwind classes) because Telegram's
       * WebView supports CSS env() natively and inline styles bypass
       * any Tailwind purge issues with rarely-used env() utilities.
       */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="wfp-title"
        className="fixed inset-0 z-[9999] flex items-center justify-center"
        style={{
          paddingTop: "env(safe-area-inset-top, 0px)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          paddingLeft: "max(20px, env(safe-area-inset-left, 20px))",
          paddingRight: "max(20px, env(safe-area-inset-right, 20px))",
        }}
      >
        <div
          className="w-full max-w-sm rounded-[28px] bg-white shadow-2xl overflow-hidden"
          style={{ animation: "wfp-scale-in 260ms cubic-bezier(0.34,1.56,0.64,1) both" }}
        >
          {/* ── Header stripe ────────────────────────── */}
          <div className="relative bg-gradient-to-br from-[#F26A1C] to-[#ff8c4a] px-6 pt-6 pb-8">
            <span className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
            <span className="absolute -left-3 bottom-0 h-14 w-14 rounded-full bg-white/10" />

            <div className="relative flex flex-col items-center gap-3 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm ring-2 ring-white/30">
                <Clock className="h-7 w-7 text-white" strokeWidth={2} />
              </div>

              <h2 id="wfp-title" className="text-[18px] font-black text-white leading-snug">
                Waiting for Customer Payment
              </h2>

              <p className="text-xs font-medium text-white/80 max-w-[240px]">
                Customer has been notified. Delivery will start once the payment
                is completed.
              </p>
            </div>
          </div>

          {/* Pull-up card */}
          <div className="-mt-5 rounded-t-[24px] bg-white px-6 pt-5 pb-6 space-y-4">

            {/* ── Countdown timer ──────────────────── */}
            <div className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${timerBg} ${timerBorder}`}>
              <div className="flex items-center gap-2">
                <Clock className={`h-4 w-4 ${timerColor}`} strokeWidth={2.5} />
                <span className="text-xs font-semibold text-gray-600">Auto-cancel in</span>
              </div>
              <span className={`text-lg font-black tabular-nums ${timerColor} transition-colors duration-500`}>
                {formatTime(paymentTimer)}
              </span>
            </div>

            {/* ── Customer activity status ──────────── */}
            <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${activity.bg} ${activity.border}`}>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                {activity.icon}
              </span>
              <span className={`text-sm font-semibold ${activity.color}`}>
                {activity.label}
              </span>
            </div>

            {/* ── TEST BUTTON: Simulate Success ─────── */}
            <button
              onClick={() => setOrderStatus("paid")}
              className="w-full rounded-xl bg-emerald-50 py-2 text-xs font-bold text-emerald-600 border border-emerald-100 active:scale-95 transition-all"
            >
              [DEBUG] Simulate Payment Success
            </button>

            {/* ── Progress bar ─────────────────────── */}
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-linear ${isLow ? "bg-red-400" : "bg-[#F26A1C]"}`}
                style={{ width: `${(paymentTimer / 300) * 100}%` }}
              />
            </div>

            {/* ── Cancel button ─────────────────────── */}
            <button
              id="wfp-cancel-btn"
              type="button"
              onClick={() => setOrderStatus("cancelled")}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#F26A1C] bg-white py-3.5 text-sm font-bold text-[#F26A1C] transition-all active:scale-95 hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26A1C] focus-visible:ring-offset-2"
            >
              <X className="h-4 w-4" strokeWidth={2.5} />
              Cancel Order
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
