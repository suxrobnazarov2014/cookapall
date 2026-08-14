import { useState } from "react";
import { X, CreditCard, DollarSign, CheckCircle2, ShoppingBag } from "lucide-react";
import type { Recipe } from "@/lib/recipes";
import { useStore } from "@/lib/store";

type CheckoutModalProps = {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (recipeId: string) => void;
};

const CARD_TYPES = [
  { id: "humo", name: "Humo", color: "from-blue-600 to-indigo-700", prefix: "9860" },
  { id: "uzcard", name: "Uzcard", color: "from-emerald-600 to-teal-700", prefix: "8600" },
  { id: "visa", name: "Visa", color: "from-amber-500 to-orange-600", prefix: "4000" },
  { id: "mastercard", name: "Mastercard", color: "from-rose-600 to-red-700", prefix: "5100" },
];

export function CheckoutModal({ recipe, isOpen, onClose, onSuccess }: CheckoutModalProps) {
  const { addOrder, addNotification } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");
  const [cardType, setCardType] = useState<string>("humo");
  const [cardNumber, setCardNumber] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !recipe) return null;

  const totalPrice = recipe.price * quantity;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (quantity < 1) {
      setError("Buyurtma soni kamida 1 ta bo'lishi kerak.");
      return;
    }

    if (!address.trim()) {
      setError("Iltimos, yetkazib berish manzilini kiriting.");
      return;
    }

    if (!phone.trim()) {
      setError("Iltimos, telefon raqamingizni kiriting.");
      return;
    }

    if (paymentMethod === "card") {
      if (!cardNumber.trim() || cardNumber.trim().length < 8) {
        setError(`Iltimos, ${CARD_TYPES.find((c) => c.id === cardType)?.name} karta raqamini to'liq kiriting.`);
        return;
      }
    }

    const paymentLabel =
      paymentMethod === "card" ? `Karta (${cardType.toUpperCase()})` : "Naqd pul";

    // Save order to global store
    addOrder({
      recipeId: recipe.id,
      recipeTitle: recipe.title,
      recipeImage: recipe.image,
      quantity,
      price: recipe.price,
      totalPrice,
      address: address.trim(),
      paymentMethod: paymentLabel,
    });

    // Send notification to user
    addNotification(
      `✅ "${recipe.title}" buyurtmangiz qabul qilindi! Tez orada yetkaziladi.`,
      "success",
    );

    // Also save to supplier_orders for the courier portal
    try {
      const supplierOrder = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: "Mijoz",
        phone: phone.trim(),
        address: address.trim(),
        recipeId: recipe.id,
        recipeTitle: recipe.title,
        recipeImage: recipe.image,
        quantity,
        unitPrice: recipe.price,
        totalPrice,
        paymentMethod: paymentLabel,
        cardNumber: paymentMethod === "card" ? cardNumber : undefined,
        status: "Kutilmoqda ⏳",
        createdAt: `Bugun, ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
      };
      const raw = localStorage.getItem("cookpal.supplier_orders");
      const existing = raw ? JSON.parse(raw) : [];
      localStorage.setItem("cookpal.supplier_orders", JSON.stringify([supplierOrder, ...existing]));
      window.dispatchEvent(new Event("cookpal_order_created"));
    } catch (e) {
      console.error(e);
    }

    onSuccess(recipe.id);
    onClose();
    // Reset form
    setQuantity(1);
    setAddress("");
    setPhone("");
    setPaymentMethod("cash");
    setCardNumber("");
    setError(null);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border bg-muted/40 px-6 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="size-5 text-primary" />
            <h3 className="text-lg font-extrabold tracking-tight">Buyurtma rasmiylashtirish</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Yopish"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto p-6 space-y-5">
          {/* Recipe Card Preview */}
          <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-3 shadow-sm">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="size-16 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <h4 className="truncate font-bold text-sm">{recipe.title}</h4>
              <p className="text-xs text-muted-foreground">{recipe.cuisine} • {recipe.minutes} daqiqa</p>
              <p className="mt-1 font-extrabold text-primary text-sm">$ {recipe.price} / dona</p>
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Nechta buyurtma qilasiz? (Soni)
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex size-10 items-center justify-center rounded-lg border border-border font-extrabold text-lg transition-all active:scale-95 hover:bg-secondary"
              >
                -
              </button>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="h-10 w-20 rounded-lg border border-input text-center font-extrabold text-base outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="flex size-10 items-center justify-center rounded-lg border border-border font-extrabold text-lg transition-all active:scale-95 hover:bg-secondary"
              >
                +
              </button>
              <div className="ml-auto text-right">
                <span className="text-xs text-muted-foreground block">Jami summa:</span>
                <span className="text-xl font-black text-primary">$ {totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Yetkazib berish manzili *
            </label>
            <input
              type="text"
              required
              placeholder="Masalan: Toshkent sh., Chilonzor t., 15-uy"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="h-11 w-full rounded-xl border border-input px-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Telefon raqami *
            </label>
            <input
              type="tel"
              required
              placeholder="+998 90 123 45 67"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-11 w-full rounded-xl border border-input px-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Payment Method Option */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              To'lov turi *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("cash")}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 font-bold text-sm transition-all ${
                  paymentMethod === "cash"
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border hover:bg-secondary"
                }`}
              >
                <DollarSign className="size-4" /> Naqd pul
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 font-bold text-sm transition-all ${
                  paymentMethod === "card"
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border hover:bg-secondary"
                }`}
              >
                <CreditCard className="size-4" /> Karta orqali
              </button>
            </div>
          </div>

          {/* Card Options when Card is selected */}
          {paymentMethod === "card" && (
            <div className="space-y-4 rounded-xl border border-border bg-muted/30 p-4 animate-in slide-in-from-top-2 duration-200">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Karta turini tanlang
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {CARD_TYPES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCardType(c.id)}
                    className={`flex flex-col items-center justify-center rounded-lg border p-2 text-xs font-extrabold transition-all ${
                      cardType === c.id
                        ? "border-primary bg-primary text-primary-foreground shadow"
                        : "border-border bg-background hover:bg-secondary"
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-[10px] opacity-70">({c.prefix}...)</span>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1">
                  {CARD_TYPES.find((c) => c.id === cardType)?.name} karta raqami *
                </label>
                <input
                  type="text"
                  required
                  placeholder={`${CARD_TYPES.find((c) => c.id === cardType)?.prefix} **** **** ****`}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm font-mono outline-none focus:border-primary"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-xs font-bold text-destructive">
              {error}
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-2">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-base font-extrabold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99]"
            >
              <CheckCircle2 className="size-5" /> Buyurtma berish ($ {totalPrice})
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
