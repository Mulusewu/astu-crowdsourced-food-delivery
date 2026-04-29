import { useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Store,
  MapPin,
  UtensilsCrossed,
} from "lucide-react";
import { Button } from "@/components/ui/button";


const ORANGE = "#F27420";
const ORANGE_SOFT = "#FFF0E6";

export type DetailLineItem = {
  id: string;
  name: string;
  priceEtb: number;
  image: string;
};

export type OrderDetailPayload = {
  cafeName: string;
  orderNumber: string;
  location: string;
  lineItems: DetailLineItem[];
  subTotalEtb: number;
  deliveryFeeEtb: number;
  distanceKm: string;
  minutesToDeliver: number;
};

/** Demo payload matching the Helen Cafe order #123 design. */
const HELEN_ORDER_123: OrderDetailPayload = {
  cafeName: "Helen Cafe",
  orderNumber: "123",
  location: "Male Dorm Block-512 R-34",
  lineItems: [
    {
      id: "a",
      name: "Beyayenet",
      priceEtb: 100,
      image:
        "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=200&h=200&fit=crop",
    },
    {
      id: "b",
      name: "Normal Ferfer",
      priceEtb: 110,
      image:
        "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200&h=200&fit=crop",
    },
    {
      id: "c",
      name: "Pasta Besego",
      priceEtb: 90,
      image:
        "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&h=200&fit=crop",
    },
  ],
  subTotalEtb: 300,
  deliveryFeeEtb: 50,
  distanceKm: "2.1",
  minutesToDeliver: 30,
};

function LineItemCard({
  item,
  location,
}: {
  item: DetailLineItem;
  location: string;
}) {
  return (
    <article className="flex gap-4 rounded-2xl bg-white p-3 shadow-[0_4px_20px_rgba(0,0,0,0.07)] ring-1 ring-gray-100 sm:p-4">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border border-gray-100 bg-gray-50 shadow-sm sm:h-[5.5rem] sm:w-[5.5rem]">
        <img
          src={item.image}
          alt=""
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="min-w-0 flex-1 py-0.5">
        <h3 className="text-base font-bold text-gray-900 sm:text-lg">
          {item.name}
        </h3>
        <p className="mt-1 text-sm text-gray-900 sm:text-base">
          {item.priceEtb} ETB
        </p>
        <div className="mt-2 flex items-start gap-1.5 text-xs text-gray-500 sm:text-sm">
          <MapPin
            className="mt-0.5 h-4 w-4 shrink-0"
            style={{ color: ORANGE }}
            strokeWidth={2}
            aria-hidden
          />
          <span>{location}</span>
        </div>
      </div>
    </article>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3.5">
      <span className="text-sm text-gray-700 sm:text-base">{label}</span>
      <span
        className="text-sm font-semibold sm:text-base"
        style={{ color: ORANGE }}
      >
        {value}
      </span>
    </div>
  );
}

function orderIdFromPath(pathname: string): string | undefined {
  const m = pathname.match(/\/delivery\/orders\/([^/]+)/);
  return m?.[1];
}

export default function DeliveryOrderDetailPage() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const params = useParams<{ orderId?: string }>();
  /** Params are empty when this screen is rendered from the splat fallback (RR7 quirk). */
  const orderId = params.orderId ?? orderIdFromPath(pathname);

  const data = useMemo<OrderDetailPayload>(() => {
    if (!orderId) return HELEN_ORDER_123;
    const num = orderId.replace(/\D/g, "");
    return {
      ...HELEN_ORDER_123,
      orderNumber: num || HELEN_ORDER_123.orderNumber,
    };
  }, [orderId]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-white pb-8">
      <header className="sticky top-0 z-20 bg-white px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] shadow-[0_1px_0_rgba(0,0,0,0.06)]">
        <div className="relative flex h-12 items-center justify-center sm:h-14">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-xl border border-[#F27420]/30 transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F27420]/40"
            style={{ backgroundColor: ORANGE_SOFT }}
            aria-label="Go back"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
              <ArrowLeft
                className="h-4 w-4"
                style={{ color: ORANGE }}
                strokeWidth={2.75}
              />
            </span>
          </button>
          <div className="flex max-w-[70%] items-center justify-center gap-2">
            <Store
              className="h-6 w-6 shrink-0 sm:h-7 sm:w-7"
              style={{ color: ORANGE }}
              strokeWidth={2}
              aria-hidden
            />
            <h1 className="truncate text-center text-lg font-bold text-gray-900 sm:text-xl">
              {data.cafeName}
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-lg px-4 pb-32 pt-6 sm:max-w-xl sm:px-5">
        <div className="flex flex-col gap-4 sm:gap-5">
          {data.lineItems.map((item) => (
            <LineItemCard
              key={item.id}
              item={item}
              location={data.location}
            />
          ))}
        </div>

        <section
          className="mt-8 rounded-2xl bg-white px-4 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.08)] ring-1 ring-gray-100 sm:px-5 sm:py-5"
          aria-label="Order summary"
        >
          <div className="mb-1 flex items-center gap-2">
            <UtensilsCrossed
              className="h-5 w-5 sm:h-6 sm:w-6"
              style={{ color: ORANGE }}
              strokeWidth={2}
              aria-hidden
            />
            <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
              Order #{data.orderNumber}
            </h2>
          </div>

          <div className="mt-2 divide-y divide-gray-200">
            <SummaryRow
              label="Sub Total"
              value={`${data.subTotalEtb} ETB`}
            />
            <SummaryRow
              label="Delivery Fee"
              value={`${data.deliveryFeeEtb} ETB`}
            />
            <SummaryRow
              label="Delivery Distance"
              value={`${data.distanceKm} Km`}
            />
            <SummaryRow
              label="Time To Deliver"
              value={`${data.minutesToDeliver} Min`}
            />
          </div>
        </section>

        <div className="mt-6 flex gap-3 sm:gap-4">
          <Button
            type="button"
            className="h-12 flex-1 rounded-xl border-0 text-base font-semibold text-white shadow-sm hover:opacity-95"
            style={{ backgroundColor: ORANGE }}
            onClick={() => {
              /* accept flow */
            }}
          >
            Accept
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-12 flex-1 rounded-xl border-2 bg-white text-base font-semibold shadow-none hover:bg-orange-50"
            style={{ borderColor: ORANGE, color: ORANGE }}
            onClick={() => {
              /* decline flow */
            }}
          >
            Decline
          </Button>
        </div>
      </main>
    </div>
  );
}
