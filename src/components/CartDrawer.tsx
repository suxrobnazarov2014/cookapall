import { useState } from "react";
import { X, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { recipes, type Recipe } from "@/lib/recipes";
import { useStore } from "@/lib/store";
import { CheckoutModal } from "@/components/CheckoutModal";

type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart } = useStore();
  const [selectedRecipeForOrder, setSelectedRecipeForOrder] = useState<Recipe | null>(null);

  if (!isOpen) return null;

  // Filter recipes that are in cart
  const cartRecipes = cart
    .map((id) => recipes.find((r) => r.id === id))
    .filter((r): r is Recipe => Boolean(r));

  const totalCartPrice = cartRecipes.reduce((sum, r) => sum + r.price, 0);

  function handleOrderClick(recipe: Recipe) {
    setSelectedRecipeForOrder(recipe);
  }

  function handleOrderSuccess(recipeId: string) {
    removeFromCart(recipeId);
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
        {/* Click outside to close */}
        <div className="flex-1" onClick={onClose} />

        {/* Side Panel */}
        <div className="relative flex h-full w-full max-w-md flex-col bg-background shadow-2xl animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-muted/40 px-6 py-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="size-5 text-primary" />
              <h3 className="text-lg font-extrabold">Savatcha</h3>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                {cartRecipes.length} ta mahsulot
              </span>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Yopish"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartRecipes.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center text-center">
                <ShoppingBag className="size-16 text-muted-foreground/40" />
                <h4 className="mt-4 text-base font-bold">Savatchangiz bo'sh</h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  Mahsulotlarni qo'shish uchun retseptlarni ko'ring va savatcha tugmasini bosing.
                </p>
              </div>
            ) : (
              cartRecipes.map((recipe, index) => (
                <div
                  key={`${recipe.id}-${index}`}
                  className="flex items-center gap-4 rounded-xl border border-border bg-card p-3 shadow-sm transition-all hover:border-primary/50"
                >
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="size-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="truncate font-bold text-sm">{recipe.title}</h4>
                    <p className="text-xs text-muted-foreground">{recipe.cuisine}</p>
                    <p className="mt-1 font-extrabold text-primary text-sm">$ {recipe.price}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                      onClick={() => handleOrderClick(recipe)}
                      className="rounded-lg bg-primary px-3 py-1.5 text-xs font-extrabold text-primary-foreground shadow transition-all hover:bg-primary/90 active:scale-95"
                    >
                      Buyurtma berish
                    </button>
                    <button
                      onClick={() => removeFromCart(recipe.id)}
                      className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground transition-colors hover:text-destructive"
                      aria-label="O'chirish"
                    >
                      <Trash2 className="size-3" /> O'chirish
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with totals */}
          {cartRecipes.length > 0 && (
            <div className="border-t border-border bg-muted/40 p-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-bold">Jami summa:</span>
                <span className="text-2xl font-black text-primary">$ {totalCartPrice}</span>
              </div>
              <button
                onClick={() => handleOrderClick(cartRecipes[0])}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-extrabold text-primary-foreground shadow transition-all hover:bg-primary/90"
              >
                Buyurtma berish <ArrowRight className="size-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Order Checkout Modal */}
      <CheckoutModal
        recipe={selectedRecipeForOrder}
        isOpen={Boolean(selectedRecipeForOrder)}
        onClose={() => setSelectedRecipeForOrder(null)}
        onSuccess={handleOrderSuccess}
      />
    </>
  );
}
