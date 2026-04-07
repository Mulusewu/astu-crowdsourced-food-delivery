import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Trash2 } from "lucide-react";
import BottomNav from "@/components/common/BottomNav1";

// ─── constants ────────────────────────────────────────────────────────────────
const ORANGE = "#F27420";
const ORANGE_SOFT = "#FFF0E6";

// ─── types ────────────────────────────────────────────────────────────────────
interface SavedItem {
  id: string;
  name: string;
  location: string;
  image: string;
}

// ─── mock data ────────────────────────────────────────────────────────────────
const INITIAL_SAVED_ITEMS: SavedItem[] = [
  {
    id: "1",
    name: "Helen Cafe",
    location: "Bole Gate",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop",
  },
  {
    id: "2",
    name: "Yesome Special",
    location: "Helen Cafe",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop",
  },
  {
    id: "3",
    name: "Bole Mami",
    location: "Bole Gate",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop",
  },
  {
    id: "4",
    name: "Barch Food Zone",
    location: "Bole Gate",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=200&fit=crop",
  },
  {
    id: "5",
    name: "Pasta Besego",
    location: "Bole Mami",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&h=200&fit=crop",
  },
  {
    id: "6",
    name: "Helen Cafe",
    location: "Bole Gate",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop",
  },
];

// ─── SavedItemCard ────────────────────────────────────────────────────────────
function SavedItemCard({
  item,
  onDelete,
}: {
  item: SavedItem;
  onDelete: (id: string) => void;
}) {
  return (
    <article className="flex items-center gap-4 rounded-2xl bg-white px-4 py-3.5 shadow-[0_2px_16px_rgba(0,0,0,0.07)] ring-1 ring-gray-100">
      {/* Circular image */}
      <div className="relative shrink-0">
        {/* Outer grey ring */}
        <div className="flex h-[62px] w-[62px] items-center justify-center rounded-full bg-gray-100 ring-4 ring-gray-200/70">
          <div className="h-[54px] w-[54px] overflow-hidden rounded-full">
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>
      </div>

      {/* Name + location */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-bold text-gray-900">{item.name}</p>
        <div className="mt-0.5 flex items-center gap-1">
          <MapPin
            className="h-3.5 w-3.5 shrink-0"
            style={{ color: ORANGE }}
            strokeWidth={2.5}
            aria-hidden
          />
          <span className="truncate text-sm text-gray-500">{item.location}</span>
        </div>
      </div>

      {/* Delete button */}
      <button
        type="button"
        onClick={() => onDelete(item.id)}
        className="shrink-0 rounded-xl p-2 transition hover:bg-orange-50 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F27420]/40"
        aria-label={`Remove ${item.name} from saved items`}
      >
        <Trash2
          className="h-6 w-6"
          style={{ color: ORANGE }}
          strokeWidth={1.75}
        />
      </button>
    </article>
  );
}

// ─── Separator ────────────────────────────────────────────────────────────────
function Separator() {
  return (
    <div className="flex items-center py-3" aria-hidden>
      <div
        className="h-[2px] w-full rounded-full"
        style={{ backgroundColor: ORANGE }}
      />
    </div>
  );
}

// ─── SavedItemsPage ───────────────────────────────────────────────────────────
export default function SavedItemsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<SavedItem[]>(INITIAL_SAVED_ITEMS);

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* ── Header ── */}
      <header className="sticky top-0 z-20 bg-white px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] shadow-[0_1px_0_rgba(0,0,0,0.06)]">
        <div className="relative flex h-12 items-center justify-center">
          {/* Back button */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-xl border border-[#F27420]/30 transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F27420]/40"
            style={{ backgroundColor: ORANGE_SOFT }}
            aria-label="Go back"
          >
            <ArrowLeft
              className="h-5 w-5"
              style={{ color: ORANGE }}
              strokeWidth={2.5}
            />
          </button>

          {/* Title */}
          <h1 className="text-xl font-bold text-gray-900">Saved Items</h1>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="flex-1 overflow-y-auto px-4 py-5 pb-32">
        <div className="mx-auto w-full max-w-lg">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                style={{ backgroundColor: ORANGE_SOFT }}
              >
                <Trash2 className="h-8 w-8" style={{ color: ORANGE }} />
              </div>
              <p className="text-base font-semibold text-gray-700">
                No saved items yet
              </p>
              <p className="mt-1 text-sm text-gray-400">
                Items you save will appear here.
              </p>
            </div>
          ) : (
            items.map((item, index) => (
              <div key={item.id}>
                <SavedItemCard item={item} onDelete={handleDelete} />
                {index < items.length - 1 && <Separator />}
              </div>
            ))
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
