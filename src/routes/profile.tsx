import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RecipeCard } from "@/components/RecipeCard";
import { recipes, type Recipe } from "@/lib/recipes";
import { useStore } from "@/lib/store";
import { CheckoutModal } from "@/components/CheckoutModal";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — Cookpal" },
      {
        name: "description",
        content: "Manage your Cookpal profile, saved recipe collections and cart in one place.",
      },
      { property: "og:title", content: "Your Profile — Cookpal" },
      {
        property: "og:description",
        content: "Manage your Cookpal profile, saved collections and cart.",
      },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { user, favorites, cart, updateProfile, logout, removeFromCart } = useStore();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [saved, setSaved] = useState(false);
  const [selectedRecipeForOrder, setSelectedRecipeForOrder] = useState<Recipe | null>(null);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setBio(user.bio);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <h1 className="script-title text-5xl">Profile</h1>
        <p className="mt-3 text-muted-foreground">
          Profilni ko'rish uchun avval tizimga kiring yoki ro'yxatdan o'ting.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/auth"
            search={{ mode: "login" }}
            className="rounded-md bg-primary px-5 py-2 text-sm font-bold text-primary-foreground"
          >
            Login
          </Link>
          <Link
            to="/auth"
            search={{ mode: "register" }}
            className="rounded-md border border-border px-5 py-2 text-sm font-bold"
          >
            Register
          </Link>
        </div>
      </div>
    );
  }

  const savedRecipes = recipes.filter((r) => favorites.includes(r.id));
  const cartRecipes = cart
    .map((id) => recipes.find((r) => r.id === id))
    .filter((r): r is Recipe => Boolean(r));

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex flex-wrap items-center gap-5">
        <div className="flex size-20 items-center justify-center rounded-full bg-primary text-2xl font-extrabold text-primary-foreground uppercase">
          {user.username.slice(0, 2)}
        </div>
        <div>
          <h1 className="text-3xl font-extrabold">{user.username}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <p className="text-xs text-muted-foreground">
            Joined {new Date(user.joined).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={() => {
            logout();
            navigate({ to: "/" });
          }}
          className="ml-auto rounded-md border border-border px-4 py-2 text-sm font-bold hover:border-primary"
        >
          Logout
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateProfile({ username: username.trim() || user.username, bio });
          setSaved(true);
          window.setTimeout(() => setSaved(false), 2000);
        }}
        className="mt-10 space-y-4 rounded-lg border border-border p-6"
      >
        <h2 className="text-lg font-bold">Settings</h2>
        <label className="block">
          <span className="text-sm font-bold">Username</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 h-11 w-full rounded-md border border-input px-3 text-sm outline-none focus:border-primary"
          />
        </label>
        <label className="block">
          <span className="text-sm font-bold">Bio</span>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-md border border-input p-3 text-sm outline-none focus:border-primary"
          />
        </label>
        <button className="rounded-md bg-primary px-5 py-2 text-sm font-bold text-primary-foreground">
          Save changes
        </button>
        {saved && <span className="ml-3 text-sm font-bold text-primary">Saqlandi ✓</span>}
      </form>

      <section className="mt-12">
        <h2 className="script-title text-4xl">Collections</h2>
        {savedRecipes.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Hali saqlangan retsept yo'q — kartadagi yurakni bosing.
          </p>
        ) : (
          <div className="scroll-shelf mt-5 flex gap-5 overflow-x-auto pb-4 sm:grid sm:grid-cols-3 sm:overflow-visible">
            {savedRecipes.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="script-title text-4xl">Cart</h2>
        {cartRecipes.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">Savat bo'sh.</p>
        ) : (
          <ul className="mt-5 divide-y divide-border rounded-lg border border-border">
            {cartRecipes.map((r, i) => (
              <li key={`${r.id}-${i}`} className="flex flex-wrap items-center gap-4 p-3 sm:flex-nowrap">
                <img
                  src={r.image}
                  alt={r.title}
                  loading="lazy"
                  width={80}
                  height={60}
                  className="size-14 rounded object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold">{r.title}</h4>
                  <p className="text-xs text-muted-foreground">{r.cuisine}</p>
                </div>
                <span className="text-sm font-extrabold text-price">$ {r.price}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedRecipeForOrder(r)}
                    className="rounded-lg bg-primary px-3 py-1.5 text-xs font-extrabold text-primary-foreground shadow transition-all hover:bg-primary/90"
                  >
                    Buyurtma berish
                  </button>
                  <button
                    onClick={() => removeFromCart(r.id)}
                    className="text-xs font-bold text-muted-foreground hover:text-destructive"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <CheckoutModal
        recipe={selectedRecipeForOrder}
        isOpen={Boolean(selectedRecipeForOrder)}
        onClose={() => setSelectedRecipeForOrder(null)}
        onSuccess={(id) => removeFromCart(id)}
      />
    </div>
  );
}

