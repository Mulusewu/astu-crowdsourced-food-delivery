// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { ROUTES } from "@/routes/routePaths";
// import {
//   User,
//   MapPin,
//   Bookmark,
//   Search,
//   SlidersHorizontal,
//   LogOut,
//   Package,
//   ChevronDown, 
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Skeleton } from "@/components/ui/skeleton";

// import { cn } from "@/lib/utils";
// import { useDeliveryDashboardStore } from "@/store/deliveryDashboardStore";
// import { useAuthStore } from "@/store/auth/authStore";
// import { useSavedItemsStore } from "@/store/savedItemsStore";

// function firstName(fullName: string) {
//   return fullName.split(/\s+/)[0] ?? fullName;
// }

// function firstInitial(fullName: string) {
//   return (fullName.trim()[0] ?? "U").toUpperCase();
// }

// export default function DeliveryDashboard() {
//   const navigate = useNavigate();

//   // Zustand Store
//   const {
//     deliveryPerson,
//     cafes,
//     cheapOrders,
//     isLoading,
//     fetchDashboardData,
//     toggleActiveStatus,
//   } = useDeliveryDashboardStore();
//   const { user, logout } = useAuthStore();
//   const { toggleItem, isSaved } = useSavedItemsStore();

//   // Local UI-only states
//   const [locationValue, setLocationValue] = useState("all");
//   const [isLocationOpen, setIsLocationOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showProfileMenu, setShowProfileMenu] = useState(false);

//   useEffect(() => {
//     if (user?.id) {
//       fetchDashboardData(user.id);
//     } else {
//       fetchDashboardData();
//     }
//   }, [fetchDashboardData, user?.id]);

//   const handleToggleActive = () => {
//     toggleActiveStatus((path) => navigate(path));
//   };

//   if (isLoading) {
//     return (
//       <div className="flex min-h-screen flex-col bg-white animate-in fade-in duration-500">
//         <div className="sticky top-0 z-10 bg-white px-4 pb-3 pt-4">
//           <div className="flex items-start justify-between">
//             <div className="space-y-2">
//               <Skeleton className="h-4 w-24" />
//               <Skeleton className="h-8 w-32" />
//             </div>
//             <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
//           </div>
//           <Skeleton className="mt-4 h-12 w-full rounded-full" />
//           <div className="mt-4 flex gap-2">
//             <Skeleton className="h-10 w-16 rounded-xl" />
//             <Skeleton className="h-10 flex-1 rounded-xl" />
//             <Skeleton className="h-10 w-28 rounded-full" />
//           </div>
//         </div>
//         <div className="flex-1 space-y-4 px-4 py-4">
//           <Skeleton className="h-5 w-40" />
//           <div className="flex gap-3">
//             <Skeleton className="h-44 w-40 shrink-0 rounded-2xl" />
//             <Skeleton className="h-44 w-40 shrink-0 rounded-2xl" />
//           </div>
//           <Skeleton className="h-5 w-64" />
//           <Skeleton className="h-56 w-full rounded-2xl" />
//         </div>
//       </div>
//     );
//   }

//   const name = user?.name || deliveryPerson?.name || "";
//   const online = deliveryPerson?.isActive ?? false;

//   const filteredCafes =
//     locationValue === "all"
//       ? cafes
//       : cafes.filter((cafe) =>
//         cafe.location.toLowerCase().includes(locationValue.toLowerCase()),
//       );

//   return (
//     <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
//       <header className="sticky top-0 z-20 bg-white px-4 pb-3 pt-4 shadow-[0_1px_0_rgba(0,0,0,0.06)]">
//         <div className="flex items-start justify-between gap-3">
//           <div>
//             <p className="text-3xl font-medium text-primary">Welcome Back,</p>
//             <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-[1.75rem]">
//               {firstName(name)}
//             </h1>
//           </div>
//           <div className="relative shrink-0">
//             {/* Click-away overlay for Profile Menu */}
//             {showProfileMenu && (
//               <div
//                 className="fixed inset-0 z-[90]"
//                 onClick={() => setShowProfileMenu(false)}
//               />
//             )}
//             <button
//               type="button"
//               onClick={() => setShowProfileMenu(!showProfileMenu)}
//               className="relative z-[101] flex h-11 w-11 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
//               aria-label="Account menu"
//             >
//               {user?.avatar || deliveryPerson?.avatar ? (
//                 <img
//                   src={user?.avatar || deliveryPerson?.avatar}
//                   alt=""
//                   className="h-full w-full rounded-full object-cover"
//                 />
//               ) : (
//                 firstInitial(name)
//               )}
//             </button>
//             {showProfileMenu && (
//               <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-100 bg-white py-2 shadow-lg z-[100] animate-in fade-in zoom-in-95 duration-200">
//                 <div className="border-b border-gray-100 px-4 py-3">
//                   <p className="text-sm font-medium text-gray-900">{name}</p>
//                   <p className="text-xs text-gray-500">
//                     {user?.email || deliveryPerson?.email}
//                   </p>
//                 </div>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     navigate(ROUTES.DELIVERY.PROFILE);
//                     setShowProfileMenu(false);
//                   }}
//                   className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
//                 >
//                   <User size={16} /> View Profile
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => {
//                     logout();
//                     navigate(ROUTES.AUTH);
//                     setShowProfileMenu(false);
//                   }}
//                   className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
//                 >
//                   <LogOut size={16} /> Sign Out
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="relative mt-4">
//           <Search
//             className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
//             aria-hidden
//           />
//           <Input
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Search"
//             className="h-12 rounded-full border-gray-200 bg-white pl-12 pr-12 text-base shadow-none"
//           />
//           <button
//             type="button"
//             className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-gray-500 hover:bg-gray-100"
//             aria-label="Filters"
//           >
//             <SlidersHorizontal className="h-5 w-5" />
//           </button>
//         </div>

//         <div className="mt-4 flex w-full flex-wrap items-center gap-2 sm:flex-nowrap">
//           <Button
//             type="button"
//             className="h-10 shrink-0 rounded-xl bg-[#F26A1C] px-5 font-bold text-white shadow-md hover:bg-[#F26A1C]/90 focus:ring-2 focus:ring-[#F26A1C] focus:ring-offset-1 transition-all active:scale-95"
//           >
//             ALL
//           </Button>
//           {/* Custom Dropdown Container */}
//           <div className="relative">
//             {/* Click-away overlay */}
//             {isLocationOpen && (
//               <div
//                 className="fixed inset-0 z-40"
//                 onClick={() => setIsLocationOpen(false)}
//               />
//             )}

//             <button
//               onClick={() => setIsLocationOpen(!isLocationOpen)}
//               className="relative z-50 flex h-10 w-[130px] items-center justify-between rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-[#F26A1C]/50 hover:text-[#F26A1C] focus-visible:ring-1 focus-visible:ring-[#F26A1C]"
//             >
//               <span className="truncate">
//                 {locationValue === "all" ? "All Locations" : locationValue}
//               </span>
//               <ChevronDown
//                 className="size-4 shrink-0 text-[#F26A1C] transition-transform"
//                 style={{
//                   transform: isLocationOpen ? "rotate(180deg)" : "rotate(0deg)",
//                 }}
//               />
//             </button>

//             {/* Dropdown Menu */}
//             {isLocationOpen && (
//               <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-[140px] rounded-xl border border-gray-100 bg-white shadow-xl animate-in fade-in zoom-in-95 duration-150">
//                 <div className="flex flex-col p-1.5">
//                   {["All Locations", "Bole Gate", "Geda gate", "Main Gate"].map(
//                     (loc) => {
//                       const val = loc === "All Locations" ? "all" : loc;
//                       const isSelected = locationValue === val;
//                       return (
//                         <button
//                           key={loc}
//                           onClick={() => {
//                             setLocationValue(val);
//                             setIsLocationOpen(false);
//                           }}
//                           className={cn(
//                             "flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
//                             isSelected
//                               ? "bg-orange-50 text-[#F26A1C]"
//                               : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
//                           )}
//                         >
//                           {loc}
//                         </button>
//                       );
//                     },
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//           <button
//             type="button"
//             role="switch"
//             aria-checked={online}
//             aria-label={online ? "Online" : "Offline"}
//             onClick={handleToggleActive}
//             className={cn(
//               "ml-auto flex shrink-0 items-center gap-1.5 rounded-full border-2 py-1 pl-2.5 pr-1 shadow-sm transition-colors duration-200",
//               online
//                 ? "border-primary bg-white"
//                 : "border-gray-300 bg-gray-200",
//             )}
//           >
//             <span
//               className={cn(
//                 "text-xs font-semibold transition-colors duration-200",
//                 online ? "text-gray-900" : "text-gray-600",
//               )}
//             >
//               {online ? "Online" : "Offline"}
//             </span>
//             <span
//               className={cn(
//                 "relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200",
//                 online ? "bg-primary" : "bg-gray-400",
//               )}
//             >
//               <span
//                 className={cn(
//                   "absolute top-0.5 h-4 w-4 rounded-full shadow-sm transition-all duration-200",
//                   online
//                     ? "right-0.5 bg-white"
//                     : "left-0.5 bg-gray-100 ring-1 ring-gray-400/50",
//                 )}
//               />
//             </span>
//           </button>
//         </div>
//       </header>

//       <main className="flex-1 overflow-y-auto px-4 pt-5">
//         <section>
//           <h2 className="mb-3 text-base font-semibold text-gray-900">
//             Cheap Orders
//           </h2>
//           <div className="-mx-1 flex gap-3 overflow-x-auto pb-2 pt-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
//             {cheapOrders.map((order) => (
//               <article
//                 key={order.id}
//                 className="relative flex min-w-[158px] max-w-[158px] shrink-0 flex-col items-center overflow-visible rounded-2xl bg-white px-3 pb-3 pt-2 shadow-[0_4px_20px_rgba(0,0,0,0.08)] ring-1 ring-gray-100"
//               >
//                 <span
//                   className="absolute right-3 top-3 z-[1] h-2 w-2 rounded-sm bg-primary"
//                   aria-hidden
//                 />
//                 {/* In-flow + negative margin: participates in layout so horizontal scroll does not clip the circle like position:absolute. */}
//                 <div className="z-[1] -mt-10 mb-1 flex justify-center">
//                   <div className="h-[5rem] w-[5rem] shrink-0 overflow-hidden rounded-full border-[3px] border-white bg-gray-50 shadow-md ring-1 ring-black/5">
//                     <img
//                       src={order.image}
//                       alt=""
//                       className="h-full w-full object-contain object-center"
//                     />
//                   </div>
//                 </div>
//                 <p className="mt-1 text-center text-sm font-semibold text-gray-900">
//                   Order #{order.orderNo}
//                 </p>
//                 <div className="mt-1 flex items-center justify-center gap-1 text-xs text-gray-600">
//                   <Package
//                     className="h-3.5 w-3.5 text-primary"
//                     strokeWidth={2}
//                   />
//                   <span>{order.items} items</span>
//                 </div>
//                 <p className="mt-1 text-center text-sm font-bold text-gray-900">
//                   {order.priceEtb} ETB
//                 </p>
//                 <Button
//                   type="button"
//                   size="sm"
//                   onClick={() => navigate(`/delivery/available/${order.id}`)}
//                   className="mt-3 h-9 w-full rounded-full bg-primary text-xs font-semibold text-white hover:bg-primary/90 shadow-md transition-all active:scale-95"
//                 >
//                   View Detail
//                 </Button>
//               </article>
//             ))}
//           </div>
//         </section>

//         <section className="mt-8">
//           <h2 className="mb-3 text-base font-semibold text-gray-900">
//             Restaurants With Active Orders
//           </h2>
//           <div className="space-y-5">
//             {filteredCafes.map((cafe) => (
//               <article
//                 key={cafe.id}
//                 className="overflow-hidden rounded-2xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)] ring-1 ring-gray-100"
//               >
//                 <div className="relative h-44 sm:h-48">
//                   <img
//                     src={cafe.image}
//                     alt=""
//                     className="h-full w-full object-cover"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => toggleItem({
//                       id: cafe.id,
//                       name: cafe.name,
//                       location: cafe.location,
//                       image: cafe.image
//                     })}
//                     className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-md transition hover:bg-primary/90"
//                     aria-label={
//                       isSaved(cafe.id) ? "Remove bookmark" : "Bookmark"
//                     }
//                   >
//                     <Bookmark
//                       className={cn(
//                         "h-5 w-5",
//                         isSaved(cafe.id)
//                           ? "fill-white text-white"
//                           : "text-white",
//                       )}
//                     />
//                   </button>
//                 </div>
//                 <div className="flex items-center gap-3 p-4">
//                   <div className="min-w-0 flex-1">
//                     <h3 className="text-lg font-bold text-gray-900">
//                       {cafe.name}
//                     </h3>
//                     <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-600">
//                       <Package
//                         className="h-4 w-4 shrink-0 text-primary"
//                         strokeWidth={2}
//                       />
//                       <span>{cafe.activeOrders} orders</span>
//                     </div>
//                     <div className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-600">
//                       <MapPin
//                         className="h-4 w-4 shrink-0 text-red-500"
//                         strokeWidth={2}
//                       />
//                       <span>
//                         {cafe.location} · {cafe.distance}
//                       </span>
//                     </div>
//                   </div>
//                   <Button
//                     type="button"
//                     size="sm"
//                     onClick={() => navigate(`${ROUTES.DELIVERY.AVAILABLE.LIST}?cafe=${cafe.id}`)}
//                     className="mt-3 h-9 w-25 rounded-full bg-primary text-xs font-semibold text-white hover:bg-primary/90"
//                   >
//                     View orders
//                   </Button>
//                 </div>
//               </article>
//             ))}
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }



import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES, buildRoute } from "@/routes/routePaths";
import {
  User,
  MapPin,
  Bookmark,
  Search,
  SlidersHorizontal,
  LogOut,
  Package,
  ChevronDown,
  Clock3,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner"; // NEW: For error feedback

import { cn } from "@/lib/utils";
import { useDeliveryDashboardStore } from "@/store/deliveryDashboardStore";
import { useAuthStore } from "@/store/auth/authStore";

// Assuming you have an orderStore to fetch the full lists
import { useOrderStore } from "@/store/orders/orderStore"; 

function firstName(fullName: string) {
  return fullName.split(/\s+/)[0] ?? fullName;
}

function firstInitial(fullName: string) {
  return (fullName.trim()[0] ?? "U").toUpperCase();
}

export default function DeliveryDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  // Zustand Store
  const {
    delivererProfile,
    restaurants,
    dashboardOrders,
    isLoading,
    fetchDashboardData,
    toggleActiveStatus,
    toggleBookmark,
  } = useDeliveryDashboardStore();

  const { orders, activeOrders, fetchAvailableOrders, fetchActiveOrders } =
    useOrderStore();

  // Local UI-only states
  const [locationValue, setLocationValue] = useState("all");
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    fetchAvailableOrders();
    fetchActiveOrders();
  }, [fetchAvailableOrders, fetchActiveOrders]);

  const handleToggleActive = async () => {
    try {
      await toggleActiveStatus((path) => navigate(path));
      if (!delivererProfile?.isAvailable) {
        toast.success("You are now Online!", { description: "Waiting for orders..." });
      } else {
        toast.info("You are now Offline.");
      }
    } catch (error: any) {
      toast.error("Status Update Failed", { 
        description: error.response?.data?.message || "Please check your payout account settings." 
      });
    }
  };

  if (isLoading && restaurants.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 px-4 pb-3 pt-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-32" />
            </div>
            <Skeleton className="h-11 w-11 shrink-0 rounded-full bg-gray-200 dark:bg-gray-800" />
          </div>
          <Skeleton className="mt-4 h-12 w-full rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="mt-4 flex gap-2">
            <Skeleton className="h-10 w-16 rounded-xl bg-gray-200 dark:bg-gray-800" />
            <Skeleton className="h-10 flex-1 rounded-xl bg-gray-200 dark:bg-gray-800" />
            <Skeleton className="h-10 w-28 rounded-full bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
        <div className="flex-1 space-y-4 px-4 py-4">
          <Skeleton className="h-5 w-40" />
          <div className="flex gap-3">
            <Skeleton className="h-44 w-40 shrink-0 rounded-2xl" />
            <Skeleton className="h-44 w-40 shrink-0 rounded-2xl" />
          </div>
          <Skeleton className="h-5 w-64" />
          <Skeleton className="h-56 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  const name = user?.fullName ?? "Deliverer";
  // CRITICAL FIX: Align with strict backend schema 'isAvailable' instead of 'isOnline'
  const online = delivererProfile?.isAvailable ?? false;
  const normalizedQuery = searchQuery.trim().toLowerCase();
  
  const locationOptions = [
    "all",
    ...new Set(
      restaurants.map((restaurant) => {
        const [area] = restaurant.location.split(",");
        return area.trim();
      }),
    ),
  ];

  const filteredDashboardOrders = dashboardOrders.filter((order) => {
    if (!normalizedQuery) return true;
    return order.shortId.toLowerCase().includes(normalizedQuery);
  });

  const filteredRestaurants = (
    locationValue === "all"
      ? restaurants
      : restaurants.filter((restaurant) =>
          restaurant.location
            .toLowerCase()
            .includes(locationValue.toLowerCase()),
        )
  ).filter((restaurant) => {
    if (!normalizedQuery) return true;
    return (
      restaurant.name.toLowerCase().includes(normalizedQuery) ||
      restaurant.location.toLowerCase().includes(normalizedQuery) ||
      restaurant.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
    );
  });

  return (
    <>
      <header className="sticky top-0 z-20 bg-white dark:bg-gray-950 px-4 pb-3 pt-4 shadow-[0_1px_0_rgba(0,0,0,0.06)] dark:border-b dark:border-gray-800">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-3xl font-medium text-[#F26A1C]">Welcome Back,</p>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-[1.75rem]">
              {firstName(name)}
            </h1>
          </div>
          <div className="relative shrink-0">
            {showProfileMenu && (
              <div
                className="fixed inset-0 z-[90]"
                onClick={() => setShowProfileMenu(false)}
              />
            )}
            <button
              type="button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="relative z-[101] flex h-11 w-11 items-center justify-center rounded-full bg-[#F26A1C] text-lg font-semibold text-white shadow-sm transition hover:bg-[#F26A1C]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26A1C] focus-visible:ring-offset-2"
              aria-label="Account menu"
            >
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt=""
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                firstInitial(name)
              )}
            </button>
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 py-2 shadow-lg z-[100] animate-in fade-in zoom-in-95 duration-200">
                <div className="border-b border-gray-100 dark:border-gray-800 px-4 py-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{name}</p>
                  <p className="text-xs text-gray-500">
                    {user?.email ?? user?.astuEmail ?? ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.DELIVERY.PROFILE)}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <User size={16} /> View Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigate(ROUTES.DELIVERY.EARNINGS.SUMMARY);
                    setShowProfileMenu(false);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <Wallet size={16} className="text-[#F26A1C]" /> My Earnings
                </button>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="relative mt-4">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
            aria-hidden
          />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="h-12 rounded-full border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 pl-12 pr-12 text-base shadow-none dark:text-white"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-gray-500 hover:bg-gray-100"
            aria-label="Filters"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 flex w-full flex-wrap items-center gap-2 sm:flex-nowrap">
          <Button
            type="button"
            onClick={() => {
              setLocationValue("all");
              setSearchQuery("");
            }}
            className="h-10 shrink-0 rounded-xl bg-[#F26A1C] px-5 font-bold text-white shadow-md hover:bg-[#F26A1C]/90 focus:ring-2 focus:ring-[#F26A1C] focus:ring-offset-1 transition-all active:scale-95"
          >
            ALL
          </Button>
          <div className="relative">
            {isLocationOpen && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsLocationOpen(false)}
              />
            )}

            <button
              onClick={() => setIsLocationOpen(!isLocationOpen)}
              className="relative z-50 flex h-10 w-[130px] items-center justify-between rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300 shadow-sm transition-all hover:border-[#F26A1C]/50 hover:text-[#F26A1C] focus-visible:ring-1 focus-visible:ring-[#F26A1C]"
            >
              <span className="truncate">
                {locationValue === "all" ? "All Locations" : locationValue}
              </span>
              <ChevronDown
                className="size-4 shrink-0 text-[#F26A1C] transition-transform"
                style={{
                  transform: isLocationOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>

            {isLocationOpen && (
              <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-[140px] rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl animate-in fade-in zoom-in-95 duration-150">
                <div className="flex flex-col p-1.5">
                  {locationOptions.map((loc) => {
                    const val = loc === "all" ? "all" : loc;
                    const isSelected = locationValue === val;
                    return (
                      <button
                        key={loc}
                        onClick={() => {
                          setLocationValue(val);
                          setIsLocationOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          isSelected
                            ? "bg-orange-50 dark:bg-orange-950/20 text-[#F26A1C]"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white",
                        )}
                      >
                        {loc === "all" ? "All Locations" : loc}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={online}
            aria-label={online ? "Online" : "Offline"}
            onClick={handleToggleActive}
            className={cn(
              "ml-auto flex shrink-0 items-center gap-1.5 rounded-full border-2 py-1 pl-2.5 pr-1 shadow-sm transition-colors duration-200",
              online
                ? "border-[#F26A1C] bg-white dark:bg-gray-900"
                : "border-gray-300 dark:border-gray-700 bg-gray-200 dark:bg-gray-800",
            )}
          >
            <span
              className={cn(
                "text-xs font-semibold transition-colors duration-200",
                online ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400",
              )}
            >
              {online ? "Online" : "Offline"}
            </span>
            <span
              className={cn(
                "relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200",
                online ? "bg-[#F26A1C]" : "bg-gray-400",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-4 w-4 rounded-full shadow-sm transition-all duration-200",
                  online
                    ? "right-0.5 bg-white"
                    : "left-0.5 bg-gray-100 ring-1 ring-gray-400/50",
                )}
              />
            </span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-32 pt-5">
        <section className="mb-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => navigate(ROUTES.DELIVERY.AVAILABLE.LIST)}
            className="rounded-[24px] bg-white dark:bg-gray-900 p-4 text-left shadow-[0_6px_24px_rgba(0,0,0,0.05)]"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Available Orders
            </p>
            <p className="mt-2 text-2xl font-black text-gray-900 dark:text-white">
              {orders?.length}
            </p>
            <p className="mt-1 text-sm text-[#F26A1C]">Open delivery queue</p>
          </button>
          <button
            type="button"
            onClick={() => navigate(ROUTES.DELIVERY.ACTIVE.LIST)}
            className="rounded-[24px] bg-white dark:bg-gray-900 p-4 text-left shadow-[0_6px_24px_rgba(0,0,0,0.05)]"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Active Deliveries
            </p>
            <p className="mt-2 text-2xl font-black text-gray-900 dark:text-white">
              {activeOrders.length}
            </p>
            <p className="mt-1 text-sm text-[#F26A1C]">Track current trips</p>
          </button>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Cheap Orders
            </h2>
            <button
              type="button"
              onClick={() => navigate(ROUTES.DELIVERY.AVAILABLE.LIST)}
              className="text-xs font-bold uppercase tracking-wide text-[#F26A1C]"
            >
              See all
            </button>
          </div>
          <div className="-mx-1 flex gap-3 overflow-x-auto pb-2 pt-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filteredDashboardOrders.length === 0 ? (
              <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-orange-200 dark:border-orange-900/30 bg-orange-50/50 dark:bg-orange-900/10 py-8 text-center">
                <Package size={32} className="mb-2 text-orange-300" />
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No available orders right now.</p>
              </div>
            ) : (
              filteredDashboardOrders.map((order) => (
                <article
                  key={order.id}
                  className="relative flex min-w-[158px] max-w-[158px] shrink-0 flex-col items-center overflow-visible rounded-2xl bg-white dark:bg-gray-900 px-3 pb-3 pt-2 shadow-[0_4px_20px_rgba(0,0,0,0.08)] ring-1 ring-gray-100 dark:ring-gray-800"
                >
                  <span
                    className="absolute right-3 top-3 z-[1] h-2 w-2 rounded-sm bg-[#F26A1C]"
                    aria-hidden
                  />
                  <div className="z-[1] -mt-10 mb-1 flex justify-center">
                    <div className="h-[5rem] w-[5rem] shrink-0 overflow-hidden rounded-full border-[3px] border-white bg-gray-50 shadow-md ring-1 ring-black/5">
                      <img
                        src={order.firstItemImageUrl ?? "https://images.unsplash.com/photo-1544025162-831e5088eb7e?w=200&auto=format&fit=crop"}
                        alt=""
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                  </div>
                  <p className="mt-1 text-center text-sm font-semibold text-gray-900 dark:text-white">
                    #{order.shortId}
                  </p>
                  <div className="mt-1 flex items-center justify-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                    <Package className="h-3.5 w-3.5 text-[#F26A1C]" strokeWidth={2} />
                    <span>{order.itemCount} items</span>
                  </div>
                  <p className="mt-1 text-center text-sm font-bold text-gray-900 dark:text-white">
                    {Number(order.totalAmount).toFixed(0)} ETB
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() =>
                      navigate(
                        buildRoute(ROUTES.DELIVERY.AVAILABLE.DETAILS, {
                          orderId: order.id,
                        }),
                      )
                    }
                    className="mt-3 h-9 w-full rounded-full bg-[#F26A1C] text-xs font-semibold text-white hover:bg-[#F26A1C]/90 shadow-md transition-all active:scale-95"
                  >
                    View Detail
                  </Button>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Restaurants With available Orders
            </h2>
            <button
              type="button"
              onClick={() => navigate(ROUTES.DELIVERY.HISTORY.LIST)}
              className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-[#F26A1C]"
            >
              <Clock3 size={14} />
              History
            </button>
          </div>
          <div className="space-y-5">
            {filteredRestaurants.map((restaurant) => (
              <article
                key={restaurant.id}
                className="overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-[0_4px_24px_rgba(0,0,0,0.08)] ring-1 ring-gray-100 dark:ring-gray-800"
              >
                <div className="relative h-44 sm:h-48">
                  <img
                    src={restaurant.imageUrl ?? "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500"}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => toggleBookmark(restaurant.id)}
                    className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#F26A1C] text-white shadow-md transition hover:bg-[#F26A1C]/90"
                    aria-label={restaurant.isBookmarked ? "Remove bookmark" : "Bookmark"}
                  >
                    <Bookmark
                      className={cn(
                        "h-5 w-5",
                        restaurant.isBookmarked ? "fill-white text-white" : "text-white",
                      )}
                    />
                  </button>
                </div>
                <div className="flex items-center gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{restaurant.name}</h3>
                    <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                      <Package className="h-4 w-4 shrink-0 text-[#F26A1C]" strokeWidth={2} />
                      <span>{restaurant.activeOrders} orders</span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4 shrink-0 text-red-500" strokeWidth={2} />
                      <span>{restaurant.location}</span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() =>
                      // Optional: Update this route to accept a query param if your available list supports filtering
                      navigate(`${ROUTES.DELIVERY.AVAILABLE.LIST}?cafe=${restaurant.id}`)
                    }
                    className="mt-3 h-9 w-24 rounded-full bg-[#F26A1C] text-xs font-semibold text-white hover:bg-[#F26A1C]/90"
                  >
                    View orders
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}