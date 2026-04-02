import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  MapPin,
  Clock,
  Phone,
  User,
  Store,
  Bike,
  Navigation,
  MessageCircle,
  Star,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useActiveDeliveriesStore } from "@/store/activeDeliveriesStore";
import { formatCurrency } from "@/lib/utils";
import BottomNav from "@/components/common/BottomNav";

export default function ActiveDeliveriesPage() {
  const navigate = useNavigate();

  const {
    activeDeliveries,
    stats,
    isLoading,
    refreshing,
    fetchActiveDeliveries,
    updateDeliveryStatus,
  } = useActiveDeliveriesStore();

  useEffect(() => {
    fetchActiveDeliveries();
  }, [fetchActiveDeliveries]);

  const handleCallCustomer = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleMessageCustomer = (customerId: string) => {
    navigate(`/chat/${customerId}`);
  };

  const handleNavigate = (address: string) => {
    window.open(`https://maps.google.com/?q=${encodeURIComponent(address)}`);
  };

  const handleAction = (deliveryId: string, action: string) => {
    if (action === "details") {
      navigate(`/delivery/active/${deliveryId}`);
    } else {
      // Example: Mark as picked up, start delivery, complete, etc.
      updateDeliveryStatus(deliveryId, action);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="px-4 py-4">
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="px-4 space-y-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-72 w-full rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/delivery/dashboard")}
            className="h-10 w-10"
          >
            <ChevronLeft size={24} />
          </Button>

          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Active Deliveries
            </h1>
            <p className="text-xs text-gray-500">
              {refreshing ? "Updating..." : `${activeDeliveries.length} active`}
            </p>
          </div>

          <Badge className="bg-[#F26A1C]/10 text-[#F26A1C] border-0">
            {formatCurrency(stats.earningsToday)} today
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 py-4 grid grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-3 text-center shadow-sm">
          <p className="text-xs text-gray-500">Active</p>
          <p className="text-2xl font-bold text-[#F26A1C]">
            {stats.activeDeliveries}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-3 text-center shadow-sm">
          <p className="text-xs text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-green-600">
            {stats.completedToday}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-3 text-center shadow-sm">
          <p className="text-xs text-gray-500">Avg Time</p>
          <p className="text-2xl font-bold text-blue-600">
            {stats.averageTime}m
          </p>
        </div>
        <div className="bg-white rounded-2xl p-3 text-center shadow-sm">
          <p className="text-xs text-gray-500">Rating</p>
          <div className="flex items-center justify-center gap-1">
            <Star size={16} className="text-yellow-500 fill-yellow-500" />
            <span className="text-2xl font-bold text-yellow-600">
              {stats.rating}
            </span>
          </div>
        </div>
      </div>

      {/* Deliveries List */}
      <ScrollArea className="h-[calc(100vh-220px)] px-4">
        <div className="space-y-4 pb-8">
          {activeDeliveries.length === 0 ? (
            <div className="text-center py-16">
              <Bike size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="font-semibold text-gray-900">
                No Active Deliveries
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Browse available orders to get started
              </p>
              <Button
                onClick={() => navigate("/delivery/available")}
                className="mt-6 bg-[#F26A1C] hover:bg-[#F26A1C]/90"
              >
                Browse Orders
              </Button>
            </div>
          ) : (
            activeDeliveries.map((delivery) => (
              <Card
                key={delivery.id}
                className="overflow-hidden rounded-3xl border border-gray-100 shadow-sm"
              >
                <CardContent className="p-0">
                  {/* Status Header */}
                  <div className="flex items-center justify-between px-4 pt-4 pb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#F26A1C]/10 rounded-2xl">
                        <Bike size={20} className="text-[#F26A1C]" />
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          #{delivery.orderNumber}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {delivery.distance} • {delivery.timeRemaining} min
                        </p>
                      </div>
                    </div>
                    {delivery.priority && (
                      <Badge className="bg-orange-100 text-orange-700">
                        Priority
                      </Badge>
                    )}
                  </div>

                  {/* Restaurant & Customer */}
                  <div className="px-4 py-3 bg-gray-50 space-y-4">
                    {/* Restaurant */}
                    <div className="flex gap-3">
                      <Avatar className="h-11 w-11">
                        <AvatarImage src={delivery.restaurant.image} />
                        <AvatarFallback>
                          {delivery.restaurant.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {delivery.restaurant.name}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {delivery.restaurant.address}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleNavigate(delivery.restaurant.address)
                        }
                      >
                        <Navigation size={18} />
                      </Button>
                    </div>

                    {/* Customer */}
                    <div className="flex gap-3">
                      <Avatar className="h-11 w-11">
                        <AvatarImage src={delivery.customer.avatar} />
                        <AvatarFallback>
                          {delivery.customer.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {delivery.customer.name}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {delivery.customer.address}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleCallCustomer(delivery.customer.phone)
                          }
                        >
                          <Phone size={18} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleMessageCustomer(delivery.customer.id)
                          }
                        >
                          <MessageCircle size={18} />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Total & Payment */}
                  <div className="px-4 py-4 flex items-center justify-between border-t">
                    <div>
                      <p className="text-xs text-gray-500">Total</p>
                      <p className="font-bold text-xl text-[#F26A1C]">
                        {formatCurrency(delivery.totalAmount)}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {delivery.paymentMethod === "cash"
                        ? "💵 Cash"
                        : delivery.paymentMethod === "card"
                          ? "💳 Card"
                          : "⭐ Stars"}
                    </Badge>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-4 flex gap-3 border-t">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleAction(delivery.id, "details")}
                    >
                      View Details
                    </Button>

                    {delivery.status === "assigned" && (
                      <Button
                        className="flex-1 bg-[#F26A1C] hover:bg-[#F26A1C]/90"
                        onClick={() => handleAction(delivery.id, "picked_up")}
                      >
                        Mark Picked Up
                      </Button>
                    )}

                    {delivery.status === "picked_up" && (
                      <Button
                        className="flex-1 bg-[#F26A1C] hover:bg-[#F26A1C]/90"
                        onClick={() => handleAction(delivery.id, "in_transit")}
                      >
                        Start Delivery
                      </Button>
                    )}

                    {delivery.status === "in_transit" && (
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleAction(delivery.id, "delivered")}
                      >
                        Complete Delivery
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      <BottomNav activeTab="home" />
    </div>
  );
}
