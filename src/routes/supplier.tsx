import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  CreditCard,
  DollarSign,
  Package,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Lock,
  Eye,
  EyeOff,
  LogOut,
} from "lucide-react";

export const Route = createFileRoute("/supplier")({
  head: () => ({
    meta: [
      { title: "Yetkazib Beruvchilar Paneli — Cookpal" },
      {
        name: "description",
        content: "Mijozlardan tushgan buyurtmalar, manzil va yetkazib berish nazorati.",
      },
    ],
  }),
  component: SupplierPortal,
});

export type SupplierOrder = {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  recipeId: string;
  recipeTitle: string;
  recipeImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  paymentMethod: string;
  cardNumber?: string;
  status: "Kutilmoqda ⏳" | "Yetkazib berildi ✅";
  createdAt: string;
};

// Fixed supplier credentials — only courier can enter
const SUPPLIER_USERNAME = "courier";
const SUPPLIER_PASSWORD = "pass123";
const SUPPLIER_AUTH_KEY = "cookpal.supplier_auth";
const STORAGE_KEY = "cookpal.supplier_orders";

// Default seed orders shown initially
const defaultSeedOrders: SupplierOrder[] = [
  {
    id: "ORD-101",
    customerName: "Alisher Navoiy",
    phone: "+998 90 123 45 67",
    address: "Toshkent sh., Chilonzor t., 15-uy, 24-xonadon",
    recipeId: "italian-margherita-pizza",
    recipeTitle: "Classic Italian Margherita Pizza",
    recipeImage:
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80",
    quantity: 2,
    unitPrice: 140,
    totalPrice: 280,
    paymentMethod: "Karta (HUMO)",
    cardNumber: "9860 **** **** 4120",
    status: "Kutilmoqda ⏳",
    createdAt: "Bugun, 14:30",
  },
  {
    id: "ORD-102",
    customerName: "Dilnoza Ahmedova",
    phone: "+998 97 765 43 21",
    address: "Toshkent sh., Yunusobod t., 4-kvartal, 8-uy",
    recipeId: "pad-thai-shrimp",
    recipeTitle: "Authentic Pad Thai Shrimp",
    recipeImage:
      "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80",
    quantity: 1,
    unitPrice: 135,
    totalPrice: 135,
    paymentMethod: "Naqd pul",
    status: "Kutilmoqda ⏳",
    createdAt: "Bugun, 15:10",
  },
  {
    id: "ORD-103",
    customerName: "Sardor Rahimov",
    phone: "+998 93 333 22 11",
    address: "Toshkent sh., Mirzo Ulug'bek t., Buyuk Ipak Yoli 45",
    recipeId: "teriyaki-salmon-bowl",
    recipeTitle: "Teriyaki Glazed Salmon Bowl",
    recipeImage:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    quantity: 3,
    unitPrice: 160,
    totalPrice: 480,
    paymentMethod: "Karta (UZCARD)",
    cardNumber: "8600 **** **** 9012",
    status: "Yetkazib berildi ✅",
    createdAt: "Bugun, 12:20",
  },
];

// ─── Login Gate Component ────────────────────────────────────────────
function SupplierLogin({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      if (
        username.trim().toLowerCase() === SUPPLIER_USERNAME &&
        password === SUPPLIER_PASSWORD
      ) {
        localStorage.setItem(SUPPLIER_AUTH_KEY, "true");
        onLogin();
      } else {
        setError("Login yoki parol noto'g'ri. Faqat ruxsat berilgan kuryerlar kirishi mumkin.");
      }
      setLoading(false);
    }, 700);
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary shadow-2xl mb-4">
            <Truck className="size-9 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Yetkazib Beruvchilar Paneli
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Bu sahifa faqat ruxsatli kuryerlar va ta'minotchilar uchun.
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-primary mb-6">
            <Lock className="size-4" /> Tizimga kirish
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Foydalanuvchi nomi
              </label>
              <input
                type="text"
                required
                autoComplete="username"
                placeholder="courier"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 text-base font-bold text-white outline-none placeholder:text-slate-600 transition focus:border-primary focus:ring-2 focus:ring-primary/25"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Parol
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 pr-12 text-base font-bold text-white outline-none placeholder:text-slate-600 transition focus:border-primary focus:ring-2 focus:ring-primary/25"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-xs font-bold text-red-400">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-base font-extrabold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
            >
              {loading ? (
                <span className="size-5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
              ) : (
                <Lock className="size-5" />
              )}
              {loading ? "Tekshirilmoqda..." : "Kirish"}
            </button>
          </form>

          {/* Back to main site */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-300 transition"
            >
              <ArrowLeft className="size-3.5" /> Asosiy saytga qaytish
            </Link>
          </div>
        </div>

        {/* Security note */}
        <p className="mt-5 text-center text-[11px] text-slate-600">
          Ruxsatsiz kirish urinishlari qayd etiladi va tekshiriladi.
        </p>
      </div>
    </div>
  );
}

// ─── Main Supplier Portal Component ─────────────────────────────────
export function SupplierPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [orders, setOrders] = useState<SupplierOrder[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Check auth on mount
  useEffect(() => {
    const auth = localStorage.getItem(SUPPLIER_AUTH_KEY);
    setIsAuthenticated(auth === "true");
  }, []);

  // Load orders from localStorage
  function loadOrders() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setOrders(JSON.parse(raw) as SupplierOrder[]);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSeedOrders));
        setOrders(defaultSeedOrders);
      }
    } catch {
      setOrders(defaultSeedOrders);
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
      const handleEvent = () => loadOrders();
      window.addEventListener("cookpal_order_created", handleEvent);
      window.addEventListener("storage", handleEvent);
      return () => {
        window.removeEventListener("cookpal_order_created", handleEvent);
        window.removeEventListener("storage", handleEvent);
      };
    }
  }, [isAuthenticated]);

  function saveOrders(nextOrders: SupplierOrder[]) {
    setOrders(nextOrders);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextOrders));
    } catch (e) {
      console.error(e);
    }
  }

  function handleLogout() {
    localStorage.removeItem(SUPPLIER_AUTH_KEY);
    setIsAuthenticated(false);
  }

  function handleMarkAsDelivered(orderId: string, e: React.MouseEvent) {
    e.stopPropagation();
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, status: "Yetkazib berildi ✅" as const } : o
    );
    saveOrders(updated);
  }

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <span className="size-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  // Not authenticated → show login
  if (!isAuthenticated) {
    return <SupplierLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  // Compute statistics from real orders
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((o) => o.status === "Yetkazib berildi ✅");
  const deliveredCount = deliveredOrders.length;
  const remainingCount = totalOrders - deliveredCount;
  const totalRevenue = deliveredOrders.reduce((sum, o) => sum + o.totalPrice, 0);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-20">
      {/* Supplier Navbar */}
      <header className="border-b border-slate-800 bg-slate-950/90 sticky top-0 z-30 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black shadow-lg">
              <Truck className="size-6" />
            </span>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight">Yetkazib Beruvchilar Paneli</h1>
              <p className="text-xs text-slate-400">Kuryer: courier</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800 transition"
            >
              <ArrowLeft className="size-4" /> Asosiy sayt
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-red-700/50 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 transition"
            >
              <LogOut className="size-4" /> Chiqish
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-6 py-8 space-y-8">
        {/* Statistics */}
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 shadow-lg">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Package className="size-4 text-blue-400" /> Jami Buyurtmalar
            </div>
            <p className="mt-2 text-3xl font-black text-white">{totalOrders} ta</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 shadow-lg">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <CheckCircle className="size-4 text-emerald-400" /> Yetkazib Berildi
            </div>
            <p className="mt-2 text-3xl font-black text-emerald-400">{deliveredCount} ta</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 shadow-lg">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Clock className="size-4 text-amber-400" /> Qolgan
            </div>
            <p className="mt-2 text-3xl font-black text-amber-400">{remainingCount} ta</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 shadow-lg">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <DollarSign className="size-4 text-primary" /> Jami Daromad
            </div>
            <p className="mt-2 text-3xl font-black text-primary">$ {totalRevenue}</p>
          </div>
        </section>

        {/* Orders List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-xl font-extrabold">Tushgan Buyurtmalar</h2>
            <span className="text-xs text-slate-400">
              Kartani bosib manzilni ko'ring
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center text-slate-500">
              Hali buyurtmalar kelmadi. Asosiy saytdan buyurtma berilganda bu yerda ko'rinadi.
            </div>
          ) : (
            orders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              const isDelivered = order.status === "Yetkazib berildi ✅";

              return (
                <div
                  key={order.id}
                  onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                  className={`cursor-pointer rounded-2xl border overflow-hidden transition-all duration-200 ${
                    isDelivered
                      ? "border-slate-800/60 bg-slate-950/40 opacity-80"
                      : "border-slate-700 bg-slate-950/90 shadow-md hover:border-primary"
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-5 flex flex-wrap items-center gap-4 sm:flex-nowrap">
                    <img
                      src={order.recipeImage}
                      alt={order.recipeTitle}
                      className="size-16 rounded-xl object-cover shrink-0 border border-slate-800"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                        <span>{order.id}</span>
                        <span>•</span>
                        <span>{order.createdAt}</span>
                      </div>
                      <h3 className="font-extrabold text-base text-white truncate mt-0.5">
                        {order.recipeTitle}
                      </h3>
                      <p className="text-xs font-bold text-slate-400">
                        Miqdor:{" "}
                        <span className="text-primary font-black text-sm">{order.quantity} ta</span>{" "}
                        ($ {order.unitPrice} / dona)
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0 ml-auto">
                      <span className="text-xl font-black text-primary">$ {order.totalPrice}</span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-extrabold border ${
                          isDelivered
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            : "bg-amber-500/15 text-amber-400 border-amber-500/30 animate-pulse"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="text-slate-500 pl-1">
                      {isExpanded ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
                    </div>
                  </div>

                  {/* Expanded Detail */}
                  {isExpanded && (
                    <div className="border-t border-slate-800 bg-slate-900/60 p-5 space-y-4">
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-1.5 rounded-xl bg-slate-950/80 p-4 border border-slate-800">
                          <span className="flex items-center gap-1.5 text-xs font-extrabold uppercase text-primary">
                            <MapPin className="size-4" /> Yetkazib berish manzili
                          </span>
                          <p className="text-sm font-bold text-white">{order.address}</p>
                        </div>

                        <div className="space-y-1.5 rounded-xl bg-slate-950/80 p-4 border border-slate-800">
                          <span className="flex items-center gap-1.5 text-xs font-extrabold uppercase text-primary">
                            <Phone className="size-4" /> Buyurtmachi
                          </span>
                          <p className="text-sm font-bold text-white">{order.customerName}</p>
                          <p className="text-xs font-mono text-slate-400">{order.phone}</p>
                        </div>

                        <div className="space-y-1.5 rounded-xl bg-slate-950/80 p-4 border border-slate-800">
                          <span className="flex items-center gap-1.5 text-xs font-extrabold uppercase text-primary">
                            <CreditCard className="size-4" /> To'lov
                          </span>
                          <p className="text-sm font-bold text-white">{order.paymentMethod}</p>
                          {order.cardNumber && (
                            <p className="text-xs font-mono text-slate-400">{order.cardNumber}</p>
                          )}
                        </div>
                      </div>

                      {/* Delivered Button */}
                      {!isDelivered ? (
                        <div className="flex justify-end pt-1">
                          <button
                            type="button"
                            onClick={(e) => handleMarkAsDelivered(order.id, e)}
                            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-extrabold text-white shadow-lg transition-all hover:bg-emerald-500 hover:scale-105 active:scale-95"
                          >
                            <CheckCircle className="size-5" />
                            Yetkazib berildi — $ {order.totalPrice} daromadga qo'shilsin
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-emerald-400">
                          <CheckCircle className="size-4" />
                          Yetkazib berilgan — $ {order.totalPrice} daromadga o'tgan.
                        </div>
                      )}
                    </div>
                  )}

                  {/* Bottom quick action bar (collapsed & not delivered) */}
                  {!isExpanded && !isDelivered && (
                    <div className="border-t border-slate-800 bg-slate-900/40 px-5 py-3 flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-bold">
                        📍 Manzilni ko'rish uchun kartani bosing
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleMarkAsDelivered(order.id, e)}
                        className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-extrabold text-white shadow transition-all hover:bg-emerald-500 active:scale-95"
                      >
                        <CheckCircle className="size-4" /> Yetkazib berildi ($ {order.totalPrice})
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </section>
      </main>
    </div>
  );
}
