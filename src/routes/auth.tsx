import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { RecipeCard } from "@/components/RecipeCard";
import { recipes } from "@/lib/recipes";
import { useI18n } from "@/lib/i18n-context";

type AuthSearch = { mode: "login" | "register" };

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): AuthSearch => ({
    mode: search["mode"] === "register" ? "register" : "login",
  }),

  head: () => ({
    meta: [
      { title: "Login or Register — Cookpal" },
      {
        name: "description",
        content: "Create a Cookpal account or sign in to keep your saved recipes and profile.",
      },
      { property: "og:title", content: "Login or Register — Cookpal" },
      {
        property: "og:description",
        content: "Create a Cookpal account or sign in to keep your saved recipes and profile.",
      },
    ],
  }),
  component: AuthPage,
});

import { useStore } from "@/lib/store";

function AuthPage() {
  const { mode } = Route.useSearch();
  const { login, register } = useStore();
  const { t } = useI18n();
  const navigate = useNavigate();
  const isRegister = mode === "register";
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const err = isRegister
      ? register({ username: form.username.trim(), email: form.email.trim(), password: form.password })
      : login({ email: form.email.trim(), password: form.password });
    if (err) {
      setError(err);
      return;
    }
    navigate({ to: "/profile" });
  }

  const featuredRecipes = recipes.filter((r) => r.rating === 5).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
        {/* Forma qismi */}
        <div className="w-full max-w-md shrink-0">
          <h1 className="script-title text-5xl">{isRegister ? t("register") : t("login")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("auth_subtitle")}</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            {isRegister && (
              <label className="block">
                <span className="text-sm font-bold">{t("username")}</span>
                <input
                  required
                  value={form.username}
                  onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                  className="mt-1 h-11 w-full rounded-md border border-input px-3 text-sm outline-none focus:border-primary"
                />
              </label>
            )}
            <label className="block">
              <span className="text-sm font-bold">{t("email")}</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="mt-1 h-11 w-full rounded-md border border-input px-3 text-sm outline-none focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold">{t("password")}</span>
              <input
                required
                minLength={4}
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="mt-1 h-11 w-full rounded-md border border-input px-3 text-sm outline-none focus:border-primary"
              />
            </label>

            {error && <p className="text-sm font-semibold text-destructive">{error}</p>}

            <button
              type="submit"
              className="h-11 w-full rounded-md bg-primary text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
            >
              {isRegister ? t("create_account") : t("sign_in")}
            </button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground">
            {isRegister ? t("have_account") : t("no_account")}{" "}
            <Link
              to="/auth"
              search={{ mode: isRegister ? "login" : "register" }}
              className="font-bold text-primary hover:underline"
            >
              {isRegister ? t("login") : t("register")}
            </Link>
          </p>
        </div>

        {/* O'ng tomon — Featured kartalar */}
        <div className="flex-1">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="script-title text-3xl">{t("featured_recipes")}</h2>
            <Link
              to="/explore"
              className="text-xs font-bold text-primary hover:underline"
            >
              {t("see_all")} &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredRecipes.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
