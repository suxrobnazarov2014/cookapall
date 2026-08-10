import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

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

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="script-title text-5xl">{isRegister ? "Register" : "Login"}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Ma'lumotlar shu brauzerda saqlanadi, keyingi kirishda profilingiz joyida qoladi.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        {isRegister && (
          <label className="block">
            <span className="text-sm font-bold">Username</span>
            <input
              required
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
              className="mt-1 h-11 w-full rounded-md border border-input px-3 text-sm outline-none focus:border-primary"
            />
          </label>
        )}
        <label className="block">
          <span className="text-sm font-bold">Email</span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="mt-1 h-11 w-full rounded-md border border-input px-3 text-sm outline-none focus:border-primary"
          />
        </label>
        <label className="block">
          <span className="text-sm font-bold">Password</span>
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
          {isRegister ? "Create account" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted-foreground">
        {isRegister ? "Akkauntingiz bormi? " : "Akkauntingiz yo'qmi? "}
        <Link
          to="/auth"
          search={{ mode: isRegister ? "login" : "register" }}
          className="font-bold text-primary hover:underline"
        >
          {isRegister ? "Login" : "Register"}
        </Link>
      </p>
    </div>
  );
}
