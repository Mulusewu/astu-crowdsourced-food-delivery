import { useState, useEffect, useRef, useCallback } from "react";
import {
  Coffee,
  MapPin,
  Bookmark,
  Clock,
  DollarSign,
  User,
  ChevronRight,
  Filter,
  X,
  Star,
  Bike,
  Home,
  TrendingUp,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";

// Types for Order
interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Customer {
  id: string;
  name: string;
  avatar?: string;
  phone?: string;
  address: string;
}

interface Order {
  id: string;
  orderNumber: string;
  cafeId: string;
  cafeName: string;
  cafeImage: string;
  customer: Customer;
  items: OrderItem[];
  totalAmount: number;
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
  isBookmarked: boolean;
  priority: boolean;
  specialInstructions?: string;
}

// Filter options type
type FilterType =
  | "all"
  | "nearby"
  | "price_asc"
  | "price_desc"
  | "cafe"
  | "priority";

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [selectedCafe, setSelectedCafe] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [cafes, setCafes] = useState<{ id: string; name: string }[]>([]);

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  // Mock data fetch - initial load
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Mock cafes for filter
        setCafes([
          { id: "1", name: "Kaldi's Coffee" },
          { id: "2", name: "Yod Abyssinia" },
          { id: "3", name: "Tomoca Coffee" },
          { id: "4", name: "Mama's Kitchen" },
          { id: "5", name: "The Lemon Tree" },
        ]);

        // Mock orders data
        const mockOrders = generateMockOrders(1, 10);
        setOrders(mockOrders);
        setFilteredOrders(mockOrders);
        setTotalCount(25); // Mock total count
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Filter orders when filter changes
  useEffect(() => {
    if (orders.length === 0) return;

    let filtered = [...orders];

    switch (activeFilter) {
      case "nearby":
        filtered.sort(
          (a, b) => parseFloat(a.distance) - parseFloat(b.distance),
        );
        break;
      case "price_asc":
        filtered.sort((a, b) => a.totalAmount - b.totalAmount);
        break;
      case "price_desc":
        filtered.sort((a, b) => b.totalAmount - a.totalAmount);
        break;
      case "cafe":
        if (selectedCafe !== "all") {
          filtered = filtered.filter((order) => order.cafeId === selectedCafe);
        }
        break;
      case "priority":
        filtered = filtered.filter((order) => order.priority);
        break;
      default:
        // 'all' - no filtering
        break;
    }

    setFilteredOrders(filtered);
  }, [activeFilter, selectedCafe, orders]);

  // Load more orders when scrolling
  const loadMoreOrders = useCallback(async () => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      // Simulate API call for next page
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const nextPage = page + 1;
      const newOrders = generateMockOrders(nextPage, 5);

      setOrders((prev) => [...prev, ...newOrders]);
      setPage(nextPage);
      setHasMore(nextPage < 5); // Assume 5 pages total
    } catch (error) {
      console.error("Error loading more orders:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [page, hasMore, isLoadingMore]);

  // Trigger load more when scroll target is in view
  useEffect(() => {
    if (inView && hasMore && !isLoading && !isLoadingMore) {
      loadMoreOrders();
    }
  }, [inView, hasMore, isLoading, isLoadingMore, loadMoreOrders]);

  const toggleBookmark = (orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? { ...order, isBookmarked: !order.isBookmarked }
          : order,
      ),
    );
  };

  const getStatusColor = (status: Order["status"]) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      preparing: "bg-purple-100 text-purple-800",
      ready: "bg-green-100 text-green-800",
      picked_up: "bg-indigo-100 text-indigo-800",
      delivered: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPaymentIcon = (method: Order["paymentMethod"]) => {
    switch (method) {
      case "cash":
        return "💵";
      case "card":
        return "💳";
      case "telegram_stars":
        return "⭐";
      default:
        return "💰";
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

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-4">
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <div className="px-4 py-4 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
        <h1 className="text-xl font-semibold text-gray-900 mb-3">Orders</h1>

        {/* Filter Row */}
        <div className="flex items-center gap-2">
          {/* All Orders Button */}
          <Button
            variant={activeFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("all")}
            className={`flex-1 h-10 ${
              activeFilter === "all"
                ? "bg-primary text-white"
                : "bg-white text-gray-700 border-gray-200"
            }`}
          >
            All Orders
          </Button>

          {/* Filter Select */}
          <Select
            value={activeFilter}
            onValueChange={(value: FilterType) => setActiveFilter(value)}
          >
            <SelectTrigger className="w-[140px] h-10 border-gray-200">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nearby">📍 Nearby first</SelectItem>
              <SelectItem value="price_asc">💰 Price: Low to High</SelectItem>
              <SelectItem value="price_desc">💰 Price: High to Low</SelectItem>
              <SelectItem value="priority">⭐ Priority orders</SelectItem>
              <SelectItem value="cafe">🏪 By cafe</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Cafe Filter (shown only when 'cafe' filter is selected) */}
        {activeFilter === "cafe" && (
          <div className="mt-3">
            <Select value={selectedCafe} onValueChange={setSelectedCafe}>
              <SelectTrigger className="w-full h-10 border-gray-200">
                <SelectValue placeholder="Select cafe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All cafes</SelectItem>
                {cafes.map((cafe) => (
                  <SelectItem key={cafe.id} value={cafe.id}>
                    {cafe.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Active Filters Display */}
        {activeFilter !== "all" && (
          <div className="flex items-center gap-2 mt-3">
            <Badge className="bg-primary/10 text-primary border-0 flex items-center gap-1 px-3 py-1">
              {activeFilter === "nearby" && "📍 Nearest"}
              {activeFilter === "price_asc" && "💰 Low to High"}
              {activeFilter === "price_desc" && "💰 High to Low"}
              {activeFilter === "priority" && "⭐ Priority"}
              {activeFilter === "cafe" &&
                selectedCafe !== "all" &&
                "🏪 Specific cafe"}
              {activeFilter === "cafe" &&
                selectedCafe === "all" &&
                "🏪 All cafes"}
              <X
                size={14}
                className="ml-1 cursor-pointer"
                onClick={() => setActiveFilter("all")}
              />
            </Badge>
            <span className="text-xs text-gray-500">
              {filteredOrders.length} orders
            </span>
          </div>
        )}
      </div>

      {/* Orders List */}
      <ScrollArea className="h-[calc(100vh-140px)]">
        <div className="px-4 py-4 space-y-3 pb-24">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <AlertCircle size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-600">No orders found</p>
              <p className="text-sm text-gray-400 mt-1">
                Try changing your filters
              </p>
            </div>
          ) : (
            filteredOrders.map((order, index) => (
              <Card
                key={order.id}
                className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-0">
                  {/* Cafe Header */}
                  <div className="flex items-center justify-between p-3 bg-gray-50/50">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={order.cafeImage} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {order.cafeName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                          {order.cafeName}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin size={10} className="text-primary" />
                          {order.distance}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <button
                        onClick={() => toggleBookmark(order.id)}
                        className="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                      >
                        <Bookmark
                          size={16}
                          className={
                            order.isBookmarked
                              ? "fill-primary text-primary"
                              : "text-gray-400"
                          }
                        />
                      </button>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-3">
                    <div className="flex gap-3">
                      {/* Food Image */}
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={order.items[0]?.image}
                          alt={order.items[0]?.name}
                          className="w-full h-full object-cover"
                        />
                        {order.items.length > 1 && (
                          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-primary text-white text-xs">
                            +{order.items.length - 1}
                          </Badge>
                        )}
                      </div>

                      {/* Order Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                              {order.items[0]?.name}
                              {order.items.length > 1 &&
                                ` & ${order.items.length - 1} more`}
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                              <User size={10} className="text-primary" />
                              {order.customer.name}
                            </p>
                          </div>
                          <p className="text-sm font-bold text-primary">
                            {formatCurrency(order.totalAmount)}
                          </p>
                        </div>

                        {/* Order Meta Info */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Clock size={10} className="text-primary" />
                            {formatTime(order.createdAt)}
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <span className="text-xs">
                              {getPaymentIcon(order.paymentMethod)}
                            </span>
                            {order.paymentMethod}
                          </div>
                          {order.priority && (
                            <Badge className="bg-orange-100 text-orange-700 border-0 text-[10px] h-5">
                              ⭐ Priority
                            </Badge>
                          )}
                        </div>

                        {/* Delivery Location */}
                        <p className="text-xs text-gray-500 mt-2 flex items-start gap-1 line-clamp-1">
                          <MapPin
                            size={10}
                            className="text-primary flex-shrink-0 mt-0.5"
                          />
                          <span>{order.customer.address}</span>
                        </p>

                        {/* Special Instructions */}
                        {order.specialInstructions && (
                          <p className="text-xs text-gray-500 mt-1 italic line-clamp-1">
                            📝 {order.specialInstructions}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Separator */}
                    <Separator className="my-3 bg-primary/10" />

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      // In your Orders page, update the View Details button:
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 h-9 text-xs border-gray-200"
                        onClick={() => navigate(`/order/${order.id}`)}
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 h-9 text-xs bg-primary hover:bg-primary/90 text-white"
                      >
                        Accept Order
                        <ChevronRight size={14} className="ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}

          {/* Loading More Indicator */}
          {hasMore && (
            <div ref={ref} className="py-4">
              {isLoadingMore ? (
                <div className="space-y-3">
                  <Skeleton className="h-32 w-full rounded-xl" />
                  <Skeleton className="h-32 w-full rounded-xl" />
                  <p className="text-center text-sm text-gray-400">
                    Loading more orders...
                  </p>
                </div>
              ) : (
                <p className="text-center text-sm text-gray-400">
                  Scroll for more
                </p>
              )}
            </div>
          )}

          {!hasMore && filteredOrders.length > 0 && (
            <p className="text-center text-sm text-gray-400 py-4">
              No more orders to load
            </p>
          )}
        </div>
      </ScrollArea>

      {/* Floating Summary Stats (Optional Enhancement) */}
      <div className="fixed bottom-20 left-4 right-4">
        <Card className="bg-white/80 backdrop-blur-sm border-primary/20 shadow-lg">
          <CardContent className="p-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 rounded-full p-1">
                  <TrendingUp size={14} className="text-primary" />
                </div>
                <span className="text-gray-600">Available orders</span>
                <span className="font-bold text-primary">
                  {filteredOrders.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 rounded-full p-1">
                  <DollarSign size={14} className="text-primary" />
                </div>
                <span className="text-gray-600">Avg. value</span>
                <span className="font-bold text-primary">
                  {filteredOrders.length > 0
                    ? formatCurrency(
                        filteredOrders.reduce(
                          (acc, o) => acc + o.totalAmount,
                          0,
                        ) / filteredOrders.length,
                      )
                    : formatCurrency(0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper function to generate mock orders
function generateMockOrders(page: number, count: number): Order[] {
  const cafes = [
    {
      id: "1",
      name: "Kaldi's Coffee",
      image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=100",
    },
    {
      id: "2",
      name: "Yod Abyssinia",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100",
    },
    {
      id: "3",
      name: "Tomoca Coffee",
      image:
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=100",
    },
    {
      id: "4",
      name: "Mama's Kitchen",
      image: "https://images.unsplash.com/photo-1552566624-52f8b3b8b9b9?w=100",
    },
    {
      id: "5",
      name: "The Lemon Tree",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100",
    },
  ];

  const foodImages = [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100",
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=100",
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=100",
  ];

  const customerNames = [
    "Abebe Kebede",
    "Sara Hailu",
    "Meron Tadesse",
    "Dawit Alemu",
    "Betelhem Girma",
    "Yonas Desta",
    "Hanna Tekle",
    "Biruk Wondimu",
    "Mahlet Fikre",
    "Henok Assefa",
  ];

  const addresses = [
    "Bole Atlas, 4th floor",
    "CMC Road, near Piassa",
    "Ayat Heights, Building B",
    "Kazanchis, around Friendship",
    "Gerji, behind Sheger",
    "Megenagna, near Bisrate Gabriel",
    "Saris, around Central",
    "Gotera, near the station",
    "Jemo, 2000 villa",
    "Lebu, near the mall",
  ];

  const statuses: Order["status"][] = [
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "picked_up",
    "delivered",
  ];
  const paymentMethods: Order["paymentMethod"][] = [
    "cash",
    "card",
    "telegram_stars",
  ];

  const orders: Order[] = [];

  for (let i = 0; i < count; i++) {
    const index = (page - 1) * count + i;
    const cafe = cafes[index % cafes.length];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const paymentMethod =
      paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    const itemCount = Math.floor(Math.random() * 3) + 1;

    const items: OrderItem[] = [];
    for (let j = 0; j < itemCount; j++) {
      items.push({
        id: `item-${index}-${j}`,
        name: [
          "Espresso",
          "Cappuccino",
          "Latte",
          "Burger",
          "Pizza",
          "Pasta",
          "Salad",
        ][Math.floor(Math.random() * 7)],
        quantity: Math.floor(Math.random() * 3) + 1,
        price: Math.floor(Math.random() * 150) + 50,
        image: foodImages[j % foodImages.length],
      });
    }

    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    orders.push({
      id: `order-${index}`,
      orderNumber: `ORD-${2024}${String(index).padStart(4, "0")}`,
      cafeId: cafe.id,
      cafeName: cafe.name,
      cafeImage: cafe.image,
      customer: {
        id: `cust-${index}`,
        name: customerNames[index % customerNames.length],
        address: addresses[index % addresses.length],
      },
      items,
      totalAmount,
      status,
      paymentMethod,
      paymentStatus: paymentMethod === "cash" ? "pending" : "paid",
      createdAt: new Date(
        Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000),
      ).toISOString(),
      distance: `${(Math.random() * 3 + 0.5).toFixed(1)} km`,
      isBookmarked: Math.random() > 0.7,
      priority: Math.random() > 0.8,
      specialInstructions:
        Math.random() > 0.7 ? "No onions please, extra spicy" : undefined,
    });
  }

  return orders;
}
