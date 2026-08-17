import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  LogIn,
  LogOut,
  Search,
  Settings,
  ShoppingCart,
  User as UserIcon,
  UserPlus,
  BookMarked,
  Lock,
  Sun,
  Moon,
  X,
  CheckCheck,
  Clock,
  PlusCircle,
  Check,
  Globe,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { filterGroups, recipes } from "@/lib/recipes";
import { CartDrawer } from "@/components/CartDrawer";
import { useTheme } from "@/lib/theme";
import { useI18n } from "@/lib/i18n-context";
import { LANGS } from "@/lib/i18n";

export function Header() {
  const { user, cart, logout, notifications, markAllNotificationsRead } = useStore();
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useI18n();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [catOpen, setCatOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<typeof recipes>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);

  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const catRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const currentLang = LANGS.find((l) => l.code === lang)!;

  // Close dropdowns on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        setActiveSuggestion(-1);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Autocomplete logic
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const q = query.toLowerCase();
    const filtered = recipes
      .filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.cuisine.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q),
      )
      .slice(0, 6);
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
    setActiveSuggestion(-1);
  }, [query]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    setShowSuggestions(false);
    const searchObj: { q?: string; cusine?: string } = {};
    if (query) searchObj.q = query;
    if (category !== "All Categories") searchObj.cusine = category;
    navigate({ to: "/explore", search: searchObj });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showSuggestions) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestion((v) => Math.min(v + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestion((v) => Math.max(v - 1, -1));
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    } else if (e.key === "Enter" && activeSuggestion >= 0) {
      e.preventDefault();
      const s = suggestions[activeSuggestion];
      navigate({ to: "/recipe/$recipeId", params: { recipeId: s.id } });
      setShowSuggestions(false);
      setQuery("");
    }
  }

  function selectCategory(c: string) {
    setCategory(c);
    setCatOpen(false);
    const searchObj: { q?: string; cusine?: string } = {};
    if (query) searchObj.q = query;
    if (c !== "All Categories") searchObj.cusine = c;
    navigate({ to: "/explore", search: searchObj });
  }

  function selectSuggestion(id: string) {
    setShowSuggestions(false);
    setQuery("");
    navigate({ to: "/recipe/$recipeId", params: { recipeId: id } });
  }

  return (
    <header className="sticky top-0 z-40">
      {/* Top bar */}
      <div className="bg-ink text-ink-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-[11px] font-bold tracking-widest uppercase">
          <nav className="flex flex-wrap items-center gap-5">
            <Link to="/help" className="opacity-80 transition-opacity hover:opacity-100">
              {t("nav_community")}
            </Link>
            <Link
              to="/explore"
              search={{ section: "Bakery" }}
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              {t("nav_books")}
            </Link>
            <Link to="/explore" className="opacity-80 transition-opacity hover:opacity-100">
              {t("nav_recipe_index")}
            </Link>
            <Link
              to="/explore"
              search={{ sort: "popular" }}
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              {t("nav_popular")}
            </Link>
            <Link to="/supplier" className="opacity-80 transition-opacity hover:opacity-100">
              {t("nav_suppliers")}
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangOpen((v) => !v)}
                className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                title={t("language")}
              >
                <Globe className="size-3.5" />
                <span>{currentLang.flag} {currentLang.label}</span>
                <ChevronDown className={`size-3 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`} />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 overflow-hidden rounded-xl border border-white/20 bg-ink/95 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 z-50">
                  {LANGS.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setLangOpen(false); }}
                      className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-xs font-semibold transition-colors ${
                        lang === l.code
                          ? "bg-primary/20 text-primary"
                          : "text-ink-foreground hover:bg-white/10"
                      }`}
                    >
                      <span className="text-base">{l.flag}</span>
                      <span>{l.label}</span>
                      {lang === l.code && <Check className="ml-auto size-3.5 text-primary" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
              title={theme === "dark" ? t("light_mode") : t("dark_mode")}
            >
              {theme === "dark" ? (
                <>
                  <Sun className="size-3.5 text-amber-300" />
                  <span>{t("light_mode")}</span>
                </>
              ) : (
                <>
                  <Moon className="size-3.5 text-sky-200" />
                  <span>{t("dark_mode")}</span>
                </>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-1.5 hover:opacity-80">
                  <UserIcon className="size-3.5" /> {user.username}
                </Link>
                <button onClick={logout} className="flex items-center gap-1.5 hover:opacity-80">
                  <LogOut className="size-3.5" /> {t("logout")}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/auth"
                  search={{ mode: "register" }}
                  className="flex items-center gap-1.5 hover:opacity-80"
                >
                  <UserPlus className="size-3.5" /> {t("register")}
                </Link>
                <Link
                  to="/auth"
                  search={{ mode: "login" }}
                  className="flex items-center gap-1.5 hover:opacity-80"
                >
                  <LogIn className="size-3.5" /> {t("login")}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-3">
          <Link to="/" className="text-3xl font-extrabold tracking-tight">
            Cook<span className="text-primary">pal</span>
          </Link>

          {/* Search with autocomplete & custom dropdown */}
          <div ref={searchRef} className="relative flex min-w-[280px] flex-1 items-center">
            <form onSubmit={submitSearch} className="w-full">
              <div className="relative flex w-full items-center rounded-full bg-secondary/60 p-1 backdrop-blur-sm border border-border/40 transition-all focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20">
                {/* Custom Category Dropdown */}
                <div ref={catRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setCatOpen(!catOpen)}
                    className="flex h-11 items-center gap-2 rounded-full bg-secondary px-4 text-xs sm:text-sm font-bold text-secondary-foreground transition-all hover:bg-secondary/80 focus:outline-none"
                  >
                    <span className="truncate max-w-[110px] sm:max-w-[140px]">
                      {category === "All Categories" ? t("all_categories") : category}
                    </span>
                    <ChevronDown
                      className={`size-4 transition-transform duration-200 ${
                        catOpen ? "rotate-180 text-primary" : "text-muted-foreground"
                      }`}
                    />
                  </button>

                  {catOpen && (
                    <div className="absolute top-full left-0 z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-border bg-popover/95 p-1.5 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95">
                      <button
                        type="button"
                        onClick={() => selectCategory("All Categories")}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                          category === "All Categories"
                            ? "bg-primary/15 text-primary font-bold"
                            : "text-popover-foreground hover:bg-secondary"
                        }`}
                      >
                        <span>{t("all_categories")}</span>
                        {category === "All Categories" && <Check className="size-4 text-primary" />}
                      </button>
                      <div className="my-1 h-px bg-border/60" />
                      {filterGroups.Cusine.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => selectCategory(c)}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                            category === c
                              ? "bg-primary/15 text-primary font-bold"
                              : "text-popover-foreground hover:bg-secondary"
                          }`}
                        >
                          <span>{c}</span>
                          {category === c && <Check className="size-4 text-primary" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => query && suggestions.length > 0 && setShowSuggestions(true)}
                  placeholder={t("search_placeholder")}
                  aria-label={t("search_placeholder")}
                  aria-autocomplete="list"
                  aria-expanded={showSuggestions}
                  className="ml-3 h-11 w-full bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setShowSuggestions(false);
                    }}
                    className="mr-2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={t("close")}
                  >
                    <X className="size-4" />
                  </button>
                )}
                <button
                  type="submit"
                  aria-label={t("search_btn")}
                  className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:scale-105 active:scale-95"
                >
                  <Search className="size-5" />
                  <span className="hidden sm:inline text-sm font-bold">{t("search_btn")}</span>
                </button>
              </div>
            </form>

            {/* Autocomplete dropdown */}
            {showSuggestions && (
              <div
                role="listbox"
                className="absolute top-full left-0 right-0 z-50 mt-1 overflow-hidden rounded-xl border border-border bg-popover shadow-xl"
              >
                {suggestions.map((s, i) => (
                  <button
                    key={s.id}
                    role="option"
                    aria-selected={i === activeSuggestion}
                    onClick={() => selectSuggestion(s.id)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-secondary ${
                      i === activeSuggestion ? "bg-secondary" : ""
                    }`}
                  >
                    <img
                      src={s.image}
                      alt={s.title}
                      className="size-10 shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{s.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{s.cuisine}</p>
                    </div>
                    <span className="ml-auto shrink-0 text-xs font-bold text-price">
                      ${s.price}
                    </span>
                  </button>
                ))}
                <button
                  onClick={submitSearch as unknown as React.MouseEventHandler}
                  className="flex w-full items-center gap-2 border-t border-border px-4 py-2.5 text-sm font-semibold text-primary hover:bg-secondary"
                >
                  <Search className="size-4" />
                  {t("search_see_all")} ("{query}")
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Add recipe button for logged in users */}
            {user && (
              <Link
                to="/add-recipe"
                className="hidden sm:flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-bold transition-colors hover:border-primary hover:text-primary"
                title={t("add_recipe")}
              >
                <PlusCircle className="size-4" />
                <span>{t("add_recipe")}</span>
              </Link>
            )}

            {/* Notifications */}
            <div ref={notifRef} className="relative">
              <button
                id="notifications-btn"
                onClick={() => {
                  setNotifOpen((v) => !v);
                  if (!notifOpen && unreadCount > 0) markAllNotificationsRead();
                }}
                className="relative p-1.5 transition-transform hover:scale-105"
                aria-label={t("notifications")}
              >
                <Bell className="size-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-xl border border-border bg-popover shadow-xl">
                  <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <h3 className="text-sm font-bold">{t("notifications")}</h3>
                    {notifications.length > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                      >
                        <CheckCheck className="size-3.5" /> {t("mark_all_read")}
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                        {t("no_notifications")}
                      </p>
                    ) : (
                      notifications.slice(0, 10).map((n) => (
                        <div
                          key={n.id}
                          className={`flex gap-3 border-b border-border px-4 py-3 transition-colors ${
                            !n.read ? "bg-primary/5" : ""
                          }`}
                        >
                          <span
                            className={`mt-0.5 size-2 shrink-0 rounded-full ${
                              n.type === "success"
                                ? "bg-green-500"
                                : n.type === "warning"
                                  ? "bg-amber-500"
                                  : "bg-primary"
                            }`}
                          />
                          <div className="min-w-0">
                            <p className="text-sm leading-snug">{n.message}</p>
                            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="size-3" />
                              {new Date(n.date).toLocaleString(
                                lang === "ru" ? "ru-RU" : lang === "en" ? "en-US" : "uz-UZ",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                          </div>
                          {!n.read && (
                            <span className="ml-auto size-2 shrink-0 rounded-full bg-primary" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cart */}
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="relative p-1.5 transition-transform hover:scale-105"
              aria-label={t("cart")}
            >
              <ShoppingCart className="size-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {cart.length}
                </span>
              )}
            </button>

            {/* Profile avatar menu */}
            <div ref={menuRef} className="relative">
              <button
                id="profile-menu-btn"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-secondary text-secondary-foreground font-bold uppercase"
                aria-label={t("profile")}
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.username} className="size-full object-cover" />
                ) : user ? (
                  user.username.slice(0, 2)
                ) : (
                  <UserIcon className="size-5" />
                )}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-border bg-popover shadow-xl">
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground"
                  >
                    <UserIcon className="size-4" /> {t("profile")}
                  </Link>
                  {user && (
                    <Link
                      to="/add-recipe"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-secondary"
                    >
                      <PlusCircle className="size-4" /> {t("add_recipe")}
                    </Link>
                  )}
                  <Link
                    to="/help"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-secondary"
                  >
                    <Lock className="size-4" /> {t("privacy")}
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-secondary"
                  >
                    <BookMarked className="size-4" /> {t("collections")}
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-secondary"
                  >
                    <Settings className="size-4" /> {t("settings")}
                  </Link>
                  {user ? (
                    <button
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-sm hover:bg-secondary"
                    >
                      <LogOut className="size-4" /> {t("logout")}
                    </button>
                  ) : (
                    <Link
                      to="/auth"
                      search={{ mode: "login" }}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-secondary"
                    >
                      <LogIn className="size-4" /> {t("login")}
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
    </header>
  );
}
