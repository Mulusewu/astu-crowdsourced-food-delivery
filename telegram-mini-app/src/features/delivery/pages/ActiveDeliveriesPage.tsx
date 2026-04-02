import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  MapPin,
  Clock,
  Phone,
  User,
  Store,
  Bike,
  Package,
  CheckCircle,
  AlertCircle,
  Navigation,
  MessageCircle,
  Star,
  DollarSign,
  TrendingUp,
  MoreVertical,
  Info,
  Coffee,
  Utensils,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import BottomNav from "@/components/common/BottomNav";

// Types for Active Delivery
interface ActiveDelivery {
  id: string;
  orderNumber: string;
  status:
    | "assigned"
    | "picked_up"
    | "in_transit"
    | "delivered"
    | "cancelled"
    | "failed";
  priority: boolean;
  createdAt: string;
  estimatedDeliveryTime: string;
  timeRemaining: number; // in minutes
  distance: string;

  // Restaurant Info
  restaurant: {
    id: string;
    name: string;
    phone: string;
    address: string;
    landmark?: string;
    image: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };

  // Customer Info
  customer: {
    id: string;
    name: string;
    phone: string;
    address: string;
    landmark?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    avatar?: string;
  };

  // Order Details
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    image?: string;
    specialInstructions?: string;
  }>;

  // Financials
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: "cash" | "card" | "telegram_stars";
  paymentStatus: "pending" | "paid" | "failed";

  // Delivery Progress
  progress: {
    acceptedAt?: string;
    pickedUpAt?: string;
    startedAt?: string;
    estimatedArrival?: string;
    actualArrival?: string;
  };

  // Actions Timeline
  timeline: Array<{
    status: string;
    timestamp: string;
    location?: string;
  }>;
}

interface DeliveryStats {
  activeDeliveries: number;
  completedToday: number;
  earningsToday: number;
  averageTime: number;
  rating: number;
}

// Action States
type ActionState = {
  type: "pickup" | "start" | "complete" | "cancel" | "report" | null;
  deliveryId: string | null;
  loading: boolean;
};

export default function ActiveDeliveriesPage() {
  const navigate = useNavigate();
  const [activeDeliveries, setActiveDeliveries] = useState<ActiveDelivery[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DeliveryStats>({
    activeDeliveries: 0,
    completedToday: 0,
    earningsToday: 0,
    averageTime: 0,
    rating: 4.8,
  });
  const [actionState, setActionState] = useState<ActionState>({
    type: null,
    deliveryId: null,
    loading: false,
  });
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState("");

  // Mock data fetch - replace with actual API call
  useEffect(() => {
    const fetchActiveDeliveries = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Mock active deliveries data
        const mockDeliveries = generateMockActiveDeliveries();
        setActiveDeliveries(mockDeliveries);

        // Calculate stats
        setStats({
          activeDeliveries: mockDeliveries.length,
          completedToday: 8,
          earningsToday: 850,
          averageTime: 24,
          rating: 4.8,
        });
      } catch (error) {
        console.error("Error fetching active deliveries:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveDeliveries();

    // Simulate real-time updates
    const interval = setInterval(() => {
      setRefreshing(true);
      // In production, fetch updated data here
      setTimeout(() => setRefreshing(false), 1000);
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Action Handlers (States instead of routes)
  const handlePickup = async (deliveryId: string) => {
    setActionState({ type: "pickup", deliveryId, loading: true });

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update local state
      setActiveDeliveries((prev) =>
        prev.map((d) =>
          d.id === deliveryId ? { ...d, status: "picked_up" as const } : d,
        ),
      );

      // Show success message (you can add a toast here)
      console.log("Order picked up successfully");
    } catch (error) {
      console.error("Failed to pickup order:", error);
    } finally {
      setActionState({ type: null, deliveryId: null, loading: false });
    }
  };

  const handleStartDelivery = async (deliveryId: string) => {
    setActionState({ type: "start", deliveryId, loading: true });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setActiveDeliveries((prev) =>
        prev.map((d) =>
          d.id === deliveryId ? { ...d, status: "in_transit" as const } : d,
        ),
      );

      console.log("Delivery started successfully");
    } catch (error) {
      console.error("Failed to start delivery:", error);
    } finally {
      setActionState({ type: null, deliveryId: null, loading: false });
    }
  };

  const handleCompleteDelivery = async (deliveryId: string) => {
    setActionState({ type: "complete", deliveryId, loading: true });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Remove from active deliveries and add to completed
      setActiveDeliveries((prev) => prev.filter((d) => d.id !== deliveryId));

      // Update stats
      setStats((prev) => ({
        ...prev,
        completedToday: prev.completedToday + 1,
        earningsToday: prev.earningsToday + 120, // Mock earnings
        activeDeliveries: prev.activeDeliveries - 1,
      }));

      console.log("Delivery completed successfully");
    } catch (error) {
      console.error("Failed to complete delivery:", error);
    } finally {
      setActionState({ type: null, deliveryId: null, loading: false });
    }
  };

  const handleCancelDelivery = async () => {
    if (!actionState.deliveryId || !cancelReason) return;

    setActionState((prev) => ({ ...prev, loading: true }));

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setActiveDeliveries((prev) =>
        prev.filter((d) => d.id !== actionState.deliveryId),
      );
      setStats((prev) => ({
        ...prev,
        activeDeliveries: prev.activeDeliveries - 1,
      }));

      setShowCancelDialog(false);
      setCancelReason("");
      console.log("Delivery cancelled");
    } catch (error) {
      console.error("Failed to cancel delivery:", error);
    } finally {
      setActionState({ type: null, deliveryId: null, loading: false });
    }
  };

  const handleReportIssue = async () => {
    if (!actionState.deliveryId || !reportReason) return;

    setActionState((prev) => ({ ...prev, loading: true }));

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Handle report submission
      console.log("Issue reported:", reportReason);
      setShowReportDialog(false);
      setReportReason("");

      // You might want to show a success message
    } catch (error) {
      console.error("Failed to report issue:", error);
    } finally {
      setActionState({ type: null, deliveryId: null, loading: false });
    }
  };

  const isActionLoading = (
    deliveryId: string,
    actionType: ActionState["type"],
  ) => {
    return (
      actionState.loading &&
      actionState.deliveryId === deliveryId &&
      actionState.type === actionType
    );
  };

  const getStatusColor = (status: ActiveDelivery["status"]) => {
    const colors = {
      assigned: "bg-blue-100 text-blue-800 border-blue-200",
      picked_up: "bg-purple-100 text-purple-800 border-purple-200",
      in_transit: "bg-indigo-100 text-indigo-800 border-indigo-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
      failed: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusIcon = (status: ActiveDelivery["status"]) => {
    switch (status) {
      case "assigned":
        return <Package size={16} className="text-blue-600" />;
      case "picked_up":
        return <ShoppingBag size={16} className="text-purple-600" />;
      case "in_transit":
        return <Bike size={16} className="text-indigo-600" />;
      case "delivered":
        return <CheckCircle size={16} className="text-green-600" />;
      default:
        return <Info size={16} className="text-gray-600" />;
    }
  };

  const getProgressPercentage = (delivery: ActiveDelivery) => {
    switch (delivery.status) {
      case "assigned":
        return 25;
      case "picked_up":
        return 50;
      case "in_transit":
        return 75;
      case "delivered":
        return 100;
      default:
        return 0;
    }
  };

  const formatCurrency = (amount: number) => {
    return `ETB ${amount.toLocaleString()}`;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const handleCallCustomer = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleMessageCustomer = (customerId: string) => {
    navigate(`/chat/${customerId}`);
  };

  const handleNavigate = (
    coordinates?: { lat: number; lng: number },
    address?: string,
  ) => {
    if (coordinates) {
      window.open(
        `https://maps.google.com/?q=${coordinates.lat},${coordinates.lng}`,
      );
    } else if (address) {
      window.open(`https://maps.google.com/?q=${encodeURIComponent(address)}`);
    }
  };

  const handleViewDetails = (deliveryId: string) => {
    navigate(`/delivery/active/${deliveryId}`);
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header Skeleton */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-6 w-40" />
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="px-4 py-4">
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Deliveries Skeleton */}
        <div className="px-4 space-y-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/delivery/dashboard")}
              className="h-10 w-10 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft size={20} />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Active Deliveries
              </h1>
              <p className="text-xs text-gray-500">
                {refreshing
                  ? "Updating..."
                  : `${activeDeliveries.length} active`}
              </p>
            </div>
          </div>

          {/* Earnings Badge - Clean and non-intrusive */}
          <Badge
            variant="outline"
            className="border-green-200 bg-green-50 text-green-700 px-3 py-1.5"
          >
            <DollarSign size={14} className="mr-1 text-green-600" />
            {formatCurrency(stats.earningsToday)}
          </Badge>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          <div className="bg-primary/5 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-500">Active</p>
            <p className="text-lg font-bold text-primary">
              {stats.activeDeliveries}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-500">Completed</p>
            <p className="text-lg font-bold text-green-600">
              {stats.completedToday}
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-500">Avg Time</p>
            <p className="text-lg font-bold text-blue-600">
              {stats.averageTime}m
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-500">Rating</p>
            <div className="flex items-center justify-center gap-0.5">
              <Star size={12} className="text-yellow-500 fill-yellow-500" />
              <span className="text-lg font-bold text-yellow-600">
                {stats.rating}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Deliveries List */}
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="px-4 py-4 space-y-4 pb-24">
          {activeDeliveries.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Bike size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Active Deliveries
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                You don't have any active deliveries at the moment
              </p>
              <Button
                onClick={() => navigate("/delivery/available")}
                className="bg-primary hover:bg-primary/90"
              >
                Browse Available Orders
              </Button>
            </div>
          ) : (
            activeDeliveries.map((delivery) => (
              <Card
                key={delivery.id}
                className={`overflow-hidden border-l-4 transition-all ${
                  delivery.priority ? "border-l-orange-500" : "border-l-primary"
                }`}
              >
                <CardContent className="p-0">
                  {/* Header with Status */}
                  <div className="flex items-center justify-between p-4 bg-white">
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-2 rounded-full ${getStatusColor(delivery.status)}`}
                      >
                        {getStatusIcon(delivery.status)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">
                            #{delivery.orderNumber}
                          </h3>
                          {delivery.priority && (
                            <Badge className="bg-orange-100 text-orange-700 border-0 text-[10px]">
                              ⭐ Priority
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {formatTime(delivery.createdAt)} • {delivery.distance}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(delivery.id)}
                      className="text-primary"
                    >
                      Details
                    </Button>
                  </div>

                  {/* Progress Bar */}
                  <div className="px-4 pb-2">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Accepted</span>
                      <span>Picked Up</span>
                      <span>In Transit</span>
                      <span>Delivered</span>
                    </div>
                    <Progress
                      value={getProgressPercentage(delivery)}
                      className="h-1.5 bg-gray-100"
                    />
                  </div>

                  {/* Restaurant & Customer Section */}
                  <div className="px-4 py-3 bg-gray-50/80">
                    {/* Restaurant */}
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                        <AvatarImage src={delivery.restaurant.image} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {delivery.restaurant.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-1">
                          <Store size={12} className="text-primary" />
                          <span className="text-sm font-medium text-gray-900">
                            {delivery.restaurant.name}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 flex items-start gap-1">
                          <MapPin
                            size={10}
                            className="text-primary flex-shrink-0 mt-0.5"
                          />
                          <span className="line-clamp-1">
                            {delivery.restaurant.address}
                          </span>
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleNavigate(
                            delivery.restaurant.coordinates,
                            delivery.restaurant.address,
                          )
                        }
                        className="h-8 px-2 text-primary"
                      >
                        <Navigation size={14} />
                      </Button>
                    </div>

                    {/* Customer */}
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                        <AvatarImage src={delivery.customer.avatar} />
                        <AvatarFallback className="bg-green-500/10 text-green-600">
                          {delivery.customer.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-1">
                          <User size={12} className="text-green-600" />
                          <span className="text-sm font-medium text-gray-900">
                            {delivery.customer.name}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 flex items-start gap-1">
                          <MapPin
                            size={10}
                            className="text-green-600 flex-shrink-0 mt-0.5"
                          />
                          <span className="line-clamp-1">
                            {delivery.customer.address}
                          </span>
                        </p>
                        {delivery.customer.landmark && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            📍 {delivery.customer.landmark}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleCallCustomer(delivery.customer.phone)
                          }
                          className="h-8 w-8 p-0 text-green-600"
                        >
                          <Phone size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleMessageCustomer(delivery.customer.id)
                          }
                          className="h-8 w-8 p-0 text-blue-600"
                        >
                          <MessageCircle size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="px-4 py-3">
                    <div className="flex items-start gap-3">
                      {delivery.items.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="relative">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Utensils size={16} className="text-gray-400" />
                              </div>
                            )}
                          </div>
                          <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-primary text-white text-[10px]">
                            {item.quantity}
                          </Badge>
                        </div>
                      ))}
                      {delivery.items.length > 2 && (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            +{delivery.items.length - 2}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 text-right">
                        <p className="text-sm font-bold text-primary">
                          {formatCurrency(delivery.totalAmount)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {delivery.paymentMethod === "cash"
                            ? "💵 Cash"
                            : delivery.paymentMethod === "card"
                              ? "💳 Card"
                              : "⭐ Stars"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline & ETA */}
                  <div className="px-4 py-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-gray-400" />
                        <span className="text-xs text-gray-600">
                          ETA: {formatDuration(delivery.timeRemaining)}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Est. {formatTime(delivery.estimatedDeliveryTime)}
                      </Badge>
                    </div>
                  </div>

                  {/* Action Buttons - States instead of routes */}
                  <div className="p-4 pt-0 flex gap-2">
                    {delivery.status === "assigned" && (
                      <Button
                        onClick={() => handlePickup(delivery.id)}
                        disabled={actionState.loading}
                        className="flex-1 bg-primary hover:bg-primary/90"
                      >
                        {isActionLoading(delivery.id, "pickup") ? (
                          <>
                            <Loader2 size={14} className="mr-2 animate-spin" />
                            Picking Up...
                          </>
                        ) : (
                          "Mark as Picked Up"
                        )}
                      </Button>
                    )}
                    {delivery.status === "picked_up" && (
                      <Button
                        onClick={() => handleStartDelivery(delivery.id)}
                        disabled={actionState.loading}
                        className="flex-1 bg-primary hover:bg-primary/90"
                      >
                        {isActionLoading(delivery.id, "start") ? (
                          <>
                            <Loader2 size={14} className="mr-2 animate-spin" />
                            Starting...
                          </>
                        ) : (
                          "Start Delivery"
                        )}
                      </Button>
                    )}
                    {delivery.status === "in_transit" && (
                      <Button
                        onClick={() => handleCompleteDelivery(delivery.id)}
                        disabled={actionState.loading}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        {isActionLoading(delivery.id, "complete") ? (
                          <>
                            <Loader2 size={14} className="mr-2 animate-spin" />
                            Completing...
                          </>
                        ) : (
                          "Complete Delivery"
                        )}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => handleViewDetails(delivery.id)}
                      className="flex-1 border-gray-200"
                    >
                      View Details
                    </Button>
                  </div>

                  {/* Issues Button */}
                  {(delivery.status === "assigned" ||
                    delivery.status === "picked_up") && (
                    <div className="px-4 pb-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setActionState({
                            type: "cancel",
                            deliveryId: delivery.id,
                            loading: false,
                          });
                          setShowCancelDialog(true);
                        }}
                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 text-xs"
                      >
                        <AlertCircle size={14} className="mr-1" />
                        Cancel Delivery
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Cancel Delivery Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Delivery</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this delivery? Please provide a
              reason.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select a reason</option>
              <option value="customer_unavailable">Customer unavailable</option>
              <option value="restaurant_issue">Restaurant issue</option>
              <option value="vehicle_problem">Vehicle problem</option>
              <option value="emergency">Emergency</option>
              <option value="other">Other</option>
            </select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowCancelDialog(false)}>
              Back
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelDelivery}
              disabled={!cancelReason || actionState.loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {actionState.loading ? (
                <>
                  <Loader2 size={14} className="mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Confirm Cancellation"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BottomNav />
    </div>
  );
}

// Helper function to generate mock active deliveries
function generateMockActiveDeliveries(): ActiveDelivery[] {
  const now = new Date();

  return [
    {
      id: "del-001",
      orderNumber: "ORD-2024001",
      status: "in_transit",
      priority: true,
      createdAt: new Date(now.getTime() - 45 * 60000).toISOString(),
      estimatedDeliveryTime: new Date(now.getTime() + 15 * 60000).toISOString(),
      timeRemaining: 15,
      distance: "2.3 km",

      restaurant: {
        id: "rest-1",
        name: "Kaldi's Coffee",
        phone: "+251-911-123-456",
        address: "Bole Atlas, near Dembel",
        landmark: "Opposite to Getu Commercial",
        image:
          "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=100",
        coordinates: { lat: 9.0222, lng: 38.7468 },
      },

      customer: {
        id: "cust-1",
        name: "Abebe Kebede",
        phone: "+251-912-987-654",
        address: "CMC Road, Ayat Heights",
        landmark: "Building B, 4th floor",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abebe",
        coordinates: { lat: 9.0186, lng: 38.7845 },
      },

      items: [
        {
          id: "item-1",
          name: "Special Burger with Fries",
          quantity: 2,
          price: 450,
          image:
            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100",
          specialInstructions: "Extra spicy, no onions",
        },
        {
          id: "item-2",
          name: "Chicken Shawarma",
          quantity: 1,
          price: 280,
          image:
            "https://images.unsplash.com/photo-1561651823-34f113022962?w=100",
        },
      ],

      subtotal: 730,
      deliveryFee: 50,
      totalAmount: 780,
      paymentMethod: "cash",
      paymentStatus: "pending",

      progress: {
        acceptedAt: new Date(now.getTime() - 45 * 60000).toISOString(),
        pickedUpAt: new Date(now.getTime() - 30 * 60000).toISOString(),
        startedAt: new Date(now.getTime() - 25 * 60000).toISOString(),
        estimatedArrival: new Date(now.getTime() + 15 * 60000).toISOString(),
      },

      timeline: [
        {
          status: "assigned",
          timestamp: new Date(now.getTime() - 45 * 60000).toISOString(),
        },
        {
          status: "picked_up",
          timestamp: new Date(now.getTime() - 30 * 60000).toISOString(),
        },
        {
          status: "in_transit",
          timestamp: new Date(now.getTime() - 25 * 60000).toISOString(),
        },
      ],
    },
    {
      id: "del-002",
      orderNumber: "ORD-2024002",
      status: "picked_up",
      priority: false,
      createdAt: new Date(now.getTime() - 20 * 60000).toISOString(),
      estimatedDeliveryTime: new Date(now.getTime() + 25 * 60000).toISOString(),
      timeRemaining: 25,
      distance: "1.8 km",

      restaurant: {
        id: "rest-2",
        name: "Yod Abyssinia",
        phone: "+251-911-789-012",
        address: "Bole Medhanialem",
        landmark: "Near the roundabout",
        image:
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100",
        coordinates: { lat: 9.0147, lng: 38.7543 },
      },

      customer: {
        id: "cust-2",
        name: "Sara Hailu",
        phone: "+251-913-456-789",
        address: "Bole Rwanda, Edna Mall",
        landmark: "Behind the mall",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara",
        coordinates: { lat: 9.0082, lng: 38.7615 },
      },

      items: [
        {
          id: "item-3",
          name: "Mixed Grill Platter",
          quantity: 1,
          price: 650,
          image:
            "https://images.unsplash.com/photo-1544025162-d76694265947?w=100",
        },
        {
          id: "item-4",
          name: "Traditional Coffee",
          quantity: 3,
          price: 180,
          image:
            "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=100",
        },
      ],

      subtotal: 830,
      deliveryFee: 60,
      totalAmount: 890,
      paymentMethod: "card",
      paymentStatus: "paid",

      progress: {
        acceptedAt: new Date(now.getTime() - 20 * 60000).toISOString(),
        pickedUpAt: new Date(now.getTime() - 5 * 60000).toISOString(),
        estimatedArrival: new Date(now.getTime() + 25 * 60000).toISOString(),
      },

      timeline: [
        {
          status: "assigned",
          timestamp: new Date(now.getTime() - 20 * 60000).toISOString(),
        },
        {
          status: "picked_up",
          timestamp: new Date(now.getTime() - 5 * 60000).toISOString(),
        },
      ],
    },
  ];
}
