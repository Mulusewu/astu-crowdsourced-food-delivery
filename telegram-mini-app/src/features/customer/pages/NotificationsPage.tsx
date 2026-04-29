import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, CheckCircle2, Package, Truck, AlertCircle, Info } from "lucide-react";
import { create } from "zustand";
import db from "@/data/database.json";
import { useAuthStore } from "@/store/auth/authStore";

// ─── Inline notification store (lightweight, no separate file needed) ─────────
interface Notification {
  id: string;
  title: string;
  message: string;
  sentAt: string;
  delivered: boolean;
}

interface NotifState {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: () => void;
  markAllRead: () => void;
}

const useNotifStore = create<NotifState>((set) => ({
  notifications: [],
  unreadCount: 0,
  fetchNotifications: () => {
    const { user } = useAuthStore.getState();
    const userId = user?.id ?? "";
    const userNotifs: Notification[] = (db.notifications as any[])
      .filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
    set({ notifications: userNotifs, unreadCount: userNotifs.filter((n) => !n.delivered).length });
  },
  markAllRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, delivered: true })),
      unreadCount: 0,
    })),
}));

// ─── Icon mapping by keyword ───────────────────────────────────────────────────
const getNotifIcon = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("deliver")) return { Icon: Truck, bg: "bg-orange-50", color: "text-[#F26A1C]" };
  if (t.includes("order")) return { Icon: Package, bg: "bg-blue-50", color: "text-blue-500" };
  if (t.includes("confirm")) return { Icon: CheckCircle2, bg: "bg-green-50", color: "text-green-500" };
  if (t.includes("cancel") || t.includes("dispute")) return { Icon: AlertCircle, bg: "bg-red-50", color: "text-red-500" };
  return { Icon: Info, bg: "bg-gray-50", color: "text-gray-500" };
};

// ─── Relative time helper ──────────────────────────────────────────────────────
const relativeTime = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function NotificationsPage() {
  const navigate = useNavigate();
  const { notifications, fetchNotifications, markAllRead } = useNotifStore();

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 font-sans flex flex-col pb-28">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md px-5 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-[#FFF4ED] dark:bg-gray-900 rounded-[12px] flex items-center justify-center text-[#F26A1C] active:scale-95 transition-transform"
            >
              <ArrowLeft size={20} strokeWidth={2.5} />
            </button>
            <h1 className="text-xl font-black text-gray-900 dark:text-white">Notifications</h1>
          </div>
          {notifications.length > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs font-bold text-[#F26A1C] active:opacity-70"
            >
              Mark all read
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 px-5 pt-5">
        {notifications.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-orange-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-5">
              <Bell size={36} className="text-orange-200" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">No Notifications</h3>
            <p className="text-sm text-gray-400 font-medium max-w-[200px]">
              You're all caught up! We'll notify you of important updates here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => {
              const { Icon, bg, color } = getNotifIcon(notif.title);
              const isUnread = !notif.delivered;
              return (
                <div
                  key={notif.id}
                  className={`flex gap-4 p-4 rounded-[20px] border transition-all ${
                    isUnread
                      ? "bg-orange-50/60 dark:bg-orange-900/10 border-orange-100 dark:border-orange-800/30"
                      : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800"
                  } shadow-[0_2px_12px_rgba(0,0,0,0.04)]`}
                >
                  {/* Icon */}
                  <div className={`w-11 h-11 ${bg} rounded-full flex items-center justify-center shrink-0`}>
                    <Icon size={20} className={color} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-[14px] text-gray-900 dark:text-white leading-tight">
                        {notif.title}
                      </p>
                      {isUnread && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#F26A1C] shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2 font-medium">
                      {relativeTime(notif.sentAt)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
