import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Clock, ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { useOrderDetailsStore } from "@/store/orderDetailsStore";
import { formatCurrency } from "@/lib/utils"; // or inline

export default function AvailableDeliveryDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const {
    order,
    isLoading,
    fetchOrderDetails,
    acceptOrder,
    declineOrder,
    isAccepting,
  } = useOrderDetailsStore();

  useEffect(() => {
    if (orderId) fetchOrderDetails(orderId);
  }, [orderId, fetchOrderDetails]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="px-4 py-4">
          <Skeleton className="h-8 w-40" />
        </div>
        <div className="px-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-3xl" />
          ))}
          <Skeleton className="h-40 w-full rounded-3xl mt-8" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Order not found</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-gray-700"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-2xl">👋</span>
          <h1 className="text-2xl font-semibold tracking-tight">
            Order #{order.orderNumber}
          </h1>
        </div>
        <div className="w-8" /> {/* spacer for balance */}
      </div>

      {/* ITEMS LIST */}
      <div className="flex-1 px-4 py-6 space-y-4 overflow-y-auto">
        {order.items.map((item) => (
          <Card
            key={item.id}
            className="overflow-hidden border border-gray-100 shadow-sm rounded-3xl"
          >
            <CardContent className="p-0 flex">
              {/* Food Image */}
              <div className="w-24 h-24 flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Item Details */}
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPin size={14} className="text-[#F26A1C]" />
                    {order.customer.address.split(",")[0]} • Dorm{" "}
                    {
                      order.customer.address.split(" ")[
                        order.customer.address.split(" ").length - 1
                      ]
                    }
                  </p>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-gray-500">
                    Qty: {item.quantity}
                  </span>
                  <span className="font-bold text-[#F26A1C] text-2xl">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* SUMMARY BOX */}
      <div className="px-4 pb-6">
        <Card className="border border-[#F26A1C]/20 bg-white rounded-3xl overflow-hidden">
          <CardContent className="p-5 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sub Total</span>
              <span className="font-semibold">
                {formatCurrency(order.subtotal)}
              </span>
            </div>
            <Separator className="bg-gray-100" />
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="font-semibold">
                {formatCurrency(order.deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery Distance</span>
              <span className="font-semibold">{order.distance}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Time To Deliver</span>
              <span className="font-semibold">
                {order.estimatedDeliveryTime}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ACTION BUTTONS */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <div className="max-w-md mx-auto flex gap-3">
          <Button
            variant="outline"
            onClick={declineOrder}
            className="flex-1 h-14 text-base font-semibold border-gray-300 rounded-2xl"
            disabled={isAccepting}
          >
            Decline
          </Button>

          <Button
            onClick={acceptOrder}
            disabled={isAccepting || order.status !== "pending"}
            className="flex-1 h-14 text-base font-semibold bg-[#F26A1C] hover:bg-[#F26A1C]/90 rounded-2xl text-white"
          >
            {isAccepting ? "Accepting..." : "Accept"}
          </Button>
        </div>
      </div>
    </div>
  );
}
