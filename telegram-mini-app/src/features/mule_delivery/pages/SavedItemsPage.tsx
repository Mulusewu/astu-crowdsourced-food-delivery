import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Trash2, ChevronRight, Bookmark } from "lucide-react";
import { useSavedItemsStore, type SavedItem } from "@/store/savedItemsStore";
import { ROUTES, buildRoute } from "@/routes/routePaths";

// ─── SavedItemCard ────────────────────────────────────────────────────────────
function SavedItemCard({
  item,
  onDelete,
  onClick,
}: {
  item: SavedItem;
  onDelete: (id: string) => void;
  onClick: () => void;
}) {
  return (
    <article 
      onClick={onClick}
      className="flex items-center gap-4 rounded-[28px] bg-white dark:bg-gray-900 px-5 py-4 shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-gray-800 active:scale-[0.98] transition-all cursor-pointer group"
    >
      {/* Circular image */}
      <div className="relative shrink-0">
        <div className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 border-4 border-gray-50 dark:border-gray-800 shadow-inner">
          <div className="h-full w-full overflow-hidden rounded-full">
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
        <p className="truncate text-[17px] font-black text-gray-900 dark:text-white leading-tight">
          {item.name}
        </p>
        <div className="mt-1 flex items-center gap-1">
          <MapPin
            className="h-3.5 w-3.5 shrink-0 text-red-500"
            strokeWidth={2.5}
            aria-hidden
          />
          <span className="truncate text-[13px] font-bold text-gray-500 dark:text-gray-400">
            {item.location}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
          className="shrink-0 rounded-full p-2.5 text-gray-300 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-500 transition-colors"
          aria-label={`Remove ${item.name} from saved items`}
        >
          <Trash2 className="h-5 w-5" strokeWidth={2} />
        </button>
        <ChevronRight className="text-gray-300 group-hover:text-[#F26A1C] transition-colors" size={20} />
      </div>
    </article>
  );
}

// ─── SavedItemsPage ───────────────────────────────────────────────────────────
export default function SavedItemsPage() {
  const navigate = useNavigate();
  const { items, removeItem } = useSavedItemsStore();

  const handleItemClick = (item: SavedItem) => {
    // If it looks like a cafe (mock logic for now), go to Cafe Details
    // Otherwise go to available orders filtered by name/location
    const cafeId = item.id.startsWith("rest") ? item.id : `rest_001`; // fallback for mock
    navigate(buildRoute(ROUTES.DELIVERY.CAFE_DETAILS, { cafeId }));
  };

  return (
    <div className="flex flex-col bg-[#FDFDFD] dark:bg-gray-950 min-h-screen font-sans">
      {/* ── Header ── */}
      <header className="sticky top-0 z-20 bg-[#FDFDFD]/90 dark:bg-gray-950/90 backdrop-blur-md px-5 pt-[max(2rem,env(safe-area-inset-top))] pb-6">
        <div className="relative flex items-center justify-center">
          <button
            type="button"
            onClick={() => navigate(ROUTES.DELIVERY.DASHBOARD)}
            className="absolute left-0 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFEFE5] dark:bg-orange-950/30 text-[#F26A1C] active:scale-95 transition-transform"
            aria-label="Go back"
          >
            <ArrowLeft className="h-6 w-6" strokeWidth={2.5} />
          </button>

          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Saved Spots</h1>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="flex-1 overflow-y-auto px-5 py-2">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-[32px] bg-orange-50 dark:bg-orange-900/20 rotate-12">
              <Bookmark className="h-10 w-10 text-[#F26A1C]" strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white">No Saved Spots</h2>
            <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400 max-w-[220px] mx-auto leading-relaxed">
              Your favorite pickup locations and frequent cafes will appear here for quick access.
            </p>
            <button
              onClick={() => navigate(ROUTES.DELIVERY.DASHBOARD)}
              className="mt-8 bg-[#F26A1C] text-white px-8 py-3.5 rounded-full font-black shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
            >
              Explore Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <SavedItemCard 
                key={item.id} 
                item={item} 
                onDelete={removeItem} 
                onClick={() => handleItemClick(item)}
              />
            ))}
          </div>
        )}

        <div className="mt-12 mb-8 p-6 rounded-[32px] bg-orange-50 dark:bg-orange-950/10 border border-orange-100 dark:border-orange-900/20">
          <p className="text-[13px] font-black text-[#F26A1C] uppercase tracking-wider mb-2">Delivery Tip</p>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed">
            Saving your frequent cafes helps you quickly check for new orders when you're nearby.
          </p>
        </div>
      </main>
    </div>
  );
}
