import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  CreditCard,
  Package,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  User,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "@/lib/theme";

export const Route = createFileRoute("/supplier")({
  head: () => ({
    meta: [
      { title: "Supplier Dashboard — Cookpal" },
      {
        name: "description",
        content: "Secure courier panel for managing deliveries and orders in Cookpal.",
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

const SUPPLIER_USERNAME = "courier";
const SUPPLIER_PASSWORD = "pass123";
const SUPPLIER_AUTH_KEY = "cookpal.supplier_auth";
const STORAGE_KEY = "cookpal.supplier_orders";

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
    paymentMethod: "Card (HUMO)",
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
    paymentMethod: "Cash",
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
    paymentMethod: "Card (UZCARD)",
    cardNumber: "8600 **** **** 9012",
    status: "Yetkazib berildi ✅",
    createdAt: "Bugun, 12:20",
  },
];

// ─────────────────────────────────────────────────────────────────────
// COOKPAL STYLE LOGIN COMPONENT
// ─────────────────────────────────────────────────────────────────────
function SupplierLogin({ onLogin }: { onLogin: () => void }) {
  const { theme, toggleTheme } = useTheme();
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
        setError("Login yoki parol noto'g'ri. Faqat vakolatli kuryerlar kiritiladi.");
      }
      setLoading(false);
    }, 600);
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/20">
      <div className="w-full max-w-md space-y-6">
        {/* Main Card */}
        <div className="bg-card border border-border shadow-lg rounded-3xl p-8 sm:p-10 space-y-6 relative overflow-hidden">
          {/* Decorative subtle green corner gradient */}
          <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

          {/* Theme toggle button top right */}
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={toggleTheme}
              className="inline-flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer px-2 py-1"
              title={theme === "dark" ? "Light Mode-ga o'tish" : "Dark Mode-ga o'tish"}
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-sky-500" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>

          {/* Header Badge & Title */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20 mx-auto">
              <Truck className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Supplier Portal
              </h1>
              <p className="text-sm text-muted-foreground mt-1 font-medium">
                Cookpal Kuryerlar va Ta'minotchilar Tizimi
              </p>
            </div>
          </div>

          {/* Security Banner */}
          <div className="flex items-center gap-2.5 bg-primary/5 border border-primary/20 rounded-2xl px-4 py-2.5 text-xs text-primary font-semibold">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Xavfsiz ulanish · Cookpal Logistics</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                Foydalanuvchi nomi
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  placeholder="courier"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 bg-background border border-input rounded-xl text-foreground text-sm font-semibold placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                Parol
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-11 bg-background border border-input rounded-xl text-foreground text-sm font-semibold placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 text-xs font-semibold text-destructive flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary text-primary-foreground font-bold text-sm rounded-xl shadow-md hover:bg-primary/90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <Truck className="w-4 h-4" />
              )}
              <span>{loading ? "Tekshirilmoqda..." : "Tizimga kirish"}</span>
            </button>
          </form>



          <div className="text-center pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Bosh sahifaga qaytish
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// COOKPAL STYLE STAT CARD
// ─────────────────────────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  badgeText,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  badgeText?: string;
}) {
  return (
    <div className="bg-card border border-border/80 shadow-sm rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          {icon}
          {label}
        </span>
        {badgeText && (
          <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary/20">
            {badgeText}
          </span>
        )}
      </div>
      <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
        {value}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// MAIN PORTAL
// ─────────────────────────────────────────────────────────────────────
export function SupplierPortal() {
  const { theme, toggleTheme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [orders, setOrders] = useState<SupplierOrder[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem(SUPPLIER_AUTH_KEY);
    setIsAuthenticated(auth === "true");
  }, []);

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

  function saveOrders(next: SupplierOrder[]) {
    setOrders(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* noop */
    }
  }

  function handleLogout() {
    localStorage.removeItem(SUPPLIER_AUTH_KEY);
    setIsAuthenticated(false);
  }

  function handleMarkDelivered(orderId: string, e: React.MouseEvent) {
    e.stopPropagation();
    saveOrders(
      orders.map((o) =>
        o.id === orderId ? { ...o, status: "Yetkazib berildi ✅" as const } : o
      )
    );
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SupplierLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  const totalOrders = orders.length;
  const delivered = orders.filter((o) => o.status === "Yetkazib berildi ✅");
  const deliveredCount = delivered.length;
  const remaining = totalOrders - deliveredCount;
  const revenue = delivered.reduce((s, o) => s + o.totalPrice, 0);

  const pending = orders.filter((o) => o.status !== "Yetkazib berildi ✅");
  const done = orders.filter((o) => o.status === "Yetkazib berildi ✅");

  return (
    <div className="min-h-screen bg-muted/20 pb-16">
      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* ── Top Cookpal Header Banner ── */}
        <div className="bg-card border border-border/80 shadow-sm rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-md shrink-0">
              <Truck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  Supplier Dashboard
                </h1>
                <span className="bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full text-xs font-extrabold">
                  Cookpal Courier
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1 font-medium">
                Real-vaqt rejimida buyurtmalarni kuzatish va yetkazib berish holatini boshqarish
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto relative z-10">
            <button
              onClick={toggleTheme}
              className="inline-flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer px-2 py-1"
              title={theme === "dark" ? "Light Mode-ga o'tish" : "Dark Mode-ga o'tish"}
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-sky-500" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-input bg-background hover:bg-muted text-foreground text-xs font-bold transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Bosh sahifa
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-destructive/20 bg-destructive/5 hover:bg-destructive/10 text-destructive text-xs font-bold transition-all"
            >
              <LogOut className="w-3.5 h-3.5" /> Chiqish
            </button>
          </div>
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<Package className="w-4 h-4 text-primary" />}
            label="Jami Buyurtmalar"
            value={`${totalOrders}`}
            badgeText="Barchasi"
          />
          <StatCard
            icon={<CheckCircle className="w-4 h-4 text-emerald-600" />}
            label="Yetkazib Berildi"
            value={`${deliveredCount}`}
            badgeText="Muvaffaqiyatli"
          />
          <StatCard
            icon={<Clock className="w-4 h-4 text-amber-600" />}
            label="Kutilmoqda"
            value={`${remaining}`}
            badgeText="Jarayonda"
          />
          <StatCard
            icon={<TrendingUp className="w-4 h-4 text-primary" />}
            label="Jami Tushum"
            value={`$${revenue}`}
            badgeText="Tushum"
          />
        </div>

        {/* ── Pending Deliveries ── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-foreground flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              Kutilayotgan yetkazib berishlar
              <span className="bg-amber-100 text-amber-800 border border-amber-200 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                {pending.length} ta
              </span>
            </h2>
            <span className="text-xs font-medium text-muted-foreground hidden sm:inline">
              Manzil va ma'lumotlarni ko'rish uchun kartochkani bosing
            </span>
          </div>

          {pending.length === 0 ? (
            <div className="bg-card border border-dashed border-border rounded-3xl p-10 text-center space-y-2">
              <Sparkles className="w-8 h-8 text-primary mx-auto opacity-80" />
              <p className="text-foreground font-bold text-base">
                Barcha kutilayotgan buyurtmalar yetkazib berildi!
              </p>
              <p className="text-xs text-muted-foreground">
                Yangi buyurtmalar kelib tushganda avtomatik shu yerda ko'rinadi.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pending.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  expanded={expandedOrderId === order.id}
                  onToggle={() =>
                    setExpandedOrderId(expandedOrderId === order.id ? null : order.id)
                  }
                  onDeliver={(e) => handleMarkDelivered(order.id, e)}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── Delivered Deliveries ── */}
        {done.length > 0 && (
          <section className="space-y-4 pt-4">
            <h2 className="text-lg font-extrabold text-muted-foreground flex items-center gap-2.5">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              Bajarilgan yetkazib berishlar
              <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                {done.length} ta
              </span>
            </h2>
            <div className="space-y-3">
              {done.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  expanded={expandedOrderId === order.id}
                  onToggle={() =>
                    setExpandedOrderId(expandedOrderId === order.id ? null : order.id)
                  }
                  onDeliver={(e) => handleMarkDelivered(order.id, e)}
                  dimmed
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// COOKPAL STYLE ORDER CARD
// ─────────────────────────────────────────────────────────────────────
function OrderCard({
  order,
  expanded,
  onToggle,
  onDeliver,
  dimmed = false,
}: {
  order: SupplierOrder;
  expanded: boolean;
  onToggle: () => void;
  onDeliver: (e: React.MouseEvent) => void;
  dimmed?: boolean;
}) {
  const isDelivered = order.status === "Yetkazib berildi ✅";

  return (
    <div
      onClick={onToggle}
      className={`bg-card border rounded-2xl transition-all duration-200 cursor-pointer overflow-hidden shadow-sm hover:shadow-md ${
        expanded ? "border-primary ring-2 ring-primary/10" : "border-border/80 hover:border-primary/40"
      } ${dimmed ? "opacity-75 bg-muted/20" : ""}`}
    >
      {/* Header Row */}
      <div className="p-4 sm:p-5 flex items-center gap-4 flex-wrap sm:flex-nowrap">
        {/* Image */}
        <img
          src={order.recipeImage}
          alt={order.recipeTitle}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-border shrink-0 shadow-xs"
        />

        {/* Main Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold mb-1">
            <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-[11px] text-foreground">
              {order.id}
            </span>
            <span>·</span>
            <span>{order.createdAt}</span>
          </div>
          <h3 className="font-bold text-base text-foreground truncate">
            {order.recipeTitle}
          </h3>
          <p className="text-xs text-muted-foreground font-medium mt-0.5">
            Soni: <span className="font-bold text-primary">{order.quantity} ta</span> · ${order.unitPrice}/dona
          </p>
        </div>

        {/* Right Info: Price & Status */}
        <div className="flex items-center gap-4 shrink-0 ml-auto">
          <div className="text-right">
            <div className="text-lg sm:text-xl font-black text-primary">
              ${order.totalPrice}
            </div>
            <span
              className={`inline-block text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border mt-0.5 ${
                isDelivered
                  ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                  : "bg-amber-100 text-amber-800 border-amber-200 animate-pulse"
              }`}
            >
              {isDelivered ? "Yetkazib berildi" : "Kutilmoqda"}
            </span>
          </div>

          <div className="text-muted-foreground p-1">
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </div>

      {/* Collapsed Quick Action Bar for Pending */}
      {!expanded && !isDelivered && (
        <div className="bg-muted/40 border-t border-border px-5 py-2.5 flex items-center justify-between gap-4">
          <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-primary" /> Manzilni ko'rish uchun kartochkani bosing
          </span>
          <button
            type="button"
            onClick={onDeliver}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-xs transition-all"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Topshirildi (+$${order.totalPrice})
          </button>
        </div>
      )}

      {/* Expanded Panel */}
      {expanded && (
        <div className="border-t border-border bg-muted/30 p-5 space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Delivery Address */}
            <div className="bg-card border border-primary/20 rounded-xl p-4 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
                <MapPin className="w-4 h-4" /> Yetkazib berish manzili
              </div>
              <p className="text-sm font-bold text-foreground leading-relaxed">
                {order.address}
              </p>
            </div>

            {/* Customer Details */}
            <div className="bg-card border border-amber-200 rounded-xl p-4 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider">
                <Phone className="w-4 h-4" /> Mijoz Ma'lumotlari
              </div>
              <p className="text-sm font-bold text-foreground">
                {order.customerName}
              </p>
              <p className="text-xs font-mono font-semibold text-muted-foreground">
                {order.phone}
              </p>
            </div>

            {/* Payment Details */}
            <div className="bg-card border border-border rounded-xl p-4 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <CreditCard className="w-4 h-4 text-primary" /> To'lov Usuli
              </div>
              <p className="text-sm font-bold text-foreground">
                {order.paymentMethod}
              </p>
              {order.cardNumber && (
                <p className="text-xs font-mono font-semibold text-muted-foreground">
                  {order.cardNumber}
                </p>
              )}
            </div>
          </div>

          {/* Action Button inside Expanded panel */}
          {!isDelivered ? (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={onDeliver}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-extrabold shadow-md transition-all"
              >
                <CheckCircle className="w-5 h-5" />
                Yetkazib berildi deb belgilash (+$${order.totalPrice})
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-end gap-2 text-emerald-600 font-extrabold text-xs pt-1">
              <CheckCircle className="w-4 h-4" />
              Ushbu buyurtma muvaffaqiyatli yetkazib berilgan
            </div>
          )}
        </div>
      )}
    </div>
  );
}
