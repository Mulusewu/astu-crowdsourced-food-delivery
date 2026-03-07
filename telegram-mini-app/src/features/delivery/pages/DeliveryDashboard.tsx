import { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Bookmark,
  Bell,
  ChevronRight,
  LogOut,
  Settings,
  Star,
  Clock,
  Bike,
  Coffee,
  MoreVertical,
  SwitchCamera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import BottomNav from "@/components/common/BottomNav1";
import OrdersPage from "./Orders";

// Types for the delivery person and cafes
interface DeliveryPerson {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isActive: boolean;
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  stats: {
    deliveriesToday: number;
    earningsToday: number;
    rating: number;
  };
}

interface Cafe {
  id: string;
  name: string;
  description: string;
  image: string;
  location: string;
  distance: string;
  estimatedTime: number; // in minutes
  rating: number;
  isBookmarked: boolean;
  acceptsCash: boolean;
  acceptsCard: boolean;
  minimumOrder: number;
  cuisine: string[];
}

export default function DeliveryDashboard() {
  const [deliveryPerson, setDeliveryPerson] = useState<DeliveryPerson | null>(
    null,
  );
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterValue, setFilterValue] = useState("nearby");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Mock data fetch - replace with actual API call
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Mock delivery person data
        setDeliveryPerson({
          id: "1",
          name: "Abebe Kebede",
          email: "abebe.k@example.com",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abebe",
          isActive: true,
          currentLocation: {
            lat: 9.0222,
            lng: 38.7468,
            address: "Bole, Addis Ababa",
          },
          stats: {
            deliveriesToday: 8,
            earningsToday: 1200,
            rating: 4.8,
          },
        });

        // Mock cafes data
        setCafes([
          {
            id: "1",
            name: "Kaldi's Coffee",
            description: "ቡና ቤት | Coffee Shop • Traditional coffee • Pastries",
            image:
              "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500",
            location: "Bole Atlas",
            distance: "0.8 km",
            estimatedTime: 15,
            rating: 4.5,
            isBookmarked: true,
            acceptsCash: true,
            acceptsCard: true,
            minimumOrder: 50,
            cuisine: ["Coffee", "Pastries", "Traditional"],
          },
          {
            id: "2",
            name: "Yod Abyssinia",
            description:
              "ባህላዊ ምግብ | Traditional Ethiopian • Live music • Cultural food",
            image:
              "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500",
            location: "Bole Medhanialem",
            distance: "1.2 km",
            estimatedTime: 20,
            rating: 4.7,
            isBookmarked: false,
            acceptsCash: true,
            acceptsCard: false,
            minimumOrder: 100,
            cuisine: ["Ethiopian", "Traditional", "Vegetarian"],
          },
          {
            id: "3",
            name: "Tomoca Coffee",
            description: "ቡና ቤት | Iconic Coffee • Italian style • Roastery",
            image:
              "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500",
            location: "Wavel Street",
            distance: "1.5 km",
            estimatedTime: 12,
            rating: 4.9,
            isBookmarked: true,
            acceptsCash: true,
            acceptsCard: true,
            minimumOrder: 30,
            cuisine: ["Coffee", "Italian", "Pastries"],
          },
          {
            id: "4",
            name: "Mama's Kitchen",
            description:
              "ፍስፍስ | Family Recipe • Home delivery • Local favorites",
            image:
              "https://images.unsplash.com/photo-1552566624-52f8b3b8b9b9?w=500",
            location: "CMC Road",
            distance: "2.1 km",
            estimatedTime: 25,
            rating: 4.6,
            isBookmarked: false,
            acceptsCash: true,
            acceptsCard: false,
            minimumOrder: 80,
            cuisine: ["Ethiopian", "Family Style", "Fast Food"],
          },
          {
            id: "5",
            name: "The Lemon Tree",
            description:
              "አለም አቀፍ | International • Healthy options • Fresh juices",
            image:
              "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500",
            location: "Bole Rwanda",
            distance: "1.8 km",
            estimatedTime: 18,
            rating: 4.4,
            isBookmarked: true,
            acceptsCash: true,
            acceptsCard: true,
            minimumOrder: 60,
            cuisine: ["International", "Healthy", "Salads"],
          },
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleActiveStatus = () => {
    if (deliveryPerson) {
      setDeliveryPerson({
        ...deliveryPerson,
        isActive: !deliveryPerson.isActive,
      });
      // Here you would also call API to update status
    }
  };

  const toggleBookmark = (cafeId: string) => {
    setCafes((prevCafes) =>
      prevCafes.map((cafe) =>
        cafe.id === cafeId
          ? { ...cafe, isBookmarked: !cafe.isBookmarked }
          : cafe,
      ),
    );
    // Here you would also call API to update bookmark
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pb-20">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        </div>

        <div className="px-4 py-4 space-y-4">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Header with Profile */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Welcome Text */}
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Welcome back, 👋
            </h1>
            <p className="text-lg font-medium text-gray-700">
              {deliveryPerson?.name}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              📍 {deliveryPerson?.currentLocation?.address}
            </p>
          </div>

          {/* Profile Image with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="focus:outline-none"
            >
              <Avatar className="h-12 w-12 ring-2 ring-offset-2 ring-primary cursor-pointer">
                <AvatarImage src={deliveryPerson?.avatar} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {deliveryPerson?.name
                    ? getInitials(deliveryPerson.name)
                    : "DK"}
                </AvatarFallback>
              </Avatar>
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {deliveryPerson?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {deliveryPerson?.email}
                  </p>
                </div>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                  <User size={16} /> View Profile
                </button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                  <Settings size={16} /> Settings
                </button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600">
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="bg-primary/5 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-600">Today</p>
            <p className="text-lg font-bold text-primary">
              {deliveryPerson?.stats.deliveriesToday}
            </p>
          </div>
          <div className="bg-primary/5 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-600">Earnings</p>
            <p className="text-lg font-bold text-primary">
              ETB {deliveryPerson?.stats.earningsToday}
            </p>
          </div>
          <div className="bg-primary/5 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-600">Rating</p>
            <div className="flex items-center justify-center gap-1">
              <Star size={14} className="text-yellow-500 fill-yellow-500" />
              <span className="text-lg font-bold text-primary">
                {deliveryPerson?.stats.rating}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <ScrollArea className="h-[calc(100vh-220px)]">
        <div className="px-4 py-4 space-y-4 pb-24">
          {/* Filter Section */}
          <div className="flex items-center gap-3">
            <Select value={filterValue} onValueChange={setFilterValue}>
              <SelectTrigger className="flex-1 bg-white border-gray-200 h-12">
                <SelectValue placeholder="Filter cafes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nearby">Nearest first</SelectItem>
                <SelectItem value="rating">Highest rated</SelectItem>
                <SelectItem value="bookmarked">Bookmarked</SelectItem>
                <SelectItem value="available">Available now</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 border-gray-200"
              onClick={() => {
                /* Handle notifications */
              }}
            >
              <Bell size={20} className="text-gray-600" />
            </Button>
          </div>

          {/* Active Status Toggle */}
          <div className="flex items-center justify-between bg-primary/5 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div
                className={`h-3 w-3 rounded-full ${deliveryPerson?.isActive ? "bg-green-500" : "bg-gray-300"}`}
              />
              <span className="font-medium text-gray-700">
                {deliveryPerson?.isActive
                  ? "Active & Accepting Orders"
                  : "Offline"}
              </span>
            </div>
            <Switch
              checked={deliveryPerson?.isActive}
              onCheckedChange={toggleActiveStatus}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          {/* Cafes Grid */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 px-1">
              Nearby Restaurants
            </h2>

            {cafes.map((cafe) => (
              <Card
                key={cafe.id}
                className="overflow-hidden border border-gray-100 shadow-sm"
              >
                {/* Cafe Image with Bookmark */}
                <div className="relative h-48">
                  <img
                    src={cafe.image}
                    alt={cafe.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => toggleBookmark(cafe.id)}
                    className="absolute top-3 right-3 h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-md"
                  >
                    <Bookmark
                      size={20}
                      className={
                        cafe.isBookmarked
                          ? "fill-primary text-primary"
                          : "text-gray-400"
                      }
                    />
                  </button>
                  <Badge className="absolute top-3 left-3 bg-white/90 text-gray-900 border-0">
                    {cafe.distance}
                  </Badge>
                </div>

                {/* Cafe Details */}
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {cafe.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {cafe.description}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-white h-8 px-3"
                    >
                      View
                      <ChevronRight size={16} className="ml-1" />
                    </Button>
                  </div>

                  {/* Location and Time */}
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} className="text-primary" />
                      <span>{cafe.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} className="text-primary" />
                      <span>{cafe.estimatedTime} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star
                        size={14}
                        className="text-yellow-500 fill-yellow-500"
                      />
                      <span>{cafe.rating}</span>
                    </div>
                  </div>

                  {/* Cuisine Tags */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {cafe.cuisine.slice(0, 3).map((item, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-gray-50 text-gray-600 border-0"
                      >
                        {item}
                      </Badge>
                    ))}
                  </div>

                  {/* Separator */}
                  <Separator className="my-3 bg-primary/20" />

                  {/* Payment Methods */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {cafe.acceptsCash && (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-0"
                        >
                          Cash
                        </Badge>
                      )}
                      {cafe.acceptsCard && (
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-0"
                        >
                          Card
                        </Badge>
                      )}
                    </div>
                    <span className="text-gray-500">
                      Min. {cafe.minimumOrder} ETB
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More Indicator */}
          <div className="text-center py-4">
            <p className="text-sm text-gray-400">
              Pull to load more restaurants
            </p>
          </div>
        </div>
      </ScrollArea>
      <OrdersPage />
      <BottomNav />
    </div>
  );
}
