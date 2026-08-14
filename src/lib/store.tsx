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
  avatar?: string; // base64
};

export type Review = {
  id: string;
  recipeId: string;
  username: string;
  rating: number; // 1-5
  text: string;
  date: string;
};

export type Order = {
  id: string;
  recipeId: string;
  recipeTitle: string;
  recipeImage: string;
  quantity: number;
  price: number;
  totalPrice: number;
  status: "Kutilmoqda" | "Tayyorlanmoqda" | "Yetkazildi";
  date: string;
  address: string;
  paymentMethod: string;
};

export type CustomRecipe = {
  id: string;
  title: string;
  description: string;
  image: string;
  cuisine: string;
  section: "Cusines" | "Diet" | "Bakery";
  ingredients: string[];
  steps: string[];
  price: number;
  minutes: number;
  authorEmail: string;
  createdAt: string;
};

export type Notification = {
  id: string;
  message: string;
  type: "success" | "info" | "warning";
  read: boolean;
  date: string;
};

type StoreValue = {
  user: User | null;
  users: User[];
  favorites: string[];
  cart: string[];
  reviews: Review[];
  orders: Order[];
  customRecipes: CustomRecipe[];
  notifications: Notification[];
  register: (input: { username: string; email: string; password: string }) => string | null;
  login: (input: { email: string; password: string }) => string | null;
  logout: () => void;
  updateProfile: (patch: Partial<Pick<User, "username" | "bio" | "avatar">>) => void;
  toggleFavorite: (id: string) => void;
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  addReview: (review: Omit<Review, "id" | "date">) => void;
  addOrder: (order: Omit<Order, "id" | "date" | "status">) => void;
  addCustomRecipe: (recipe: Omit<CustomRecipe, "id" | "createdAt" | "authorEmail">) => void;
  deleteCustomRecipe: (id: string) => void;
  addNotification: (message: string, type?: Notification["type"]) => void;
  markAllNotificationsRead: () => void;
};

const USERS_KEY = "cookpal.users";
const SESSION_KEY = "cookpal.session";
const FAV_KEY = "cookpal.favorites";
const CART_KEY = "cookpal.cart";
const REVIEWS_KEY = "cookpal.reviews";
const ORDERS_KEY = "cookpal.orders";
const CUSTOM_RECIPES_KEY = "cookpal.custom_recipes";
const NOTIFICATIONS_KEY = "cookpal.notifications";

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

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [email, setEmail] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<string[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customRecipes, setCustomRecipes] = useState<CustomRecipe[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Hydrate from localStorage after mount to keep SSR output stable.
  useEffect(() => {
    setUsers(read<User[]>(USERS_KEY, []));
    setEmail(read<string | null>(SESSION_KEY, null));
    setFavorites(read<string[]>(FAV_KEY, []));
    setCart(read<string[]>(CART_KEY, []));
    setReviews(read<Review[]>(REVIEWS_KEY, []));
    setOrders(read<Order[]>(ORDERS_KEY, []));
    setCustomRecipes(read<CustomRecipe[]>(CUSTOM_RECIPES_KEY, []));
    setNotifications(read<Notification[]>(NOTIFICATIONS_KEY, []));
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

  const addReview = useCallback((review: Omit<Review, "id" | "date">) => {
    setReviews((prev) => {
      const newReview: Review = {
        ...review,
        id: uid(),
        date: new Date().toISOString(),
      };
      const next = [...prev, newReview];
      write(REVIEWS_KEY, next);
      return next;
    });
  }, []);

  const addOrder = useCallback((order: Omit<Order, "id" | "date" | "status">) => {
    setOrders((prev) => {
      const newOrder: Order = {
        ...order,
        id: uid(),
        date: new Date().toISOString(),
        status: "Kutilmoqda",
      };
      const next = [newOrder, ...prev];
      write(ORDERS_KEY, next);
      return next;
    });
  }, []);

  const addCustomRecipe = useCallback(
    (recipe: Omit<CustomRecipe, "id" | "createdAt" | "authorEmail">) => {
      setCustomRecipes((prev) => {
        const newRecipe: CustomRecipe = {
          ...recipe,
          id: `custom-${uid()}`,
          createdAt: new Date().toISOString(),
          authorEmail: email ?? "anonymous",
        };
        const next = [newRecipe, ...prev];
        write(CUSTOM_RECIPES_KEY, next);
        return next;
      });
    },
    [email],
  );

  const deleteCustomRecipe = useCallback((id: string) => {
    setCustomRecipes((prev) => {
      const next = prev.filter((r) => r.id !== id);
      write(CUSTOM_RECIPES_KEY, next);
      return next;
    });
  }, []);

  const addNotification = useCallback(
    (message: string, type: Notification["type"] = "info") => {
      setNotifications((prev) => {
        const newNotif: Notification = {
          id: uid(),
          message,
          type,
          read: false,
          date: new Date().toISOString(),
        };
        const next = [newNotif, ...prev].slice(0, 20); // max 20
        write(NOTIFICATIONS_KEY, next);
        return next;
      });
    },
    [],
  );

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }));
      write(NOTIFICATIONS_KEY, next);
      return next;
    });
  }, []);

  const value: StoreValue = {
    user,
    users,
    favorites,
    cart,
    reviews,
    orders,
    customRecipes,
    notifications,
    register,
    login,
    logout,
    updateProfile,
    toggleFavorite,
    addToCart,
    removeFromCart,
    addReview,
    addOrder,
    addCustomRecipe,
    deleteCustomRecipe,
    addNotification,
    markAllNotificationsRead,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
