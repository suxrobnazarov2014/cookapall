import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type User = {
  username: string;
  email: string;
  password: string;
  bio: string;
  joined: string;
};

type StoreValue = {
  user: User | null;
  users: User[];
  favorites: string[];
  cart: string[];
  register: (input: { username: string; email: string; password: string }) => string | null;
  login: (input: { email: string; password: string }) => string | null;
  logout: () => void;
  updateProfile: (patch: Partial<Pick<User, "username" | "bio">>) => void;
  toggleFavorite: (id: string) => void;
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
};

const USERS_KEY = "cookpal.users";
const SESSION_KEY = "cookpal.session";
const FAV_KEY = "cookpal.favorites";
const CART_KEY = "cookpal.cart";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [email, setEmail] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<string[]>([]);

  // Hydrate from localStorage after mount to keep SSR output stable.
  useEffect(() => {
    setUsers(read<User[]>(USERS_KEY, []));
    setEmail(read<string | null>(SESSION_KEY, null));
    setFavorites(read<string[]>(FAV_KEY, []));
    setCart(read<string[]>(CART_KEY, []));
  }, []);

  const user = useMemo(
    () => users.find((u) => u.email === email) ?? null,
    [users, email],
  );

  const register: StoreValue["register"] = useCallback(
    ({ username, email: mail, password }) => {
      const existing = read<User[]>(USERS_KEY, []);
      if (existing.some((u) => u.email.toLowerCase() === mail.toLowerCase())) {
        return "Bu email allaqachon ro'yxatdan o'tgan.";
      }
      const next: User[] = [
        ...existing,
        {
          username,
          email: mail,
          password,
          bio: "Cookpal jamoasiga yangi qo'shilgan oshpaz.",
          joined: new Date().toISOString(),
        },
      ];
      write(USERS_KEY, next);
      write(SESSION_KEY, mail);
      setUsers(next);
      setEmail(mail);
      return null;
    },
    [],
  );

  const login: StoreValue["login"] = useCallback(({ email: mail, password }) => {
    const existing = read<User[]>(USERS_KEY, []);
    const found = existing.find(
      (u) => u.email.toLowerCase() === mail.toLowerCase() && u.password === password,
    );
    if (!found) return "Email yoki parol xato.";
    write(SESSION_KEY, found.email);
    setUsers(existing);
    setEmail(found.email);
    return null;
  }, []);

  const logout = useCallback(() => {
    write(SESSION_KEY, null);
    setEmail(null);
  }, []);

  const updateProfile: StoreValue["updateProfile"] = useCallback(
    (patch) => {
      setUsers((prev) => {
        const next = prev.map((u) => (u.email === email ? { ...u, ...patch } : u));
        write(USERS_KEY, next);
        return next;
      });
    },
    [email],
  );

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      write(FAV_KEY, next);
      return next;
    });
  }, []);

  const addToCart = useCallback((id: string) => {
    setCart((prev) => {
      const next = [...prev, id];
      write(CART_KEY, next);
      return next;
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => {
      const idx = prev.indexOf(id);
      if (idx < 0) return prev;
      const next = [...prev.slice(0, idx), ...prev.slice(idx + 1)];
      write(CART_KEY, next);
      return next;
    });
  }, []);

  const value: StoreValue = {
    user,
    users,
    favorites,
    cart,
    register,
    login,
    logout,
    updateProfile,
    toggleFavorite,
    addToCart,
    removeFromCart,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
