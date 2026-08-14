import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
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
} from "lucide-react";
import { useStore } from "@/lib/store";
import { filterGroups } from "@/lib/recipes";
import { CartDrawer } from "@/components/CartDrawer";
import { useTheme } from "@/lib/theme";

export function Header() {
  const { user, cart, logout } = useStore();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const searchObj: { q?: string; cusine?: string } = {};
    if (query) searchObj.q = query;
    if (category !== "All Categories") searchObj.cusine = category;
    navigate({
      to: "/explore",
      search: searchObj,
    });
  }

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-ink text-ink-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-[11px] font-bold tracking-widest uppercase">
          <nav className="flex flex-wrap items-center gap-5">
            <Link to="/help" className="opacity-80 transition-opacity hover:opacity-100">
              Community
            </Link>
            <Link
              to="/explore"
              search={{ section: "Bakery" }}
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              Books
            </Link>
            <Link to="/explore" className="opacity-80 transition-opacity hover:opacity-100">
              Receipe Index
            </Link>
            <Link
              to="/explore"
              search={{ sort: "popular" }}
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              Popular
            </Link>
            <Link
              to="/supplier"
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              Suppliers
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
              title={theme === "dark" ? "Light Mode-ga o'tish" : "Dark Mode-ga o'tish"}
            >
              {theme === "dark" ? (
                <>
                  <Sun className="size-3.5 text-amber-300" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="size-3.5 text-sky-200" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-1.5 hover:opacity-80">
                  <UserIcon className="size-3.5" /> {user.username}
                </Link>
                <button onClick={logout} className="flex items-center gap-1.5 hover:opacity-80">
                  <LogOut className="size-3.5" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/auth"
                  search={{ mode: "register" }}
                  className="flex items-center gap-1.5 hover:opacity-80"
                >
                  <UserPlus className="size-3.5" /> Register
                </Link>
                <Link
                  to="/auth"
                  search={{ mode: "login" }}
                  className="flex items-center gap-1.5 hover:opacity-80"
                >
                  <LogIn className="size-3.5" /> Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-3">
          <Link to="/" className="text-3xl font-extrabold tracking-tight">
            Cook<span className="text-primary">pal</span>
          </Link>

          <form onSubmit={submitSearch} className="flex min-w-[280px] flex-1 items-center gap-2">
            <div className="relative flex w-full items-center rounded-full bg-secondary/60 p-1">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-11 cursor-pointer appearance-none rounded-full bg-secondary px-4 pr-8 text-sm font-semibold text-secondary-foreground outline-none"
              >
                <option>All Categories</option>
                {filterGroups.Cusine.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none -ml-7 size-4 text-secondary-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search recipes..."
                aria-label="Search recipes"
                className="ml-4 h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                aria-label="Search"
                className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:scale-105 active:scale-95"
              >
                <Search className="size-5" />
                <span className="hidden sm:inline text-sm font-bold">Search</span>
              </button>
            </div>
          </form>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="relative p-1.5 transition-transform hover:scale-105"
              aria-label="Cart"
            >
              <ShoppingCart className="size-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {cart.length}
                </span>
              )}
            </button>

            <div ref={menuRef} className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex size-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground font-bold uppercase"
                aria-label="Profile menu"
              >
                {user ? user.username.slice(0, 2) : <UserIcon className="size-5" />}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-md border border-border bg-popover shadow-lg">
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
                  >
                    <UserIcon className="size-4" /> Profile
                  </Link>
                  <Link
                    to="/help"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary"
                  >
                    <Lock className="size-4" /> Privacy
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary"
                  >
                    <BookMarked className="size-4" /> Collections
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary"
                  >
                    <Settings className="size-4" /> Settings
                  </Link>
                  {user ? (
                    <button
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-secondary"
                    >
                      <LogOut className="size-4" /> Logout
                    </button>
                  ) : (
                    <Link
                      to="/auth"
                      search={{ mode: "login" }}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary"
                    >
                      <LogIn className="size-4" /> Login
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

