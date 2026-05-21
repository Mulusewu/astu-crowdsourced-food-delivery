import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  Wallet,
  TrendingUp,
  ArrowDownLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { apiClient } from "@/api/client/axiosInstance";
import { formatCurrency } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
interface LedgerEntry {
  id: string;
  orderId: string;
  userId: string;
  amount: string;
  type: string;
  status: string;
  description: string | null;
  reference: string;
  transferRef: string;
  createdAt: string;
}

interface EarningsResponse {
  success: boolean;
  totalEarnings: number;
  total: number;
  entries: LedgerEntry[];
}

// ─── Constants ────────────────────────────────────────────────────────────────
const ORANGE = "#F27420";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function shortRef(ref: string): string {
  return ref.replace("AE-PAYOUT-", "").toUpperCase();
}

// ─── EarningsPage ─────────────────────────────────────────────────────────────
export default function EarningsPage() {
  const navigate = useNavigate();

  const [data, setData] = useState<EarningsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await apiClient.get<EarningsResponse>("/ledger/me");
        setData(res.data);
      } catch (err: any) {
        setError(err.message || "Failed to load earnings.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
      {/* ── Header ── */}
      <header className="sticky top-0 z-20 bg-white dark:bg-gray-900 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] shadow-[0_1px_0_rgba(0,0,0,0.06)] dark:border-b dark:border-gray-800">
        <div className="relative flex h-12 items-center justify-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-xl transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2"
            style={{ backgroundColor: "#FFF0E6", color: ORANGE }}
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            My Earnings
          </h1>
        </div>
      </header>

      {/* ── Body ── */}
      <main className="flex-1 overflow-y-auto px-4 py-5 pb-32 space-y-5">
        {/* ── Loading ── */}
        {isLoading && (
          <div className="flex h-[60vh] items-center justify-center">
            <Loader2
              className="h-9 w-9 animate-spin"
              style={{ color: ORANGE }}
            />
          </div>
        )}

        {/* ── Error ── */}
        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center h-[60vh] gap-3 text-center px-4">
            <AlertCircle className="h-10 w-10 text-red-400" />
            <p className="font-semibold text-gray-700 dark:text-gray-300">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 rounded-full px-6 py-2.5 text-sm font-bold text-white shadow-md transition active:scale-95"
              style={{ backgroundColor: ORANGE }}
            >
              Retry
            </button>
          </div>
        )}

        {/* ── Content ── */}
        {!isLoading && !error && data && (
          <>
            {/* ── Summary Card ── */}
            <section
              className="rounded-3xl p-6 text-white shadow-xl"
              style={{
                background: `linear-gradient(135deg, ${ORANGE} 0%, #c95d1a 100%)`,
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/70 uppercase tracking-wider">
                    Total Earnings
                  </p>
                  <p className="text-3xl font-black tracking-tight">
                    {formatCurrency(data.totalEarnings)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/20 pt-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-white/70" />
                  <span className="text-sm text-white/80">
                    <span className="font-bold text-white">{data.total}</span>{" "}
                    completed payouts
                  </span>
                </div>
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider">
                  Direct Transfer
                </span>
              </div>
            </section>

            {/* ── Transaction List ── */}
            <section>
              <h2 className="text-base font-bold text-gray-800 dark:text-white mb-3">
                Payout History
              </h2>

              {data.entries.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-orange-200 dark:border-orange-900/30 bg-orange-50/50 dark:bg-orange-900/10 py-12 text-center">
                  <Wallet
                    className="mb-3 h-10 w-10"
                    style={{ color: ORANGE }}
                  />
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                    No payouts yet.
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Complete deliveries to start earning.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.entries.map((entry) => (
                    <article
                      key={entry.id}
                      className="flex items-center gap-4 rounded-2xl bg-white dark:bg-gray-900 p-4 shadow-sm ring-1 ring-gray-100 dark:ring-gray-800"
                    >
                      {/* Icon */}
                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                        style={{ backgroundColor: "#FFF0E6" }}
                      >
                        <ArrowDownLeft
                          className="h-5 w-5"
                          style={{ color: ORANGE }}
                        />
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                            Payout #{shortRef(entry.reference)}
                          </p>
                          <p
                            className="shrink-0 text-base font-black"
                            style={{ color: ORANGE }}
                          >
                            +{formatCurrency(Number(entry.amount))}
                          </p>
                        </div>
                        <div className="mt-1 flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {formatDate(entry.createdAt)}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 dark:bg-green-900/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-600 dark:text-green-400">
                            <CheckCircle className="h-3 w-3" />
                            {entry.status}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
