import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  Sun,
  Lock,
  ClipboardList,
  ChevronRight,
  Camera,
} from "lucide-react";
import DeliveryBottomNav from "@/features/delivery/components/DeliveryBottomNav";
import { ROUTES } from "@/routes/routePaths";
import { cn } from "@/lib/utils";

const ACCENT = "#F16A21";
const ACCENT_SOFT = "#FFF0E6";

type ProfileMenuItem =
  | {
      id: string;
      icon: typeof Mail;
      label: string;
      value: string;
      variant?: "default";
    }
  | {
      id: string;
      icon: typeof Sun;
      label: string;
      value: string;
      variant: "theme";
    }
  | {
      id: string;
      icon: typeof Lock;
      label: string;
      value?: undefined;
      variant?: "default";
    };

const MENU_ITEMS: ProfileMenuItem[] = [
  {
    id: "email",
    icon: Mail,
    label: "Johndoe@Gmail.Com",
    value: "",
  },
  {
    id: "phone",
    icon: Phone,
    label: "0949486753",
    value: "",
  },
  {
    id: "theme",
    icon: Sun,
    label: "Theme",
    value: "Light",
    variant: "theme",
  },
  {
    id: "password",
    icon: Lock,
    label: "Password",
  },
  {
    id: "payment",
    icon: ClipboardList,
    label: "Payment Method",
  },
];

function ProfileMenuRow({
  item,
  showDivider,
  onPress,
}: {
  item: ProfileMenuItem;
  showDivider: boolean;
  onPress?: () => void;
}) {
  const Icon = item.icon;

  return (
    <li>
      <button
        type="button"
        onClick={onPress}
        className={cn(
          "flex w-full items-center gap-4 py-4 text-left transition-colors hover:bg-gray-50/80 sm:py-5",
          showDivider && "border-b border-[#F16A21]/25",
        )}
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center text-gray-900">
          <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
        </span>
        <span className="min-w-0 flex-1 text-base text-gray-500 sm:text-[0.95rem]">
          {item.variant === "theme" ? (
            <span className="text-gray-500">{item.label}</span>
          ) : (
            item.label
          )}
        </span>
        {item.variant === "theme" && (
          <span className="shrink-0 text-sm text-gray-400">{item.value}</span>
        )}
        <ChevronRight
          className="h-5 w-5 shrink-0 text-gray-300"
          strokeWidth={2}
          aria-hidden
        />
      </button>
    </li>
  );
}

export default function DelivererProfilePage() {
  const navigate = useNavigate();


  return (
    <div className="min-h-screen bg-white pb-36">
      <header className="sticky top-0 z-20 bg-white px-4 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="relative flex h-12 items-center justify-center sm:h-14">
          <button
            type="button"
            onClick={() => navigate(ROUTES.DELIVERY.DASHBOARD)}
            className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-xl transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F16A21]/40"
            style={{ backgroundColor: ACCENT_SOFT }}
            aria-label="Go back"
          >
            <ArrowLeft
              className="h-5 w-5 font-bold"
              style={{ color: ACCENT }}
              strokeWidth={2.5}
            />
          </button>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Profile
          </h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-lg px-4 sm:max-w-xl sm:px-6 lg:max-w-2xl">
        <section
          className="flex flex-col items-center pt-2 pb-8"
          aria-labelledby="profile-heading"
        >
          <h2 id="profile-heading" className="sr-only">
            Your profile
          </h2>
          <div className="relative">
            <div
              className="h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-lg ring-1 ring-black/5 sm:h-36 sm:w-36"
              style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
            >
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
                alt="Natnael Abebe"
                className="h-full w-full object-cover"
              />
            </div>
            <button
              type="button"
              className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white shadow-md transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F16A21]/50"
              style={{ backgroundColor: "#fff" }}
              aria-label="Change profile photo"
            >
              <Camera
                className="h-4 w-4"
                style={{ color: ACCENT }}
                strokeWidth={2}
              />
            </button>
          </div>
          <p className="mt-5 text-center text-lg font-bold text-gray-900 sm:text-xl">
            Natnael Abebe
          </p>
        </section>

        <section
          className="rounded-3xl bg-white px-4 py-2 shadow-[0_10px_40px_rgba(0,0,0,0.08)] ring-1 ring-gray-100 sm:px-6"
          aria-label="Account settings"
        >
          <ul className="divide-y-0">
            {MENU_ITEMS.map((item, index) => (
              <ProfileMenuRow
                key={item.id}
                item={item}
                showDivider={index < MENU_ITEMS.length - 1}
                onPress={() => {
                  /* wire screens later */
                }}
              />
            ))}
          </ul>
        </section>
      </main>

      <DeliveryBottomNav />
    </div>
  );
}
