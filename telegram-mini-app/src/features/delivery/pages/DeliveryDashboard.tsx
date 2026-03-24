import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Bell, ChevronRight, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

import { useDeliveryDashboardStore } from "@/store/deliveryDashboardStore";
import BottomNav from "@/components/common/BottomNav1";

export default function DeliveryDashboard() {
  const navigate = useNavigate();

  const {
    deliveryPerson,
    restaurantsWithOrders,
    isLoading,
    isOnline,
    fetchDashboardData,
    toggleAvailability,
  } = useDeliveryDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleViewOrders = (cafeId: string) => {
    navigate(`/delivery/available?cafe=${cafeId}`);
  };

  // Loading skeleton – matches design layout
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-7 w-52" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          <Skeleton className="h-11 w-full rounded-2xl" />
        </div>
        <div className="px-4 py-3">
          <Skeleton className="h-9 w-40 mb-4" />
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-3xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Welcome back,
            </h1>
            <p className="text-2xl font-medium text-gray-800">
              {deliveryPerson?.name || "Nati"}
            </p>
          </div>

          {/* Notification Avatar */}
          <div className="relative">
            <Avatar
              className="h-11 w-11 ring-2 ring-offset-2 ring-[#F26A1C] cursor-pointer"
              onClick={() => navigate("/delivery/notifications")}
            >
              <AvatarImage src={deliveryPerson?.avatar} />
              <AvatarFallback className="bg-[#F26A1C] text-white font-semibold">
                {deliveryPerson?.name?.slice(0, 1) || "N"}
              </AvatarFallback>
            </Avatar>
            <Badge className="absolute -top-1 -right-1 bg-white text-[#F26A1C] text-[10px] font-bold px-1.5 py-0.5 shadow-sm">
              3
            </Badge>
          </div>
        </div>

        {/* Search Bar – exact match */}
        <div className="mt-4 relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <Input
            placeholder="Search Orders..."
            className="pl-11 h-12 bg-white border-gray-200 rounded-2xl text-base placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="px-4 py-3 flex items-center gap-2 border-b border-gray-100">
        <Button className="bg-[#F26A1C] hover:bg-[#F26A1C]/90 text-white font-medium px-6 rounded-2xl h-10">
          ALL
        </Button>
        <Button
          variant="outline"
          className="border-gray-200 hover:border-gray-300 font-medium px-5 rounded-2xl h-10 flex items-center gap-1"
        >
          Location
          <ChevronRight size={16} className="rotate-90" />
        </Button>

        {/* Online Toggle */}
        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Online</span>
          <Switch
            checked={isOnline}
            onCheckedChange={toggleAvailability}
            className="data-[state=checked]:bg-[#F26A1C]"
          />
        </div>
      </div>

      {/* SECTION TITLE */}
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-xl font-semibold text-gray-900">
          Restaurants With Orders
        </h2>
      </div>

      {/* RESTAURANTS LIST */}
      <ScrollArea className="h-[calc(100vh-260px)] px-4">
        <div className="space-y-4 pb-8">
          {restaurantsWithOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">
                No restaurants with active orders right now
              </p>
            </div>
          ) : (
            restaurantsWithOrders.map((restaurant) => (
              <Card
                key={restaurant.id}
                className="overflow-hidden border border-gray-100 shadow-sm rounded-3xl hover:shadow-md transition-shadow"
              >
                <div className="relative">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover"
                  />

                  {/* Order count badge – exact match to design */}
                  <div className="absolute top-4 right-4 bg-[#F26A1C] text-white text-xs font-semibold px-3 py-1 rounded-2xl flex items-center gap-1 shadow-md">
                    <span>{restaurant.orderCount}</span>
                    <span className="text-[10px]">Orders</span>
                  </div>

                  {/* Bookmark icon (optional, matches previous design) */}
                  <button className="absolute top-4 left-4 h-8 w-8 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-sm">
                    <Bell size={18} className="text-gray-700" />
                  </button>
                </div>

                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {restaurant.name}
                      </h3>
                      <p className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                        <MapPin size={15} className="text-[#F26A1C]" />
                        {restaurant.location} • {restaurant.distance}
                      </p>
                    </div>

                    <Button
                      onClick={() => handleViewOrders(restaurant.id)}
                      className="bg-[#F26A1C] hover:bg-[#F26A1C]/90 text-white font-medium px-7 rounded-2xl h-10"
                    >
                      View Orders
                      <ChevronRight size={18} className="ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
