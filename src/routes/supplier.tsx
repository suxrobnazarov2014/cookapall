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
} from "lucide-react";

export const Route = createFileRoute("/supplier")({
  head: () => ({
    meta: [
      { title: "Yetkazib Beruvchilar va Ta'minotchilar Paneli — Cookpal" },
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

// Initial default seed orders if local storage is empty
const defaultSeedOrders: SupplierOrder[] = [
  {
    id: "ORD-101",
    customerName: "Alisher Navoiy",
    phone: "+998 90 123 45 67",
    address: "Toshkent sh., Chilonzor t., 15-uy, 24-xonadon",
    recipeId: "italian-margherita-pizza",
    recipeTitle: "Classic Italian Margherita Pizza",
    recipeImage: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80",
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
    recipeImage: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80",
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
    recipeImage: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    quantity: 3,
    unitPrice: 160,
    totalPrice: 480,
    paymentMethod: "Karta (UZCARD)",
    cardNumber: "8600 **** **** 9012",
    status: "Yetkazib berildi ✅",
    createdAt: "Bugun, 12:20",
  },
];

const STORAGE_KEY = "cookpal.supplier_orders";

export function SupplierPortal() {
  const [orders, setOrders] = useState<SupplierOrder[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Load orders from localStorage
  function loadOrders() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SupplierOrder[];
        setOrders(parsed);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSeedOrders));
        setOrders(defaultSeedOrders);
      }
    } catch {
      setOrders(defaultSeedOrders);
    }
  }

  useEffect(() => {
    loadOrders();
    const handleStorage = () => loadOrders();
    window.addEventListener("cookpal_order_created", handleStorage);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("cookpal_order_created", handleStorage);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  function saveOrders(nextOrders: SupplierOrder[]) {
    setOrders(nextOrders);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextOrders));
    } catch (e) {
      console.error(e);
    }
  }

  // Calculate statistics purely from real orders array (no fake static numbers!)
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((o) => o.status === "Yetkazib berildi ✅");
  const deliveredCount = deliveredOrders.length;
  const remainingCount = totalOrders - deliveredCount;
  const totalRevenue = deliveredOrders.reduce((sum, o) => sum + o.totalPrice, 0);

  // Handle Mark as Delivered
  function handleMarkAsDelivered(orderId: string, e: React.MouseEvent) {
    e.stopPropagation(); // prevent accordion toggle when clicking button
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, status: "Yetkazib berildi ✅" as const } : o
    );
    saveOrders(updated);
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-20">
      {/* Top Supplier Navigation Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 sticky top-0 z-30 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black shadow-lg">
              <Truck className="size-6" />
            </span>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">Yetkazib Beruvchilar Paneli</h1>
              <p className="text-xs text-slate-400">Tushgan buyurtmalar va yetkazib berish nazorati</p>
            </div>
          </div>

          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-bold text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
          >
            <ArrowLeft className="size-4" /> Asosiy saytga o'tish
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-6xl px-6 py-8 space-y-8">
        {/* Dynamic Computed Statistics Bar */}
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
              <Clock className="size-4 text-amber-400" /> Qolgan Buyurtmalar
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

        {/* Incoming Orders Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-xl font-extrabold tracking-tight">Tushgan Mahsulotlar & Buyurtmalar</h2>
            <span className="text-xs text-slate-400 font-bold">
              Bosing: Manzilni ko'rish uchun kartani ustiga bosing
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center text-slate-500">
              Hali buyurtmalar kelmadi. Asosiy saytdan buyurtma berilganda bu yerda ko'rinadi.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const isExpanded = expandedOrderId === order.id;
                const isDelivered = order.status === "Yetkazib berildi ✅";

                return (
                  <div
                    key={order.id}
                    onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                    className={`cursor-pointer rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isDelivered
                        ? "border-slate-800/80 bg-slate-950/40 opacity-85"
                        : "border-slate-700 bg-slate-950/90 shadow-md hover:border-primary"
                    }`}
                  >
                    {/* Main Order Card Header */}
                    <div className="p-5 flex flex-wrap items-center gap-4 sm:flex-nowrap">
                      {/* Product Thumbnail */}
                      <img
                        src={order.recipeImage}
                        alt={order.recipeTitle}
                        className="size-16 rounded-xl object-cover shrink-0 border border-slate-800"
                      />

                      {/* Title & Quantity Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-400">{order.id}</span>
                          <span className="text-[11px] text-slate-500">{order.createdAt}</span>
                        </div>
                        <h3 className="font-extrabold text-base text-white truncate">{order.recipeTitle}</h3>
                        <p className="text-xs font-bold text-slate-400 mt-0.5">
                          Kelgan mahsulot miqdori:{" "}
                          <span className="text-primary font-black text-sm">{order.quantity} ta</span> ($ {order.unitPrice} / dona)
                        </p>
                      </div>

                      {/* Price & Status */}
                      <div className="flex flex-col items-end gap-1.5 shrink-0 ml-auto sm:ml-0">
                        <span className="text-lg font-black text-primary">$ {order.totalPrice}</span>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                            isDelivered
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      {/* Expand Arrow Indicator */}
                      <div className="text-slate-400 pl-2">
                        {isExpanded ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
                      </div>
                    </div>

                    {/* Expandable Address & Customer Details */}
                    {isExpanded && (
                      <div className="border-t border-slate-800 bg-slate-900/60 p-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
                        <div className="grid gap-4 sm:grid-cols-3">
                          {/* Delivery Address */}
                          <div className="space-y-1 rounded-xl bg-slate-950/80 p-3.5 border border-slate-800">
                            <span className="flex items-center gap-1.5 text-xs font-extrabold uppercase text-primary">
                              <MapPin className="size-4" /> Yetkazib berish manzili
                            </span>
                            <p className="text-sm font-bold text-white pt-1">{order.address}</p>
                          </div>

                          {/* Customer & Phone */}
                          <div className="space-y-1 rounded-xl bg-slate-950/80 p-3.5 border border-slate-800">
                            <span className="flex items-center gap-1.5 text-xs font-extrabold uppercase text-primary">
                              <Phone className="size-4" /> Buyurtmachi & Aloqa
                            </span>
                            <p className="text-sm font-bold text-white pt-1">{order.customerName}</p>
                            <p className="text-xs text-slate-400 font-mono">{order.phone}</p>
                          </div>

                          {/* Payment Details */}
                          <div className="space-y-1 rounded-xl bg-slate-950/80 p-3.5 border border-slate-800">
                            <span className="flex items-center gap-1.5 text-xs font-extrabold uppercase text-primary">
                              <CreditCard className="size-4" /> To'lov Turi
                            </span>
                            <p className="text-sm font-bold text-white pt-1">{order.paymentMethod}</p>
                            {order.cardNumber && (
                              <p className="text-xs text-slate-400 font-mono">Karta: {order.cardNumber}</p>
                            )}
                          </div>
                        </div>

                        {/* Deliver Button */}
                        {!isDelivered ? (
                          <div className="pt-2 flex justify-end">
                            <button
                              type="button"
                              onClick={(e) => handleMarkAsDelivered(order.id, e)}
                              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-extrabold text-white shadow-lg transition-all hover:bg-emerald-500 hover:scale-105 active:scale-95"
                            >
                              <CheckCircle className="size-5" /> Yetkazib berildi ($ {order.totalPrice} daromadga qo'shilsin)
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end text-xs font-bold text-emerald-400 gap-1.5">
                            <CheckCircle className="size-4" /> Ushbu buyurtma yetkazib berilgan va $ {order.totalPrice} daromadga o'tgan.
                          </div>
                        )}
                      </div>
                    )}

                    {/* Quick Deliver Action Button at card bottom if collapsed and not delivered */}
                    {!isExpanded && !isDelivered && (
                      <div className="border-t border-slate-800 bg-slate-900/40 px-5 py-3 flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-bold">
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
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
