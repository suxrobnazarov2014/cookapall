import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ChefHat,
  Heart,
  ShoppingCart,
  Settings,
  Plus,
  Trash2,
  Eye,
  Clock,
  Flame,
  Check,
  LogOut,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { RecipeCard } from "@/components/RecipeCard";
import { recipes, type Recipe } from "@/lib/recipes";
import { useStore, type CustomRecipe } from "@/lib/store";
import { CheckoutModal } from "@/components/CheckoutModal";
import { useI18n } from "@/lib/i18n-context";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Mening profilim va ishlarim — Cookpal" },
      {
        name: "description",
        content: "Cookpal profilini boshqarish, o'zingiz qo'shgan taomlar, saqlangan to'plamlar va buyurtmalar.",
      },
      { property: "og:title", content: "Mening profilim — Cookpal" },
      {
        property: "og:description",
        content: "Cookpal profilingiz va siz qo'shgan barcha taomlar.",
      },
    ],
  }),
  component: Profile,
});

type TabKey = "works" | "collections" | "cart" | "settings";

function Profile() {
  const {
    user,
    favorites,
    cart,
    customRecipes,
    deleteCustomRecipe,
    updateProfile,
    logout,
    removeFromCart,
    addNotification,
  } = useStore();
  const { t } = useI18n();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabKey>("works");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [saved, setSaved] = useState(false);
  const [selectedRecipeForOrder, setSelectedRecipeForOrder] = useState<Recipe | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setBio(user.bio);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
          <ChefHat className="size-8" />
        </div>
        <h1 className="script-title text-5xl">Mening profilim</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          O'zingiz yaratgan taomlar va saqlangan retseptlarni ko'rish uchun profilingizga kiring.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/auth"
            search={{ mode: "login" }}
            className="rounded-xl bg-primary px-6 py-2.5 text-sm font-extrabold text-primary-foreground shadow transition-all hover:bg-primary/90"
          >
            {t("login")}
          </Link>
          <Link
            to="/auth"
            search={{ mode: "register" }}
            className="rounded-xl border border-border px-6 py-2.5 text-sm font-extrabold hover:border-primary transition-colors"
          >
            {t("register")}
          </Link>
        </div>
      </div>
    );
  }

  // Filter custom recipes authored by this user
  const myWorks = customRecipes.filter(
    (r) => r.authorEmail === user.email || r.authorEmail === "anonymous" || !r.authorEmail
  );

  const savedRecipes = recipes.filter((r) => favorites.includes(r.id));
  const cartRecipes = cart
    .map((id) => recipes.find((r) => r.id === id) || (customRecipes.find((r) => r.id === id) as Recipe | undefined))
    .filter((r): r is Recipe => Boolean(r));

  function handleDeleteRecipe(id: string, title: string) {
    deleteCustomRecipe(id);
    setDeletingId(null);
    addNotification(`"${title}" retsepti o'chirildi.`, "info");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      {/* Profile Header Card */}
      <div className="rounded-3xl border border-border bg-gradient-to-r from-card via-card to-primary/5 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="flex size-20 sm:size-24 shrink-0 items-center justify-center rounded-3xl bg-primary text-3xl font-black text-primary-foreground shadow-lg uppercase ring-4 ring-primary/20">
              {user.username.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {user.username}
                </h1>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-extrabold text-primary">
                  Oshpaz
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{user.email}</p>
              {user.bio && (
                <p className="text-xs text-muted-foreground mt-2 max-w-md italic">
                  "{user.bio}"
                </p>
              )}
              <p className="text-[11px] text-muted-foreground mt-2 font-medium">
                A'zo bo'lgan sana: {new Date(user.joined).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
            <Link
              to="/add-recipe"
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-extrabold text-primary-foreground shadow transition-all hover:bg-primary/90 hover:scale-105"
            >
              <Plus className="size-4" />
              <span>{t("add_recipe")}</span>
            </Link>
            <button
              onClick={() => {
                logout();
                navigate({ to: "/" });
              }}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-bold text-muted-foreground hover:border-destructive hover:text-destructive transition-colors"
            >
              <LogOut className="size-4" />
              <span>{t("logout")}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-8 flex flex-wrap gap-2 border-t border-border pt-6">
          <button
            onClick={() => setActiveTab("works")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === "works"
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <ChefHat className="size-4" />
            <span>Mening ishlarim</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                activeTab === "works" ? "bg-black/20 text-white" : "bg-primary/15 text-primary"
              }`}
            >
              {myWorks.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("collections")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === "collections"
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Heart className="size-4" />
            <span>Saqlanganlar</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                activeTab === "collections"
                  ? "bg-black/20 text-white"
                  : "bg-secondary-foreground/15 text-secondary-foreground"
              }`}
            >
              {savedRecipes.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("cart")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === "cart"
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <ShoppingCart className="size-4" />
            <span>Savatcha</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                activeTab === "cart"
                  ? "bg-black/20 text-white"
                  : "bg-secondary-foreground/15 text-secondary-foreground"
              }`}
            >
              {cartRecipes.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === "settings"
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Settings className="size-4" />
            <span>{t("settings")}</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MENING ISHLARIM (MY WORKS) */}
      {activeTab === "works" && (
        <section className="mt-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="script-title text-3xl text-primary block">
                Mualliflik retseptlari
              </span>
              <h2 className="text-2xl font-extrabold tracking-tight">Mening ishlarim</h2>
            </div>

            <Link
              to="/add-recipe"
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-extrabold text-primary-foreground shadow hover:bg-primary/90 transition-all"
            >
              <Plus className="size-4" />
              <span>Yangi retsept qo'shish</span>
            </Link>
          </div>

          {myWorks.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-border bg-card p-12 text-center space-y-4">
              <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ChefHat className="size-8" />
              </div>
              <h3 className="text-xl font-bold">Siz hali birorta ham taom qo'shmadingiz</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                O'z retseptlaringiz, masalliqlar va tayyorlash sirlarini Cookpal jamoasi bilan
                ulashing.
              </p>
              <Link
                to="/add-recipe"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:scale-105"
              >
                <Plus className="size-5" />
                <span>Birinchi retseptingizni qo'shing</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {myWorks.map((recipe) => (
                <article
                  key={recipe.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="script-title absolute right-3 bottom-1 text-3xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                      {recipe.cuisine}
                    </span>
                    <span className="absolute top-2.5 left-2.5 rounded-lg bg-primary px-2.5 py-0.5 text-[10px] font-black text-primary-foreground uppercase shadow">
                      Mening ishim
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to="/recipe/$recipeId"
                          params={{ recipeId: recipe.id }}
                          className="text-base font-extrabold leading-snug hover:text-primary transition-colors"
                        >
                          {recipe.title}
                        </Link>
                        <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-black text-primary">
                          $ {recipe.price}
                        </span>
                      </div>

                      <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {recipe.description}
                      </p>

                      <div className="mt-3 flex items-center justify-between border-y border-border py-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 font-semibold">
                          <Clock className="size-3.5 text-primary" /> {recipe.minutes} daqiqa
                        </span>
                        {recipe.nutrition?.[0] && (
                          <span className="flex items-center gap-1 font-semibold">
                            <Flame className="size-3.5 text-orange-500" />{" "}
                            {recipe.nutrition[0].value}
                          </span>
                        )}
                        <span className="font-bold text-foreground">{recipe.difficulty}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-1">
                      <Link
                        to="/recipe/$recipeId"
                        params={{ recipeId: recipe.id }}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-secondary px-3 py-2 text-xs font-bold text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Eye className="size-3.5" />
                        <span>Ko'rish</span>
                      </Link>
                      <button
                        onClick={() => setDeletingId(recipe.id)}
                        className="flex items-center justify-center size-9 rounded-xl border border-border text-muted-foreground hover:border-destructive hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
                        title="Retseptni o'chirish"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>

                  {/* Delete Confirmation Modal */}
                  {deletingId === recipe.id && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
                      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
                        <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mx-auto">
                          <Trash2 className="size-6" />
                        </div>
                        <div className="text-center">
                          <h3 className="text-base font-extrabold">
                            Retseptni o'chirmoqchimisiz?
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            "{recipe.title}" retsepti profilingizdan butunlay o'chiriladi.
                          </p>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => setDeletingId(null)}
                            className="flex-1 rounded-xl border border-border py-2.5 text-xs font-bold hover:bg-secondary transition-colors cursor-pointer"
                          >
                            Bekor qilish
                          </button>
                          <button
                            onClick={() => handleDeleteRecipe(recipe.id, recipe.title)}
                            className="flex-1 rounded-xl bg-destructive py-2.5 text-xs font-extrabold text-destructive-foreground shadow hover:bg-destructive/90 transition-colors cursor-pointer"
                          >
                            O'chirish
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {/* TAB 2: SAQLANGANLAR (COLLECTIONS) */}
      {activeTab === "collections" && (
        <section className="mt-10 space-y-6">
          <div>
            <span className="script-title text-3xl text-primary block">Sevimli to'plamlar</span>
            <h2 className="text-2xl font-extrabold tracking-tight">Saqlangan retseptlar</h2>
          </div>

          {savedRecipes.length === 0 ? (
            <div className="rounded-3xl border border-border bg-card p-12 text-center space-y-3">
              <Heart className="size-10 text-muted-foreground/50 mx-auto" />
              <p className="text-sm text-muted-foreground">
                Hali saqlangan retsept yo'q — taom kartasidagi yurak belgisini bosing.
              </p>
              <Link
                to="/explore"
                className="inline-block rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground mt-2"
              >
                Retseptlarni ko'rish
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {savedRecipes.map((r) => (
                <RecipeCard key={r.id} recipe={r} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* TAB 3: SAVAT (CART) */}
      {activeTab === "cart" && (
        <section className="mt-10 space-y-6">
          <div>
            <span className="script-title text-3xl text-primary block">Buyurtmalar savatchasi</span>
            <h2 className="text-2xl font-extrabold tracking-tight">Savatchadagi taomlar</h2>
          </div>

          {cartRecipes.length === 0 ? (
            <div className="rounded-3xl border border-border bg-card p-12 text-center space-y-3">
              <ShoppingCart className="size-10 text-muted-foreground/50 mx-auto" />
              <p className="text-sm text-muted-foreground">Savatchangiz hozircha bo'sh.</p>
              <Link
                to="/explore"
                className="inline-block rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground mt-2"
              >
                Retsept tanlash
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-border rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
              {cartRecipes.map((r, i) => (
                <li
                  key={`${r.id}-${i}`}
                  className="flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap hover:bg-secondary/20 transition-colors"
                >
                  <img
                    src={r.image}
                    alt={r.title}
                    loading="lazy"
                    width={80}
                    height={60}
                    className="size-16 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold">{r.title}</h4>
                    <p className="text-xs text-muted-foreground">{r.cuisine} oshxonasi</p>
                  </div>
                  <span className="text-base font-extrabold text-price">$ {r.price}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedRecipeForOrder(r)}
                      className="rounded-xl bg-primary px-4 py-2 text-xs font-extrabold text-primary-foreground shadow transition-all hover:bg-primary/90"
                    >
                      Buyurtma berish
                    </button>
                    <button
                      onClick={() => removeFromCart(r.id)}
                      className="rounded-xl border border-border p-2 text-xs font-bold text-muted-foreground hover:border-destructive hover:text-destructive transition-colors"
                      title="O'chirish"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* TAB 4: SOZLAMALAR (SETTINGS) */}
      {activeTab === "settings" && (
        <section className="mt-10 space-y-6">
          <div>
            <span className="script-title text-3xl text-primary block">Shaxsiy sozlamalar</span>
            <h2 className="text-2xl font-extrabold tracking-tight">Profil ma'lumotlari</h2>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateProfile({ username: username.trim() || user.username, bio });
              setSaved(true);
              addNotification("Profil ma'lumotlari muvaffaqiyatli saqlandi!", "success");
              window.setTimeout(() => setSaved(false), 2000);
            }}
            className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm max-w-xl"
          >
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Foydalanuvchi nomi
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-11 w-full rounded-xl border border-input bg-background px-4 text-sm font-semibold outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                O'zingiz haqingizda (Bio)
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-input bg-background p-3 text-sm font-medium outline-none focus:border-primary"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-extrabold text-primary-foreground shadow hover:bg-primary/90 transition-all cursor-pointer">
                <Check className="size-4" />
                <span>O'zgarishlarni saqlash</span>
              </button>
              {saved && (
                <span className="text-xs font-bold text-primary animate-in fade-in">
                  Saqlandi ✓
                </span>
              )}
            </div>
          </form>
        </section>
      )}

      {/* Checkout Modal */}
      <CheckoutModal
        recipe={selectedRecipeForOrder}
        isOpen={Boolean(selectedRecipeForOrder)}
        onClose={() => setSelectedRecipeForOrder(null)}
        onSuccess={(id) => removeFromCart(id)}
      />
    </div>
  );
}
