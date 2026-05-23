import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle, Phone, History, Clock } from "lucide-react";
import { useCustomerOrderStore } from "@/store/orders/customerOrderStore";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ROUTES, buildRoute } from "@/routes/routePaths";

type TabType = "Completed" | "Ongoing" | "Cancelled";

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("Completed");

  const rawOrders = useCustomerOrderStore((state: any) => state.orders);
  const fetchOrders = useCustomerOrderStore((state: any) => state.fetchOrders);

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      if (fetchOrders) await fetchOrders();
      setTimeout(() => setIsLoading(false), 400); // Simulate network
    };
    loadOrders();
  }, [fetchOrders]);

  // Categorize Orders
  const ONGOING_STATUSES = [
    "CREATED", "AWAITING_ACCEPT", "ASSIGNED", "AWAITING_PAYMENT", "PAYMENT_RECEIVED",
    "VENDOR_BEING_PREPARED", "VENDOR_FINISHED", "VENDOR_READY_FOR_PICKUP", "PICKED_UP", "EN_ROUTE", "ARRIVED"
  ];
  const COMPLETED_STATUSES = ["DELIVERED", "COMPLETED", "RECEIVED"];
  const CANCELLED_STATUSES = ["CANCELLED", "DISPUTED", "NO_DELIVERER_FOUND"];

  const ongoingOrders = (rawOrders || []).filter((o: any) => ONGOING_STATUSES.includes(o.status));
  const completedOrders = (rawOrders || []).filter((o: any) => COMPLETED_STATUSES.includes(o.status));
  const cancelledOrders = (rawOrders || []).filter((o: any) => CANCELLED_STATUSES.includes(o.status));

  // ── Helper Subcomponents ──

  // 1. Food Images Grid (Matches the "Combo 3 PCS" grid look from the design)
  const OrderItemVisual = ({ items }: { items: any[] }) => {
    if (!items || items.length === 0) return <div className="w-12 h-12 bg-gray-100 rounded-xl" />;

    // Single Item
    if (items.length === 1) {
      const img = items[0].product?.imageUrl || items[0].imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200";
      return <img src={img} alt="food" className="w-12 h-12 rounded-xl object-cover shadow-sm" />;
    }

    // Multiple Items (Grid)
    return (
      <div className="w-12 h-12 rounded-xl overflow-hidden grid grid-cols-2 gap-0.5 bg-gray-100 shadow-sm shrink-0">
        {items.slice(0, 4).map((item, i) => {
          const img = item.product?.imageUrl || item.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100";
          return <img key={i} src={img} alt="food part" className="w-full h-full object-cover" />;
        })}
      </div>
    );
  };

  // 2. Custom Progress Bar for Ongoing Orders
  const OrderProgressBar = ({ status }: { status: string }) => {
    const steps = ["Ordered", "Pick up", "Arrived", "Completed"];
    let currentStep = 0;
    if (["PICKED_UP", "EN_ROUTE"].includes(status)) currentStep = 1;
    if (["ARRIVED"].includes(status)) currentStep = 2;
    if (COMPLETED_STATUSES.includes(status)) currentStep = 3;

    return (
      <div className="mt-5 mb-2 relative px-3">
        {/* Background Line */}
        <div className="absolute top-[5px] left-[12%] right-[12%] h-[3px] bg-gray-100 rounded-full" />
        {/* Active Line */}
        <div
          className="absolute top-[5px] left-[12%] h-[3px] bg-[#F26A1C] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / 3) * 76}%` }}
        />

        {/* Step Nodes */}
        <div className="flex justify-between relative z-10">
          {steps.map((step, idx) => {
            const isActive = idx <= currentStep;
            return (
              <div key={step} className="flex flex-col items-center gap-1.5 w-12">
                <div className={cn(
                  "w-3.5 h-3.5 rounded-full border-[2.5px] transition-colors duration-300",
                  isActive ? "bg-[#F26A1C] border-[#F26A1C] ring-4 ring-orange-50" : "bg-white border-gray-200"
                )} />
                <span className={cn(
                  "text-[9px] font-black uppercase tracking-tight text-center",
                  isActive ? "text-gray-800 dark:text-gray-200" : "text-gray-400"
                )}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 3. Completed / Cancelled Card (Matches Left Screen)
  const HistoryCard = ({ order, isCancelled }: { order: any; isCancelled?: boolean }) => {
    const primaryName = order.items?.[0]?.product?.name || order.items?.[0]?.name || "Order Combo";
    const totalItems = order.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 1;

    return (
      <div
        onClick={() => navigate(`/customer/orders/track/${order.id}`)}
        className="bg-white dark:bg-gray-900 rounded-[24px] p-4 mb-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none dark:border dark:border-gray-800 cursor-pointer active:scale-[0.98] transition-transform"
      >
        <div className="flex justify-between items-center mb-4">
          <span className="font-black text-sm text-gray-900 dark:text-white">Order</span>
          <span className="text-gray-400 font-bold text-[11px] tracking-wider uppercase">
            {order.shortId || order.id.slice(0, 8)}
          </span>
        </div>

        <div className="flex justify-between items-center mb-5">
          <div className="flex gap-3 items-center">
            <OrderItemVisual items={order.items} />
            <div>
              <p className="font-bold text-[14px] text-gray-900 dark:text-white leading-tight mb-0.5 truncate w-[120px]">
                {primaryName}
              </p>
              <p className="text-[11px] font-bold text-gray-400">{totalItems} PCS</p>
            </div>
          </div>
          <div className="font-black text-[#F26A1C] text-[16px]">
            {Number(order.totalAmount).toFixed(0)} Birr
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            {isCancelled ? (
              <div className="flex items-center gap-1 text-red-500">
                <XCircle size={14} strokeWidth={2.5} />
                <span className="text-[11px] font-bold uppercase tracking-wider">Cancelled</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-blue-500">
                <CheckCircle2 size={14} strokeWidth={2.5} className="fill-blue-500 text-white" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-500">Delivered</span>
              </div>
            )}
          </div>

          {!isCancelled && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(buildRoute(ROUTES.CUSTOMER.ORDERS.REVIEW, { orderId: order.id }));
              }}
              className="bg-[#F26A1C] hover:bg-[#e05d15] text-white px-5 py-2.5 rounded-[12px] text-[11px] font-black tracking-wide shadow-md active:scale-95 transition-transform"
            >
              Leave Review
            </button>
          )}
        </div>
      </div>
    );
  };

  // 4. Ongoing Card (Matches Middle Screen)
  const OngoingCard = ({ order }: { order: any }) => {
    const primaryName = order.items?.[0]?.product?.name || order.items?.[0]?.name || "Order Combo";
    const totalItems = order.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 1;

    return (
      <div
        onClick={() => navigate(`/customer/orders/track/${order.id}`)}
        className="bg-white dark:bg-gray-900 rounded-[24px] p-4 mb-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-none dark:border dark:border-gray-800 cursor-pointer active:scale-[0.98] transition-transform relative overflow-hidden"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="bg-yellow-300 text-yellow-900 px-2.5 py-1 rounded-[6px] text-[10px] font-black uppercase tracking-wider">
            {["CREATED", "ASSIGNED", "AWAITING_ACCEPT"].includes(order.status) ? "Ordered" : "Preparing"}
          </div>

          {order.deliverer && (
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-2 py-1.5 rounded-full border border-gray-100 dark:border-gray-700">
              <img
                src={order.deliverer.user?.avatarUrl || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100"}
                alt="Driver"
                className="w-7 h-7 rounded-full object-cover"
              />
              <div className="flex flex-col pr-1">
                <span className="text-[10px] font-bold text-gray-900 dark:text-white leading-tight">
                  {order.deliverer.user?.fullName?.split(" ")[0] || "Driver"}
                </span>
                <span className="text-[9px] font-bold text-[#F26A1C]">★ {order.deliverer.rating || 4.5}</span>
              </div>
              <a
                href={`tel:${order.deliverer.user?.phoneNumber}`}
                onClick={(e) => e.stopPropagation()}
                className="w-7 h-7 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-[#F26A1C] shadow-sm ml-1"
              >
                <Phone size={12} strokeWidth={2.5} />
              </a>
            </div>
          )}
        </div>

        <div className="flex gap-3 items-center mb-2">
          <OrderItemVisual items={order.items} />
          <div>
            <p className="font-bold text-[14px] text-gray-900 dark:text-white leading-tight mb-0.5">
              {primaryName}
            </p>
            <p className="text-[11px] font-bold text-gray-400">{totalItems} PCS</p>
          </div>
        </div>

        <OrderProgressBar status={order.status} />
      </div>
    );
  };


  // ── Main Render ──

  let currentList = completedOrders;
  if (activeTab === "Ongoing") currentList = ongoingOrders;
  if (activeTab === "Cancelled") currentList = cancelledOrders;

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 font-sans flex flex-col relative pb-10">

      {/* HEADER */}
      <header className="px-5 pt-6 pb-2 bg-[#FDFDFD]/90 dark:bg-gray-950/90 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center relative justify-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 w-10 h-10 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-800 active:scale-95 transition-transform"
          >
            <ArrowLeft size={20} strokeWidth={2.5} className="text-gray-900 dark:text-white" />
          </button>
          <h1 className="text-[17px] font-black text-gray-900 dark:text-white tracking-tight">
            History
          </h1>
        </div>

        {/* TABS */}
        <div className="flex w-full border-b border-gray-100 dark:border-gray-800">
          {(["Completed", "Ongoing", "Cancelled"] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 text-center pb-3 text-[14px] font-bold transition-all relative",
                activeTab === tab ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-500"
              )}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#F26A1C] rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </header>

      {/* CONTENT */}
      <main className="px-5 pt-4">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[180px] w-full rounded-[24px]" />
            <Skeleton className="h-[180px] w-full rounded-[24px]" />
          </div>
        ) : currentList.length > 0 ? (
          <div className="animate-in fade-in duration-300">
            {currentList.map((order: any) =>
              activeTab === "Ongoing"
                ? <OngoingCard key={order.id} order={order} />
                : <HistoryCard key={order.id} order={order} isCancelled={activeTab === "Cancelled"} />
            )}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center pt-24 pb-10 text-center px-4 animate-in fade-in">
            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-5 border border-gray-100 dark:border-gray-800">
              {activeTab === "Ongoing" ? <Clock size={32} className="text-gray-300" /> : <History size={32} className="text-gray-300" />}
            </div>
            <h3 className="text-[17px] font-black text-gray-900 dark:text-white mb-2">
              No {activeTab} Orders
            </h3>
            <p className="text-[13px] text-gray-500 font-semibold mb-8 max-w-[250px]">
              {activeTab === "Ongoing"
                ? "You don't have any orders currently in progress."
                : `You don't have any ${activeTab.toLowerCase()} orders yet.`}
            </p>
            {activeTab !== "Ongoing" && (
              <button
                onClick={() => navigate(ROUTES.CUSTOMER.HOME)}
                className="bg-[#FFF4ED] dark:bg-gray-800 text-[#F26A1C] font-black tracking-wide py-3.5 px-8 rounded-full active:scale-95 transition-transform"
              >
                Order Something Now
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}