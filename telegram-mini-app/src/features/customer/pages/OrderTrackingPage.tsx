import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Phone,
  Check,
  ChefHat,
  Bike,
  Home,
  Navigation,
} from "lucide-react";
import {
  useCustomerOrderStore,
  type OrderStatus,
} from "@/store/orders/customerOrderStore";

export default function OrderTrackingPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const getOrderById = useCustomerOrderStore((state) => state.getOrderById);

  const order = getOrderById(orderId || "");

  // If order is not found (e.g., hard refresh with bad ID)
  if (!order) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 flex flex-col items-center justify-center px-5 text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Order Not Found
        </h2>
        <p className="text-gray-500 mb-6">
          We couldn't find the tracking details for this order.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="bg-[#F26A1C] text-white px-6 py-3 rounded-full font-bold active:scale-95 transition-transform"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Define our timeline steps
  const steps: {
    key: OrderStatus;
    label: string;
    subtext: string;
    icon: any;
  }[] = [
    {
      key: "placed",
      label: "Order Placed",
      subtext: "We have received your order",
      icon: Check,
    },
    {
      key: "preparing",
      label: "Preparing",
      subtext: "Restaurant is preparing your food",
      icon: ChefHat,
    },
    {
      key: "in_transit",
      label: "On the Way",
      subtext: "Driver is heading to your location",
      icon: Bike,
    },
    {
      key: "delivered",
      label: "Delivered",
      subtext: "Enjoy your meal!",
      icon: Home,
    },
  ];

  // Logic to determine which steps are completed/active
  const statusIndex = steps.findIndex((s) => s.key === order.status);

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 font-sans flex flex-col relative pb-10">
      {/* 1. MAP AREA (Fixed Top) */}
      <div className="relative w-full h-[35vh] bg-gray-200 dark:bg-gray-800">
        {/* Placeholder Map Image */}
        <img
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop"
          alt="Map tracking"
          className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
        />

        {/* Animated Map Marker (Pretend it's the driver) */}
        {order.status === "in_transit" && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-14 h-14 bg-[#F26A1C]/20 rounded-full flex items-center justify-center animate-ping absolute" />
            <div className="w-12 h-12 bg-[#F26A1C] rounded-full border-4 border-white dark:border-gray-900 flex items-center justify-center relative shadow-lg">
              <Navigation size={20} className="text-white fill-white" />
            </div>
          </div>
        )}

        {/* Back Button overlay */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-5 w-10 h-10 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center shadow-md text-gray-900 dark:text-white active:scale-95 transition-transform"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* 2. DRIVER INFO & ETA CARD (Overlaps map) */}
      <div className="px-5 -mt-10 relative z-10">
        <div className="bg-white dark:bg-gray-900 rounded-[24px] shadow-xl p-5 border border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Estimated Delivery
              </p>
              <div className="flex items-center gap-2">
                <Clock size={20} className="text-[#F26A1C]" />
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                  {order.estimatedDelivery}
                </h2>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Order Number
              </p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                #{order.id}
              </p>
            </div>
          </div>

          {/* Driver Info (If assigned) */}
          {order.deliveryPerson ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={order.deliveryPerson.avatar}
                  alt={order.deliveryPerson.name}
                  className="w-12 h-12 rounded-full border-2 border-orange-100 dark:border-gray-800 object-cover"
                />
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {order.deliveryPerson.name}
                  </p>
                  <p className="text-xs font-medium text-gray-500">
                    Delivery Partner • ★ {order.deliveryPerson.rating}
                  </p>
                </div>
              </div>
              <a
                href={`tel:${order.deliveryPerson.phone}`}
                className="w-10 h-10 bg-[#FFF4ED] dark:bg-gray-800 rounded-full flex items-center justify-center text-[#F26A1C] active:scale-95 transition-transform"
              >
                <Phone size={18} className="fill-[#F26A1C]/20" />
              </a>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-gray-500">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center animate-pulse">
                <Bike size={20} />
              </div>
              <p className="text-sm font-medium">
                Assigning a delivery partner...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 3. TIMELINE */}
      <div className="px-5 mt-8">
        <h3 className="font-black text-lg text-gray-900 dark:text-white mb-6">
          Tracking Status
        </h3>

        <div className="relative pl-4 space-y-8">
          {/* Vertical line connecting steps */}
          <div className="absolute top-2 bottom-2 left-[31px] w-0.5 bg-gray-100 dark:bg-gray-800 -z-10" />

          {steps.map((step, idx) => {
            const isCompleted = idx <= statusIndex;
            const isActive = idx === statusIndex;
            const Icon = step.icon;

            return (
              <div key={step.key} className="flex gap-4 relative">
                {/* Step Icon Indicator */}
                <div
                  className={`
                  w-[32px] h-[32px] shrink-0 rounded-full flex items-center justify-center border-4 border-[#FDFDFD] dark:border-gray-950 z-10
                  ${isCompleted ? "bg-[#F26A1C] text-white" : "bg-gray-200 dark:bg-gray-800 text-gray-400"}
                  ${isActive ? "ring-4 ring-orange-100 dark:ring-orange-900/30" : ""}
                `}
                >
                  <Icon size={14} strokeWidth={isCompleted ? 3 : 2} />
                </div>

                {/* Step Text */}
                <div className={`pt-1 ${!isCompleted && "opacity-50"}`}>
                  <p
                    className={`text-sm font-bold ${isActive ? "text-[#F26A1C]" : "text-gray-900 dark:text-white"}`}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">
                    {step.subtext}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. ORDER SUMMARY (Quick view at bottom) */}
      <div className="px-5 mt-10">
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 text-[#F26A1C] mb-3">
            <MapPin size={16} />
            <span className="text-xs font-bold uppercase tracking-wide">
              Delivery Address
            </span>
          </div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Adama Science and Technology University, Block 40, Room 12
          </p>

          <button
            className="w-full py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-900 dark:text-white active:scale-95 transition-transform"
            onClick={() => navigate(`/customer/orders/${orderId}`)}
          >
            View Order Summary
          </button>
        </div>
      </div>
    </div>
  );
}
