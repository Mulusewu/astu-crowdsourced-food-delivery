import { useMemo, useState } from "react";
import { useNavigate, generatePath } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Bookmark,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/routes/routePaths";

const ORANGE = "#F27420";
const ORANGE_SOFT = "#FFF0E6";

export type GridOrder = {
  id: string;
  orderNo: string;
  items: number;
  priceEtb: number;
  image: string;
};

const MOCK_ORDERS: GridOrder[] = [
  {
    id: "1",
    orderNo: "123",
    items: 3,
    priceEtb: 310,
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=400&fit=crop",
  },
  {
    id: "2",
    orderNo: "234",
    items: 1,
    priceEtb: 110,
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop",
  },
  {
    id: "3",
    orderNo: "345",
    items: 2,
    priceEtb: 210,
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=400&fit=crop",
  },
  {
    id: "4",
    orderNo: "456",
    items: 1,
    priceEtb: 120,
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop",
  },
  {
    id: "5",
    orderNo: "345",
    items: 2,
    priceEtb: 210,
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=400&fit=crop",
  },
  {
    id: "6",
    orderNo: "567",
    items: 1,
    priceEtb: 100,
    image:
      "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=400&fit=crop",
  },
];

function OrderGridCard({
  order,
  bookmarked,
  onToggleBookmark,
  onViewDetail,
}: {
  order: GridOrder;
  bookmarked: boolean;
  onToggleBookmark: () => void;
  onViewDetail: () => void;
}) {
  return (
    <article className="relative flex flex-col items-center overflow-visible rounded-[1.25rem] bg-white px-3 pb-4 pt-2 shadow-[0_8px_30px_rgba(0,0,0,0.08)] ring-1 ring-gray-100">
      <button
        type="button"
        onClick={onToggleBookmark}
        className="absolute right-2 top-2 z-[2] rounded-md p-0.5 text-[#F27420] transition hover:opacity-80"
        aria-label={bookmarked ? "Remove bookmark" : "Bookmark order"}
      >
        <Bookmark
          className={cn("h-5 w-5", bookmarked && "fill-[#F27420] text-[#F27420]")}
          strokeWidth={2}
        />
      </button>

      <div className="z-[1] -mt-10 mb-1 flex justify-center">
        <div className="h-[4.75rem] w-[4.75rem] shrink-0 overflow-hidden rounded-full border-[3px] border-white bg-gray-50 shadow-md ring-1 ring-black/5 sm:h-20 sm:w-20">
          <img
            src={order.image}
            alt=""
            className="h-full w-full object-cover object-center"
          />
        </div>
      </div>

      <h3 className="mt-1 text-center text-sm font-bold text-gray-900 sm:text-base">
        Order #{order.orderNo}
      </h3>
      <div className="mt-1 flex items-center justify-center gap-1 text-xs text-gray-600 sm:text-sm">
        <Package className="h-3.5 w-3.5 text-[#F27420]" strokeWidth={2} />
        <span>
          {order.items} Item{order.items !== 1 ? "s" : ""}
        </span>
      </div>
      <p
        className="mt-1.5 text-center text-base font-bold sm:text-lg"
        style={{ color: ORANGE }}
      >
        {order.priceEtb} ETB
      </p>
      <Button
        type="button"
        onClick={onViewDetail}
        className="mt-3 h-9 w-full rounded-xl border-0 font-semibold text-white shadow-sm hover:opacity-95 sm:h-10"
        style={{ backgroundColor: ORANGE }}
      >
        View Detail
      </Button>
    </article>
  );
}

export default function DeliveryOrdersPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [priceSort, setPriceSort] = useState<string>("all");
  const [bookmarked, setBookmarked] = useState<Set<string>>(() => new Set());

  const filtered = useMemo(() => {
    let list = [...MOCK_ORDERS];
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (o) =>
          o.orderNo.includes(q) ||
          `${o.priceEtb}`.includes(q) ||
          `${o.items}`.includes(q),
      );
    }
    if (priceSort === "low") {
      list.sort((a, b) => a.priceEtb - b.priceEtb);
    } else if (priceSort === "high") {
      list.sort((a, b) => b.priceEtb - a.priceEtb);
    }
    return list;
  }, [search, priceSort]);

  const toggleBookmark = (id: string) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <header className="sticky top-0 z-20 bg-white px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] shadow-[0_1px_0_rgba(0,0,0,0.06)]">
        <div className="relative flex h-12 items-center justify-center sm:h-14">
          <button
            type="button"
            onClick={() => navigate(ROUTES.DELIVERY.DASHBOARD)}
            className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-xl border border-[#F27420]/40 transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F27420]/40"
            style={{ backgroundColor: ORANGE_SOFT }}
            aria-label="Go back"
          >
            <ArrowLeft
              className="h-5 w-5"
              style={{ color: ORANGE }}
              strokeWidth={2.5}
            />
          </button>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Orders</h1>
        </div>

        <div className="relative mt-4">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
            aria-hidden
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Orders.."
            className="h-12 rounded-full border-gray-200 bg-white pl-12 pr-12 text-base placeholder:text-gray-400 shadow-none"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-gray-500 hover:bg-gray-100"
            aria-label="Filter orders"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button
            type="button"
            className="h-10 shrink-0 rounded-[10px] border-0 px-5 font-bold text-white shadow-sm hover:opacity-95"
            style={{ backgroundColor: ORANGE }}
          >
            ALL
          </Button>
          <Select value={priceSort} onValueChange={setPriceSort}>
            <SelectTrigger className="h-10 w-fit min-w-[7.5rem] rounded-[10px] border border-gray-900 bg-white text-sm font-medium text-gray-900 shadow-none">
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Price</SelectItem>
              <SelectItem value="low">Price: Low to High</SelectItem>
              <SelectItem value="high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <main className="mx-auto w-full min-w-0 max-w-full px-4 pb-8 pt-10 sm:px-5">
        <div className="grid w-full grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-[15px] sm:gap-y-10">
          {filtered.map((order) => (
            <div key={order.id} className="min-w-0">
              <OrderGridCard
                order={order}
                bookmarked={bookmarked.has(order.id)}
                onToggleBookmark={() => toggleBookmark(order.id)}
                onViewDetail={() =>
                  navigate(
                    generatePath(ROUTES.DELIVERY.ORDER_DETAIL, {
                      orderId: order.orderNo,
                    }),
                  )
                }
              />
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="py-16 text-center text-sm text-gray-500">
            No orders match your search.
          </p>
        )}
      </main>
    </div>
  );
}
