import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Clock,
  Phone,
  Store,
  Bike,
  CreditCard,
  ChevronLeft,
  Star,
  AlertCircle,
  CheckCircle,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Types for Order Details
interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  specialInstructions?: string;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  address: string;
  landmark?: string;
}

interface Cafe {
  id: string;
  name: string;
  image: string;
  phone: string;
  address: string;
  rating: number;
}

interface OrderDetails {
  id: string;
  orderNumber: string;
  cafe: Cafe;
  customer: Customer;
  items: OrderItem[];
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "picked_up"
    | "delivered"
    | "cancelled";
  paymentMethod: "cash" | "card" | "telegram_stars";
  paymentStatus: "pending" | "paid" | "failed";
  createdAt: string;
  estimatedDeliveryTime?: string;
  distance: string;
  deliveryFee: number;
  subtotal: number;
  totalAmount: number;
  priority: boolean;
  specialInstructions?: string;
}

export default function AvailableDeliveryDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);

  // Mock data fetch - replace with actual API call
  useEffect(() => {
    const fetchOrderDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock order details
        const mockOrder = generateMockOrderDetails(orderId || "ord-123");
        setOrder(mockOrder);
      } catch (err) {
        setError("Failed to load order details. Please try again.");
        console.error("Error fetching order:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleAcceptOrder = async () => {
    setIsAccepting(true);
    try {
      // API call to accept order
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Order accepted:", orderId);
      // Navigate to active delivery or show success message
      navigate("/delivery/active");
    } catch (error) {
      console.error("Error accepting order:", error);
    } finally {
      setIsAccepting(false);
    }
  };

  const getStatusColor = (status: OrderDetails["status"]) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      confirmed: "bg-blue-100 text-blue-800 border-blue-200",
      preparing: "bg-purple-100 text-purple-800 border-purple-200",
      ready: "bg-green-100 text-green-800 border-green-200",
      picked_up: "bg-indigo-100 text-indigo-800 border-indigo-200",
      delivered: "bg-gray-100 text-gray-800 border-gray-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const formatCurrency = (amount: number) => {
    return `ETB ${amount.toLocaleString()}`;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        {/* Back Button Skeleton */}
        <div className="px-4 py-3 border-b border-gray-100">
          <Skeleton className="h-6 w-24" />
        </div>

        {/* Image Skeleton */}
        <Skeleton className="w-full h-64" />

        {/* Content Skeleton */}
        <div className="px-4 py-4 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="bg-red-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-4">{error || "Order not found"}</p>
          <Button
            onClick={() => navigate(-1)}
            className="bg-primary hover:bg-primary/90"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const mainItem = order.items[0];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with Back Button */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft size={20} />
            <span className="text-sm font-medium">Back</span>
          </button>
          <Badge className={getStatusColor(order.status)}>
            {order.status.replace("_", " ").toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Scrollable Content - Fixed height to accommodate button */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Food Image - 30% of viewport height */}
        <div className="relative w-full h-[30vh] bg-gray-100">
          <img
            src={mainItem.image}
            alt={mainItem.name}
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay for better text visibility */}
          <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />

          {/* Order Number Badge */}
          <div className="absolute top-4 right-4">
            <Badge className="bg-white/90 text-gray-900 border-0 px-3 py-1.5">
              #{order.orderNumber}
            </Badge>
          </div>

          {/* Priority Badge */}
          {order.priority && (
            <div className="absolute top-4 left-4">
              <Badge className="bg-orange-500 text-white border-0 px-3 py-1.5 flex items-center gap-1">
                <Star size={14} className="fill-white" />
                Priority
              </Badge>
            </div>
          )}
        </div>

        {/* Content Container */}
        <div className="px-4 py-4 space-y-4">
          {/* Food Name and Basic Info */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {mainItem.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant="outline"
                className="bg-primary/5 text-primary border-primary/20"
              >
                {order.cafe.name}
              </Badge>
              <span className="text-sm text-gray-500">•</span>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Clock size={14} className="text-primary" />
                {formatTime(order.createdAt)}
              </div>
            </div>
          </div>

          {/* Cafe Info Card */}
          <Card className="p-3 bg-gray-50/50 border-gray-100">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                <AvatarImage src={order.cafe.image} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {order.cafe.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Store size={14} className="text-primary" />
                  <span className="font-medium text-gray-900">
                    {order.cafe.name}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <MapPin size={12} className="text-primary" />
                  {order.cafe.address}
                </p>
              </div>
              <Button variant="ghost" size="sm" className="text-primary">
                Call
                <Phone size={14} className="ml-1" />
              </Button>
            </div>
          </Card>

          {/* Price Breakdown */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Price Details</h3>

            {/* Item Price */}
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Item price</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(mainItem.price)}
              </span>
            </div>
            <Separator className="bg-primary/10" />

            {/* Quantity */}
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Quantity</span>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-primary/5 text-primary border-primary/20"
                >
                  {mainItem.quantity} {mainItem.quantity > 1 ? "items" : "item"}
                </Badge>
              </div>
            </div>
            <Separator className="bg-primary/10" />

            {/* Delivery Fee (per order) */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Bike size={14} className="text-primary" />
                <span className="text-gray-600">Delivery fee</span>
              </div>
              <span className="font-medium text-gray-900">
                {formatCurrency(order.deliveryFee)}
              </span>
            </div>
            <Separator className="bg-primary/10" />

            {/* Total Delivery Fee (if multiple items) */}
            {order.items.length > 1 && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total delivery fee</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(order.deliveryFee * order.items.length)}
                  </span>
                </div>
                <Separator className="bg-primary/10" />
              </>
            )}

            {/* Total Order Price */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-base font-semibold text-gray-900">
                Total order
              </span>
              <span className="text-lg font-bold text-primary">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Delivery Details</h3>

            <Card className="p-3 bg-gray-50/50 border-gray-100">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={order.customer.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {order.customer.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {order.customer.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                    <Phone size={10} className="text-primary" />
                    {order.customer.phone}
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="text-primary">
                  Call
                </Button>
              </div>
            </Card>

            {/* Location */}
            <div className="flex items-start gap-2">
              <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-900">
                  {order.customer.address}
                </p>
                {order.customer.landmark && (
                  <p className="text-xs text-gray-500 mt-1">
                    📍 {order.customer.landmark}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Bike size={10} className="text-primary" />
                  {order.distance} away
                </p>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
            <div className="flex items-center gap-2">
              <CreditCard size={18} className="text-primary" />
              <span className="text-sm text-gray-700">Payment method</span>
            </div>
            <Badge className="bg-white text-gray-700 border-gray-200">
              {order.paymentMethod === "cash"
                ? "💵 Cash"
                : order.paymentMethod === "card"
                  ? "💳 Card"
                  : "⭐ Telegram Stars"}
            </Badge>
          </div>

          {/* Special Instructions */}
          {order.specialInstructions && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Special instructions</p>
              <p className="text-sm text-gray-700">
                {order.specialInstructions}
              </p>
            </div>
          )}

          {/* Other Items (if more than one) */}
          {order.items.length > 1 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">
                Other items in order
              </h3>
              {order.items.slice(1).map((item) => (
                <Card key={item.id} className="p-2 border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-primary">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
        <div className="max-w-md mx-auto">
          <Button
            onClick={handleAcceptOrder}
            disabled={isAccepting || order.status !== "pending"}
            className="w-full h-14 bg-primary hover:bg-primary/90 text-white text-base font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAccepting ? (
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Accepting Order...
              </div>
            ) : order.status !== "pending" ? (
              <div className="flex items-center gap-2">
                <CheckCircle size={20} />
                Order Already {order.status}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Package size={20} />
                Accept Order
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Helper function to generate mock order details
function generateMockOrderDetails(orderId: string): OrderDetails {
  const foodImages = [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500",
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500",
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500",
  ];

  const cafeImages = [
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=100",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100",
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=100",
  ];

  const foodNames = [
    "Grilled Chicken Burger",
    "Margherita Pizza",
    "Creamy Pasta Alfredo",
    "Caesar Salad",
    "Beef Steak",
    "Vegetable Curry",
    "Chicken Shawarma",
    "Fish & Chips",
  ];

  const customerNames = [
    "Abebe Kebede",
    "Sara Hailu",
    "Meron Tadesse",
    "Dawit Alemu",
    "Betelhem Girma",
  ];

  const addresses = [
    "Bole Atlas, 4th floor, Apartment 402",
    "CMC Road, near Piassa, Building B",
    "Ayat Heights, around the roundabout",
    "Kazanchis, around Friendship Hotel",
    "Gerji, behind Sheger Mall",
  ];

  const landmarks = [
    "Next to Atlas Hotel",
    "Above Dashen Bank",
    "Near the mosque",
    "Opposite Friendship Park",
    "Behind the mall",
  ];

  const mainItemIndex = Math.floor(Math.random() * foodNames.length);
  const itemCount = Math.floor(Math.random() * 3) + 1;

  const items: OrderItem[] = [];
  for (let i = 0; i < itemCount; i++) {
    items.push({
      id: `item-${i}`,
      name: foodNames[(mainItemIndex + i) % foodNames.length],
      quantity: Math.floor(Math.random() * 3) + 1,
      price: Math.floor(Math.random() * 200) + 100,
      image: foodImages[i % foodImages.length],
      specialInstructions:
        i === 0 && Math.random() > 0.5 ? "No onions, extra spicy" : undefined,
    });
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const deliveryFee = Math.floor(Math.random() * 50) + 30;
  const totalAmount = subtotal + deliveryFee * items.length;

  const statuses: OrderDetails["status"][] = [
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "picked_up",
  ];
  const paymentMethods: OrderDetails["paymentMethod"][] = [
    "cash",
    "card",
    "telegram_stars",
  ];

  return {
    id: orderId,
    orderNumber: `ORD-${Math.floor(Math.random() * 10000)}`,
    cafe: {
      id: "cafe-1",
      name: ["Kaldi's Coffee", "Yod Abyssinia", "Tomoca Coffee"][
        Math.floor(Math.random() * 3)
      ],
      image: cafeImages[Math.floor(Math.random() * cafeImages.length)],
      phone: "+251-911-123-456",
      address: "Bole Atlas, Addis Ababa",
      rating: 4.5 + Math.random() * 0.5,
    },
    customer: {
      id: "cust-1",
      name: customerNames[Math.floor(Math.random() * customerNames.length)],
      phone: "+251-912-987-654",
      address: addresses[Math.floor(Math.random() * addresses.length)],
      landmark: landmarks[Math.floor(Math.random() * landmarks.length)],
    },
    items,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    paymentMethod:
      paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
    paymentStatus: "paid",
    createdAt: new Date().toISOString(),
    estimatedDeliveryTime: "30-40 min",
    distance: `${(Math.random() * 3 + 1).toFixed(1)} km`,
    deliveryFee,
    subtotal,
    totalAmount,
    priority: Math.random() > 0.7,
    specialInstructions:
      Math.random() > 0.7
        ? "Please knock twice, doorbell is broken"
        : undefined,
  };
}
