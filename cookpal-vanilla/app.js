/* =========================================================
   CookPal — Vanilla JavaScript SPA
   Hash-based routing, localStorage store, all pages
   ========================================================= */

// ─── SVG Icons ──────────────────────────────────────────────────────────────
const ICONS = {
  search: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
  shoppingCart: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`,
  shoppingBag: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
  user: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>`,
  userPlus: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>`,
  logIn: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>`,
  logOut: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>`,
  settings: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`,
  bookMarked: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/><line x1="17" x2="7" y1="8" y2="8"/><line x1="12" x2="7" y1="13" y2="13"/></svg>`,
  lock: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  heart: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
  heartFill: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
  clock: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  messageCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>`,
  thumbsUp: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg>`,
  star: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  starFill: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  check: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  checkCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  checkCircle2: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`,
  x: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
  trash2: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
  arrowRight: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
  arrowLeft: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>`,
  tag: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>`,
  hash: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/></svg>`,
  listFilter: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M7 12h10"/><path d="M10 18h4"/></svg>`,
  helpCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>`,
  truck: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>`,
  package: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,
  mapPin: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  phone: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  creditCard: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>`,
  dollarSign: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  eye: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
  eyeOff: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`,
  chevronDown: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`,
  chevronUp: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>`,
  facebook: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`,
  instagram: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>`,
  twitter: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>`,
  youtube: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>`,
  send: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>`,
};

// ─── LocalStorage Store ─────────────────────────────────────────────────────
const KEYS = {
  users: "cookpal.users",
  session: "cookpal.session",
  favorites: "cookpal.favorites",
  cart: "cookpal.cart",
};

function lsRead(key, fallback) {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; } catch { return fallback; }
}
function lsWrite(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

const Store = {
  _users: lsRead(KEYS.users, []),
  _email: lsRead(KEYS.session, null),
  _favorites: lsRead(KEYS.favorites, []),
  _cart: lsRead(KEYS.cart, []),

  get user() { return this._users.find(u => u.email === this._email) || null; },
  get users() { return this._users; },
  get favorites() { return this._favorites; },
  get cart() { return this._cart; },

  register({ username, email, password }) {
    const existing = lsRead(KEYS.users, []);
    if (existing.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return "Bu email allaqachon ro'yxatdan o'tgan.";
    }
    const next = [...existing, {
      username, email, password,
      bio: "Cookpal jamoasiga yangi qo'shilgan oshpaz.",
      joined: new Date().toISOString(),
    }];
    lsWrite(KEYS.users, next);
    lsWrite(KEYS.session, email);
    this._users = next;
    this._email = email;
    return null;
  },

  login({ email, password }) {
    const existing = lsRead(KEYS.users, []);
    const found = existing.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!found) return "Email yoki parol xato.";
    lsWrite(KEYS.session, found.email);
    this._users = existing;
    this._email = found.email;
    return null;
  },

  logout() {
    lsWrite(KEYS.session, null);
    this._email = null;
  },

  updateProfile({ username, bio }) {
    this._users = this._users.map(u => u.email === this._email ? { ...u, username: username || u.username, bio } : u);
    lsWrite(KEYS.users, this._users);
  },

  toggleFavorite(id) {
    this._favorites = this._favorites.includes(id)
      ? this._favorites.filter(x => x !== id)
      : [...this._favorites, id];
    lsWrite(KEYS.favorites, this._favorites);
  },

  addToCart(id) {
    this._cart = [...this._cart, id];
    lsWrite(KEYS.cart, this._cart);
  },

  removeFromCart(id) {
    const idx = this._cart.indexOf(id);
    if (idx < 0) return;
    this._cart = [...this._cart.slice(0, idx), ...this._cart.slice(idx + 1)];
    lsWrite(KEYS.cart, this._cart);
  },
};

// ─── Hash Router ────────────────────────────────────────────────────────────
const Router = {
  routes: [],
  current: null,

  add(pattern, handler) { this.routes.push({ pattern, handler }); return this; },

  navigate(hash) {
    window.location.hash = hash;
  },

  dispatch() {
    const raw = window.location.hash.slice(1) || "/";
    const [path, qs] = raw.split("?");
    const params = Object.fromEntries(new URLSearchParams(qs || ""));
    this.current = { path, params };

    for (const route of this.routes) {
      const match = this._match(route.pattern, path);
      if (match !== null) {
        route.handler({ path, params, ...match });
        return;
      }
    }
    render404();
  },

  _match(pattern, path) {
    const pParts = pattern.split("/");
    const uParts = path.split("/");
    if (pParts.length !== uParts.length) return null;
    const routeParams = {};
    for (let i = 0; i < pParts.length; i++) {
      if (pParts[i].startsWith(":")) {
        routeParams[pParts[i].slice(1)] = decodeURIComponent(uParts[i]);
      } else if (pParts[i] !== uParts[i]) {
        return null;
      }
    }
    return { routeParams };
  },
};

// ─── Render helpers ─────────────────────────────────────────────────────────
function $(id) { return document.getElementById(id); }
function setMain(html) { $("main-content").innerHTML = html; }

function stars(rating) {
  return Array.from({ length: 5 }, (_, i) =>
    i < rating ? `<span class="star-filled">${ICONS.starFill}</span>` : `<span class="star-empty">${ICONS.star}</span>`
  ).join("");
}

function escHtml(str) {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function navigate(hash) {
  window.location.hash = hash;
}

// ─── Header ─────────────────────────────────────────────────────────────────
function renderHeader() {
  const user = Store.user;
  const cartCount = Store.cart.length;
  const isSupplier = (window.location.hash.slice(1) || "/") === "/supplier";

  if (isSupplier) { $("site-header").innerHTML = ""; return; }

  $("site-header").innerHTML = `
    <div class="header-top">
      <div class="header-top-inner">
        <nav>
          <a href="#/help">Community</a>
          <a href="#/explore?section=Bakery">Books</a>
          <a href="#/explore">Receipe Index</a>
          <a href="#/explore?sort=popular">Popular</a>
          <a href="#/supplier">Suppliers</a>
        </nav>
        <div class="flex items-center gap-4">
          ${user ? `
            <a href="#/profile" class="flex items-center gap-1.5 hover:opacity-80" style="font-size:0.6875rem">${ICONS.user} ${escHtml(user.username)}</a>
            <button id="hdr-logout-btn" class="flex items-center gap-1.5 hover:opacity-80" style="font-size:0.6875rem">${ICONS.logOut} Logout</button>
          ` : `
            <a href="#/auth?mode=register" class="flex items-center gap-1.5 hover:opacity-80" style="font-size:0.6875rem">${ICONS.userPlus} Register</a>
            <a href="#/auth?mode=login" class="flex items-center gap-1.5 hover:opacity-80" style="font-size:0.6875rem">${ICONS.logIn} Login</a>
          `}
        </div>
      </div>
    </div>
    <div class="header-main">
      <div class="header-main-inner">
        <a href="#/" class="logo">Cook<span>pal</span></a>
        <form class="search-form" id="header-search-form">
          <div class="search-wrap">
            <input id="header-search-input" placeholder="Search recipes..." aria-label="Search recipes" />
            <button type="submit" class="btn-search" aria-label="Search">
              ${ICONS.search} <span class="sm:inline">Search</span>
            </button>
          </div>
        </form>
        <div class="header-actions">
          <button class="cart-btn" id="cart-btn" aria-label="Cart">
            ${ICONS.shoppingCart}
            ${cartCount > 0 ? `<span class="cart-badge">${cartCount}</span>` : ""}
          </button>
          <div class="relative" id="avatar-wrap">
            <button class="avatar-btn" id="avatar-btn" aria-label="Profile menu">
              ${user ? escHtml(user.username.slice(0, 2)) : ICONS.user}
            </button>
            <div class="dropdown-menu" id="dropdown-menu" style="display:none">
              <a href="#/profile" class="dropdown-profile">${ICONS.user} Profile</a>
              <a href="#/help">${ICONS.lock} Privacy</a>
              <a href="#/profile">${ICONS.bookMarked} Collections</a>
              <a href="#/profile">${ICONS.settings} Settings</a>
              ${user
                ? `<button id="dropdown-logout-btn" class="w-full">${ICONS.logOut} Logout</button>`
                : `<a href="#/auth?mode=login">${ICONS.logIn} Login</a>`
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Events
  const searchForm = $("header-search-form");
  if (searchForm) {
    searchForm.addEventListener("submit", e => {
      e.preventDefault();
      const q = $("header-search-input").value.trim();
      navigate(q ? `/explore?q=${encodeURIComponent(q)}` : "/explore");
    });
  }

  const cartBtn = $("cart-btn");
  if (cartBtn) cartBtn.addEventListener("click", () => openCartDrawer());

  const avatarBtn = $("avatar-btn");
  const dropdownMenu = $("dropdown-menu");
  if (avatarBtn && dropdownMenu) {
    avatarBtn.addEventListener("click", e => {
      e.stopPropagation();
      const open = dropdownMenu.style.display === "block";
      dropdownMenu.style.display = open ? "none" : "block";
    });
    document.addEventListener("mousedown", e => {
      const wrap = $("avatar-wrap");
      if (wrap && !wrap.contains(e.target)) {
        dropdownMenu.style.display = "none";
      }
    }, { once: false });
  }

  const logoutBtn = $("hdr-logout-btn");
  if (logoutBtn) logoutBtn.addEventListener("click", () => { Store.logout(); refresh(); });

  const dropoutBtn = $("dropdown-logout-btn");
  if (dropoutBtn) dropoutBtn.addEventListener("click", () => { Store.logout(); refresh(); });
}

function renderFooter() {
  const isSupplier = (window.location.hash.slice(1) || "/") === "/supplier";
  if (isSupplier) { $("site-footer").innerHTML = ""; return; }

  const columns = [
    { title: "Fresh Recipe", items: ["Recipes", "Winter salads", "Organic chicken", "Beef and Mutton", "Flavoured Milk"] },
    { title: "In News", items: ["Our Blogs", "Contests/Sweepstakes", "Video", "New Releases", "Newsletters"] },
    { title: "About US", items: ["FAQ", "Our Board", "Our Staff", "Contact Us"] },
  ];

  $("site-footer").innerHTML = `
    <div class="footer-inner">
      <div>
        <div class="footer-logo">Cook<span>pal</span></div>
        <p class="mt-4 text-sm opacity-70">All Rights Reserved</p>
      </div>
      <div class="footer-cols">
        ${columns.map(col => `
          <div>
            <h3>${col.title}</h3>
            <ul>
              ${col.items.map(item => `<li><a href="#/explore">${item}</a></li>`).join("")}
            </ul>
          </div>
        `).join("")}
      </div>
      <div class="footer-newsletter">
        <h3>Join Our Newsletter</h3>
        <form class="newsletter-form" onsubmit="event.preventDefault()">
          <input placeholder="Email" aria-label="Email" />
          <button type="submit" aria-label="Subscribe">${ICONS.send}</button>
        </form>
        <div class="social-icons">
          ${ICONS.facebook}${ICONS.instagram}${ICONS.twitter}${ICONS.youtube}
        </div>
      </div>
    </div>
  `;
}

// ─── Filter Sidebar ──────────────────────────────────────────────────────────
function renderFilterSidebar(filters, onToggle, onClear) {
  const active = Object.values(filters).flat().length;
  return `
    <aside class="filter-sidebar">
      <div class="filter-header">
        <h2 class="script-title">Filter Recipes</h2>
        ${active > 0 ? `<button class="clear-btn" id="filter-clear-btn">Clear (${active})</button>` : ""}
      </div>
      <div class="filter-groups">
        ${Object.entries(filterGroups).map(([group, values]) => `
          <div class="filter-group">
            <h3>${group}</h3>
            <ul>
              ${values.map(value => `
                <li>
                  <button
                    class="${filters[group].includes(value) ? "active" : ""}"
                    data-group="${escHtml(group)}"
                    data-value="${escHtml(value)}"
                    aria-pressed="${filters[group].includes(value)}"
                  >${escHtml(value)}</button>
                </li>
              `).join("")}
            </ul>
          </div>
        `).join("")}
      </div>
    </aside>
  `;
}

function attachFilterEvents(filters, onToggle, onClear, rerender) {
  document.querySelectorAll(".filter-group button[data-group]").forEach(btn => {
    btn.addEventListener("click", () => {
      onToggle(btn.dataset.group, btn.dataset.value);
      rerender();
    });
  });
  const clearBtn = $("filter-clear-btn");
  if (clearBtn) clearBtn.addEventListener("click", () => { onClear(); rerender(); });
}

// ─── Recipe Card ─────────────────────────────────────────────────────────────
function recipeCardHTML(r) {
  const liked = Store.favorites.includes(r.id);
  const inCart = Store.cart.includes(r.id);
  const tags = (r.hashtags || []).slice(0, 3);
  return `
    <article class="recipe-card" data-id="${r.id}">
      <a href="#/recipe/${r.id}" class="recipe-card-img-wrap">
        <img src="${r.image}" alt="${escHtml(r.title)}" loading="lazy" />
        <span class="recipe-card-cuisine script-title">${escHtml(r.cuisine)}</span>
      </a>
      <div class="recipe-card-body">
        <div class="recipe-card-title-row">
          <a href="#/recipe/${r.id}" class="recipe-card-title">${escHtml(r.title)}</a>
          <span class="recipe-card-price">$ ${r.price}</span>
        </div>
        <div class="recipe-card-meta">
          <span class="flex" style="align-items:center;gap:0.25rem">${ICONS.clock} ${r.minutes} min</span>
          <span class="font-semibold">${escHtml(r.difficulty)}</span>
        </div>
        ${tags.length > 0 ? `
          <div class="recipe-card-hashtags">
            ${tags.map(tag => `<a href="#/hashtags?tag=${encodeURIComponent(tag)}" class="recipe-card-hashtag">${escHtml(tag)}</a>`).join("")}
          </div>
        ` : ""}
        <div class="recipe-card-stats">
          <span class="left">
            <span>${ICONS.messageCircle} ${r.comments}</span>
            <span>${ICONS.thumbsUp} ${r.likes}</span>
          </span>
          <span class="stars">${stars(r.rating)}</span>
        </div>
        <div class="recipe-card-actions">
          <a href="#/recipe/${r.id}" class="btn-more">More</a>
          <button class="btn-icon ${inCart ? "in-cart" : ""}" data-cart="${r.id}" aria-label="Add to cart" title="${inCart ? "Savatchada mavjud" : "Savatchaga qo'shish"}">
            ${ICONS.shoppingCart}
          </button>
          <button class="btn-icon ${liked ? "liked" : ""}" data-fav="${r.id}" aria-label="Save recipe">
            ${liked ? ICONS.heartFill : ICONS.heart}
          </button>
        </div>
      </div>
    </article>
  `;
}

function attachCardEvents(container) {
  container.querySelectorAll("button[data-cart]").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      const id = btn.dataset.cart;
      Store.addToCart(id);
      btn.classList.add("just-added");
      btn.innerHTML = ICONS.check;
      setTimeout(() => {
        btn.classList.remove("just-added");
        btn.classList.add("in-cart");
        btn.innerHTML = ICONS.shoppingCart;
        renderHeader(); // update badge
      }, 1500);
    });
  });

  container.querySelectorAll("button[data-fav]").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      const id = btn.dataset.fav;
      Store.toggleFavorite(id);
      const liked = Store.favorites.includes(id);
      btn.classList.toggle("liked", liked);
      btn.innerHTML = liked ? ICONS.heartFill : ICONS.heart;
    });
  });
}

// ─── Cart Drawer ─────────────────────────────────────────────────────────────
let cartDrawerOpen = false;

function openCartDrawer() {
  cartDrawerOpen = true;
  renderCartDrawer();
}

function closeCartDrawer() {
  cartDrawerOpen = false;
  $("cart-drawer-root").innerHTML = "";
}

function renderCartDrawer() {
  if (!cartDrawerOpen) { $("cart-drawer-root").innerHTML = ""; return; }

  const cartRecipes = Store.cart.map(id => getRecipe(id)).filter(Boolean);
  const total = cartRecipes.reduce((s, r) => s + r.price, 0);

  $("cart-drawer-root").innerHTML = `
    <div class="cart-overlay">
      <div id="cart-overlay-bg" style="flex:1"></div>
      <div class="cart-panel">
        <div class="cart-header">
          <div class="flex items-center gap-2">
            ${ICONS.shoppingBag}
            <h3>Savatcha</h3>
            <span class="cart-badge-sm">${cartRecipes.length} ta mahsulot</span>
          </div>
          <button class="btn-close" id="cart-close-btn" aria-label="Yopish">${ICONS.x}</button>
        </div>
        <div class="cart-body">
          ${cartRecipes.length === 0 ? `
            <div class="cart-empty">
              <span style="opacity:0.4">${ICONS.shoppingBag}</span>
              <h4>Savatchangiz bo'sh</h4>
              <p class="text-xs text-muted-foreground">Mahsulotlarni qo'shish uchun retseptlarni ko'ring.</p>
            </div>
          ` : cartRecipes.map((r, i) => `
            <div class="cart-item">
              <img src="${r.image}" alt="${escHtml(r.title)}" />
              <div class="cart-item-info">
                <h4>${escHtml(r.title)}</h4>
                <p>${escHtml(r.cuisine)}</p>
                <p class="cart-item-price">$ ${r.price}</p>
              </div>
              <div class="cart-item-btns">
                <button class="btn-order-sm" data-order-recipe="${r.id}">Buyurtma berish</button>
                <button class="btn-remove-sm" data-remove-cart="${r.id}">${ICONS.trash2} O'chirish</button>
              </div>
            </div>
          `).join("")}
        </div>
        ${cartRecipes.length > 0 ? `
          <div class="cart-footer">
            <div class="cart-total-row">
              <span class="label">Jami summa:</span>
              <span class="amount">$ ${total}</span>
            </div>
            <button class="btn-checkout" data-order-recipe="${cartRecipes[0].id}">
              Buyurtma berish ${ICONS.arrowRight}
            </button>
          </div>
        ` : ""}
      </div>
    </div>
  `;

  $("cart-close-btn").addEventListener("click", closeCartDrawer);
  $("cart-overlay-bg").addEventListener("click", closeCartDrawer);

  document.querySelectorAll("button[data-remove-cart]").forEach(btn => {
    btn.addEventListener("click", () => {
      Store.removeFromCart(btn.dataset.removeCart);
      renderCartDrawer();
      renderHeader();
    });
  });

  document.querySelectorAll("button[data-order-recipe]").forEach(btn => {
    btn.addEventListener("click", () => {
      const r = getRecipe(btn.dataset.orderRecipe);
      if (r) { closeCartDrawer(); openCheckoutModal(r); }
    });
  });
}

// ─── Checkout Modal ──────────────────────────────────────────────────────────
let checkoutState = {
  recipe: null,
  qty: 1,
  address: "",
  phone: "",
  paymentMethod: "cash",
  cardType: "humo",
  cardNumber: "",
  error: null,
};

const CARD_TYPES = [
  { id: "humo", name: "Humo", prefix: "9860" },
  { id: "uzcard", name: "Uzcard", prefix: "8600" },
  { id: "visa", name: "Visa", prefix: "4000" },
  { id: "mastercard", name: "Mastercard", prefix: "5100" },
];

function openCheckoutModal(recipe) {
  checkoutState = { recipe, qty: 1, address: "", phone: "", paymentMethod: "cash", cardType: "humo", cardNumber: "", error: null };
  renderCheckoutModal();
}

function closeCheckoutModal() {
  checkoutState.recipe = null;
  $("checkout-modal-root").innerHTML = "";
}

function renderCheckoutModal() {
  const s = checkoutState;
  if (!s.recipe) { $("checkout-modal-root").innerHTML = ""; return; }
  const r = s.recipe;
  const total = r.price * s.qty;

  $("checkout-modal-root").innerHTML = `
    <div class="modal-overlay" id="checkout-overlay">
      <div class="modal-box">
        <div class="modal-header">
          <div class="flex items-center gap-2">
            ${ICONS.shoppingBag}
            <h3>Buyurtma rasmiylashtirish</h3>
          </div>
          <button class="btn-close" id="checkout-close-btn">${ICONS.x}</button>
        </div>
        <div class="modal-body">
          <!-- Recipe preview -->
          <div class="checkout-recipe-preview">
            <img src="${r.image}" alt="${escHtml(r.title)}" />
            <div style="flex:1;min-width:0">
              <h4>${escHtml(r.title)}</h4>
              <p>${escHtml(r.cuisine)} • ${r.minutes} daqiqa</p>
              <p class="price">$ ${r.price} / dona</p>
            </div>
          </div>

          <!-- Quantity -->
          <div>
            <label class="field-label">Nechta buyurtma qilasiz? (Soni)</label>
            <div class="qty-wrap">
              <button type="button" class="qty-btn" id="qty-minus">-</button>
              <input type="number" class="qty-input" id="qty-input" value="${s.qty}" min="1" />
              <button type="button" class="qty-btn" id="qty-plus">+</button>
              <div class="qty-total">
                <span>Jami summa:</span>
                <span id="qty-total-price">$ ${total}</span>
              </div>
            </div>
          </div>

          <!-- Address -->
          <div>
            <label class="field-label">Yetkazib berish manzili *</label>
            <input type="text" class="field-input" id="checkout-address" placeholder="Masalan: Toshkent sh., Chilonzor t., 15-uy" value="${escHtml(s.address)}" required />
          </div>

          <!-- Phone -->
          <div>
            <label class="field-label">Telefon raqami *</label>
            <input type="tel" class="field-input" id="checkout-phone" placeholder="+998 90 123 45 67" value="${escHtml(s.phone)}" required />
          </div>

          <!-- Payment -->
          <div>
            <label class="field-label">To'lov turi *</label>
            <div class="payment-grid">
              <button type="button" class="payment-btn ${s.paymentMethod === "cash" ? "active" : ""}" data-payment="cash">
                ${ICONS.dollarSign} Naqd pul
              </button>
              <button type="button" class="payment-btn ${s.paymentMethod === "card" ? "active" : ""}" data-payment="card">
                ${ICONS.creditCard} Karta orqali
              </button>
            </div>
          </div>

          <!-- Card options -->
          ${s.paymentMethod === "card" ? `
            <div class="card-types-wrap">
              <label class="field-label">Karta turini tanlang</label>
              <div class="card-types-grid">
                ${CARD_TYPES.map(c => `
                  <button type="button" class="card-type-btn ${s.cardType === c.id ? "active" : ""}" data-card-type="${c.id}">
                    <span>${c.name}</span>
                    <span>(${c.prefix}...)</span>
                  </button>
                `).join("")}
              </div>
              <div>
                <label class="field-label">${CARD_TYPES.find(c => c.id === s.cardType)?.name} karta raqami *</label>
                <input type="text" class="field-input" id="checkout-card" placeholder="${CARD_TYPES.find(c => c.id === s.cardType)?.prefix} **** **** ****" value="${escHtml(s.cardNumber)}" style="font-family:monospace" />
              </div>
            </div>
          ` : ""}

          ${s.error ? `<div class="error-box">${escHtml(s.error)}</div>` : ""}

          <button type="button" class="btn-submit" id="checkout-submit-btn">
            ${ICONS.checkCircle2} Buyurtma berish ($ ${total})
          </button>
        </div>
      </div>
    </div>
  `;

  // Close
  $("checkout-close-btn").addEventListener("click", closeCheckoutModal);
  $("checkout-overlay").addEventListener("click", e => { if (e.target === $("checkout-overlay")) closeCheckoutModal(); });

  // Qty
  $("qty-minus").addEventListener("click", () => {
    checkoutState.qty = Math.max(1, checkoutState.qty - 1);
    $("qty-input").value = checkoutState.qty;
    const t = r.price * checkoutState.qty;
    $("qty-total-price").textContent = `$ ${t}`;
    $("checkout-submit-btn").textContent = `Buyurtma berish ($ ${t})`;
  });
  $("qty-plus").addEventListener("click", () => {
    checkoutState.qty += 1;
    $("qty-input").value = checkoutState.qty;
    const t = r.price * checkoutState.qty;
    $("qty-total-price").textContent = `$ ${t}`;
    $("checkout-submit-btn").textContent = `Buyurtma berish ($ ${t})`;
  });
  $("qty-input").addEventListener("input", e => {
    checkoutState.qty = Math.max(1, parseInt(e.target.value) || 1);
    const t = r.price * checkoutState.qty;
    $("qty-total-price").textContent = `$ ${t}`;
  });

  $("checkout-address").addEventListener("input", e => { checkoutState.address = e.target.value; });
  $("checkout-phone").addEventListener("input", e => { checkoutState.phone = e.target.value; });

  // Payment method
  document.querySelectorAll("button[data-payment]").forEach(btn => {
    btn.addEventListener("click", () => {
      checkoutState.paymentMethod = btn.dataset.payment;
      renderCheckoutModal();
    });
  });

  // Card type
  document.querySelectorAll("button[data-card-type]").forEach(btn => {
    btn.addEventListener("click", () => {
      checkoutState.cardType = btn.dataset.cardType;
      renderCheckoutModal();
    });
  });

  const cardInput = $("checkout-card");
  if (cardInput) cardInput.addEventListener("input", e => { checkoutState.cardNumber = e.target.value; });

  // Submit
  $("checkout-submit-btn").addEventListener("click", () => {
    checkoutState.address = $("checkout-address")?.value || checkoutState.address;
    checkoutState.phone = $("checkout-phone")?.value || checkoutState.phone;
    if (cardInput) checkoutState.cardNumber = cardInput.value;

    if (checkoutState.qty < 1) { checkoutState.error = "Buyurtma soni kamida 1 ta bo'lishi kerak."; renderCheckoutModal(); return; }
    if (!checkoutState.address.trim()) { checkoutState.error = "Iltimos, yetkazib berish manzilini kiriting."; renderCheckoutModal(); return; }
    if (!checkoutState.phone.trim()) { checkoutState.error = "Iltimos, telefon raqamingizni kiriting."; renderCheckoutModal(); return; }
    if (checkoutState.paymentMethod === "card" && (!checkoutState.cardNumber.trim() || checkoutState.cardNumber.trim().length < 8)) {
      checkoutState.error = `Iltimos, ${CARD_TYPES.find(c => c.id === checkoutState.cardType)?.name} karta raqamini to'liq kiriting.`;
      renderCheckoutModal(); return;
    }

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: "Mijoz",
      phone: checkoutState.phone.trim(),
      address: checkoutState.address.trim(),
      recipeId: r.id,
      recipeTitle: r.title,
      recipeImage: r.image,
      quantity: checkoutState.qty,
      unitPrice: r.price,
      totalPrice: r.price * checkoutState.qty,
      paymentMethod: checkoutState.paymentMethod === "card" ? `Karta (${checkoutState.cardType.toUpperCase()})` : "Naqd pul",
      cardNumber: checkoutState.paymentMethod === "card" ? checkoutState.cardNumber : undefined,
      status: "Kutilmoqda ⏳",
      createdAt: `Bugun, ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
    };

    try {
      const existing = lsRead("cookpal.supplier_orders", []);
      lsWrite("cookpal.supplier_orders", [newOrder, ...existing]);
      window.dispatchEvent(new Event("cookpal_order_created"));
    } catch {}

    alert("Buyurtma tez orada qo'lingizda bo'ladi");
    Store.removeFromCart(r.id);
    closeCheckoutModal();
    renderHeader();
  });
}

// ─── Pages ──────────────────────────────────────────────────────────────────

// ── HOME ──
function renderHome() {
  document.title = "Cookpal — Filter, Save & Cook Better Recipes";
  const SECTIONS = ["Cusines", "Diet", "Bakery"];

  let filters = { ...emptyFilters };

  function getVisible() { return filterRecipes(filters, ""); }

  function render() {
    const visible = getVisible();

    setMain(`
      <!-- Hero -->
      <section class="hero">
        <img src="../src/assets/hero-chicken.jpg" alt="Grilled chicken salad in a white bowl on a wooden table" />
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <h1><span class="font-light">Meat</span> <span class="font-extrabold">Chicken</span></h1>
          <a href="#/recipe/mexican-chicken" class="btn-hero">More</a>
        </div>
        <div class="hero-social">
          <a href="#">${ICONS.facebook}</a>
          <a href="#">${ICONS.youtube}</a>
          <a href="#">${ICONS.twitter}</a>
          <a href="#">${ICONS.instagram}</a>
        </div>
      </section>

      <div class="page-container">
        <div class="content-layout">
          ${renderFilterSidebar(filters, (g, v) => {}, () => {})}

          <div class="min-w-0" style="flex:1">
            <!-- Section nav -->
            <nav class="section-nav">
              <a href="#/" class="active">Home</a>
              ${SECTIONS.map(s => `<a href="#${s.toLowerCase()}" class="scroll-anchor" data-target="${s.toLowerCase()}">${s}</a>`).join("")}
              <a href="#/help" class="nav-pill">${ICONS.helpCircle} Help</a>
              <a href="#/hashtags" class="nav-pill">${ICONS.tag} Hashtags</a>
              <a href="#/supplier" class="nav-pill">${ICONS.truck} Supplier Portal</a>
            </nav>

            ${SECTIONS.map(section => {
              const items = visible.filter(r => r.section === section);
              return `
                <section id="${section.toLowerCase()}" class="scroll-mt-28" style="margin-top:2.5rem">
                  <div class="section-header">
                    <h2 class="script-title">${section}</h2>
                    <a href="#/explore?section=${encodeURIComponent(section)}" class="see-all">Barchasini ko'rish &rarr;</a>
                  </div>
                  ${items.length === 0
                    ? `<p class="mt-4 text-sm text-muted-foreground">Bu filtrlar bo'yicha ${section} bo'limida mahsulot topilmadi.</p>`
                    : `<div class="recipe-shelf">${items.map(r => recipeCardHTML(r)).join("")}</div>`
                  }
                </section>
              `;
            }).join("")}

            <p class="mt-10 text-sm text-muted-foreground">${visible.length} / ${recipes.length} recipes shown.</p>
          </div>
        </div>
      </div>
    `);

    // attach sidebar events
    attachFilterEvents(filters,
      (g, v) => {
        filters[g] = filters[g].includes(v) ? filters[g].filter(x => x !== v) : [...filters[g], v];
        render();
      },
      () => { filters = { ...emptyFilters }; render(); },
      render
    );

    // scroll anchors
    document.querySelectorAll(".scroll-anchor").forEach(a => {
      a.addEventListener("click", e => {
        e.preventDefault();
        const t = document.getElementById(a.dataset.target);
        if (t) t.scrollIntoView({ behavior: "smooth" });
      });
    });

    // card events
    attachCardEvents($("main-content"));
  }

  render();
}

// ── EXPLORE ──
function renderExplore({ params }) {
  document.title = "Explore Recipes — Cookpal";
  const SECTIONS_LIST = ["Cusines", "Diet", "Bakery"];

  let filters = {
    ...emptyFilters,
    ...(params.cusine ? { Cusine: [params.cusine] } : {}),
    ...(params.diet ? { Diet: [params.diet] } : {}),
  };
  let query = params.q || "";
  const section = params.section || "";
  const sort = params.sort || "";

  function computeResults() {
    let res = filterRecipes(filters, query);
    if (section) res = res.filter(r => r.section.toLowerCase() === section.toLowerCase());
    if (sort === "popular") res = [...res].sort((a, b) => b.likes - a.likes);
    return res;
  }

  function render() {
    const results = computeResults();
    setMain(`
      <div class="page-container">
        <div class="content-layout">
          ${renderFilterSidebar(filters, () => {}, () => {})}

          <div class="min-w-0" style="flex:1">
            <div class="flex items-center flex-wrap" style="justify-content:space-between;gap:1rem">
              <h1 class="script-title" style="font-size:3rem">Explore Recipes</h1>
              ${(section || sort || params.cusine || params.diet) ? `<button id="reset-filters-btn" class="text-xs font-bold text-primary" style="cursor:pointer;background:none;border:none">Reset filters</button>` : ""}
            </div>

            <form class="explore-search-form" id="explore-search-form">
              ${ICONS.search}
              <input id="explore-input" value="${escHtml(query)}" placeholder="Search by name, cuisine or description..." aria-label="Search recipes" />
              <button type="submit" class="btn-search" aria-label="Search" style="height:2.75rem;padding:0 1.5rem;font-size:0.875rem">
                ${ICONS.search} <span>Search</span>
              </button>
            </form>

            <div class="flex flex-wrap items-center gap-2 mt-4">
              <p class="text-sm text-muted-foreground">${results.length} recipe(s) found</p>
              ${section ? `<span style="border-radius:9999px;background:color-mix(in oklch,var(--primary) 10%,transparent);padding:0.25rem 0.75rem;font-size:0.75rem;font-weight:600;color:var(--primary)">Section: ${escHtml(section)}</span>` : ""}
              ${sort ? `<span style="border-radius:9999px;background:color-mix(in oklch,var(--primary) 10%,transparent);padding:0.25rem 0.75rem;font-size:0.75rem;font-weight:600;color:var(--primary)">Sort: ${escHtml(sort)}</span>` : ""}
            </div>

            <div class="recipe-grid" id="explore-grid" style="margin-top:1.5rem;max-height:70vh;overflow-y:auto;padding-right:0.5rem">
              ${results.map(r => recipeCardHTML(r)).join("")}
            </div>

            ${results.length === 0 ? `<p style="margin-top:2rem;border-radius:0.5rem;border:1px dashed var(--border);padding:2rem;text-align:center;color:var(--muted-foreground)">Hech narsa topilmadi. Boshqa filtr yoki so'z bilan qidiring.</p>` : ""}
          </div>
        </div>
      </div>
    `);

    // Filter events
    attachFilterEvents(filters,
      (g, v) => { filters[g] = filters[g].includes(v) ? filters[g].filter(x => x !== v) : [...filters[g], v]; render(); },
      () => { filters = { ...emptyFilters }; render(); },
      render
    );

    // Search
    $("explore-search-form").addEventListener("submit", e => {
      e.preventDefault();
      query = $("explore-input").value.trim();
      render();
    });

    // Reset
    const resetBtn = $("reset-filters-btn");
    if (resetBtn) resetBtn.addEventListener("click", () => navigate("/explore"));

    // Cards
    attachCardEvents($("explore-grid") || $("main-content"));
  }

  render();
}

// ── RECIPE DETAIL ──
function renderRecipeDetail({ routeParams }) {
  const r = getRecipe(routeParams.recipeId);
  if (!r) { render404(); return; }
  document.title = `${r.title} — Cookpal Recipe`;

  const liked = Store.favorites.includes(r.id);
  const related = recipes.filter(x => x.id !== r.id && x.section === r.section).slice(0, 6);

  setMain(`
    <article class="page-container" style="max-width:64rem">
      <nav class="breadcrumb">
        <a href="#/">Home</a> / <span class="current">${escHtml(r.section)}</span>
      </nav>

      <div class="recipe-detail-grid">
        <img src="${r.image}" alt="${escHtml(r.title)}" class="recipe-detail-img" />
        <div>
          <span class="script-title text-3xl">${escHtml(r.cuisine)}</span>
          <h1 style="margin-top:0.25rem;font-size:1.875rem;font-weight:800">${escHtml(r.title)}</h1>
          <p style="margin-top:0.75rem;line-height:1.625;color:var(--muted-foreground)">${escHtml(r.description)}</p>

          <div class="flex flex-wrap items-center gap-4 mt-5 text-sm text-muted-foreground">
            <span class="flex" style="align-items:center;gap:0.25rem">${ICONS.clock} ${r.minutes} minutes</span>
            <span class="flex" style="align-items:center;gap:0.25rem">${ICONS.messageCircle} ${r.comments}</span>
            <span class="flex" style="align-items:center;gap:0.25rem">${ICONS.thumbsUp} ${r.likes}</span>
            <span class="stars">${stars(r.rating)}</span>
            <span style="font-weight:700;color:var(--foreground)">${escHtml(r.difficulty)}</span>
          </div>

          <div class="recipe-tags">
            ${[...r.diet, ...r.goals].map(t => `<span class="tag-pill">${escHtml(t)}</span>`).join("")}
          </div>

          ${r.hashtags && r.hashtags.length > 0 ? `
            <div class="flex flex-wrap gap-2 mt-3">
              ${r.hashtags.map(tag => `<a href="#/hashtags?tag=${encodeURIComponent(tag)}" class="recipe-card-hashtag" style="font-size:0.75rem;padding:0.25rem 0.75rem">${escHtml(tag)}</a>`).join("")}
            </div>
          ` : ""}

          <div class="recipe-actions">
            <span style="font-size:1.5rem;font-weight:800;color:var(--price)">$ ${r.price}</span>
            <button class="btn-add-cart" id="detail-add-cart" data-id="${r.id}">
              ${ICONS.shoppingCart} Add to cart
            </button>
            <button class="btn-save ${liked ? "saved" : ""}" id="detail-save" data-id="${r.id}">
              ${liked ? ICONS.heartFill : ICONS.heart} ${liked ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      </div>

      <div class="recipe-lower-grid">
        <section>
          <h2 class="script-title text-3xl">Ingredients</h2>
          <ul class="ingredients-list">
            ${r.ingredients.map(i => `<li>${escHtml(i)}</li>`).join("")}
          </ul>

          <h2 class="script-title" style="margin-top:2.5rem;font-size:1.875rem">Nutrition</h2>
          <dl class="nutrition-grid">
            ${r.nutrition.map(n => `
              <div class="nutrition-card">
                <dt>${escHtml(n.label)}</dt>
                <dd>${escHtml(n.value)}</dd>
              </div>
            `).join("")}
          </dl>
        </section>

        <section>
          <h2 class="script-title text-3xl">How to cook</h2>
          <ol class="steps-list">
            ${r.steps.map((s, i) => `
              <li class="step-item">
                <span class="step-num">${i + 1}</span>
                <p>${escHtml(s)}</p>
              </li>
            `).join("")}
          </ol>
        </section>
      </div>

      ${related.length > 0 ? `
        <section style="margin-top:3.5rem">
          <h2 class="script-title text-3xl">More ${escHtml(r.section)}</h2>
          <div class="recipe-shelf" id="related-cards">
            ${related.map(x => recipeCardHTML(x)).join("")}
          </div>
        </section>
      ` : ""}
    </article>
  `);

  $("detail-add-cart").addEventListener("click", () => {
    Store.addToCart(r.id);
    renderHeader();
    openCheckoutModal(r);
  });

  $("detail-save").addEventListener("click", btn => {
    Store.toggleFavorite(r.id);
    const liked2 = Store.favorites.includes(r.id);
    const saveBtn = $("detail-save");
    saveBtn.classList.toggle("saved", liked2);
    saveBtn.innerHTML = `${liked2 ? ICONS.heartFill : ICONS.heart} ${liked2 ? "Saved" : "Save"}`;
  });

  const relatedGrid = $("related-cards");
  if (relatedGrid) attachCardEvents(relatedGrid);
}

// ── AUTH ──
function renderAuth({ params }) {
  const isRegister = params.mode === "register";
  document.title = "Login or Register — Cookpal";

  setMain(`
    <div class="auth-page">
      <h1 class="script-title">${isRegister ? "Register" : "Login"}</h1>
      <p class="mt-2 text-sm text-muted-foreground">Ma'lumotlar shu brauzerda saqlanadi, keyingi kirishda profilingiz joyida qoladi.</p>

      <form class="auth-form" id="auth-form">
        ${isRegister ? `
          <label class="auth-label">
            <span>Username</span>
            <input class="auth-input" id="auth-username" required placeholder="username" />
          </label>
        ` : ""}
        <label class="auth-label">
          <span>Email</span>
          <input class="auth-input" id="auth-email" type="email" required placeholder="email@example.com" />
        </label>
        <label class="auth-label">
          <span>Password</span>
          <input class="auth-input" id="auth-password" type="password" required minlength="4" placeholder="••••••••" />
        </label>

        <div id="auth-error" style="color:var(--destructive);font-size:0.875rem;font-weight:600;display:none"></div>

        <button type="submit" class="btn-primary-full">
          ${isRegister ? "Create account" : "Sign in"}
        </button>
      </form>

      <p class="mt-6 text-sm text-muted-foreground">
        ${isRegister ? "Akkauntingiz bormi? " : "Akkauntingiz yo'qmi? "}
        <a href="#/auth?mode=${isRegister ? "login" : "register"}" class="primary-link">
          ${isRegister ? "Login" : "Register"}
        </a>
      </p>
    </div>
  `);

  $("auth-form").addEventListener("submit", e => {
    e.preventDefault();
    const email = $("auth-email").value.trim();
    const password = $("auth-password").value;
    const errEl = $("auth-error");

    let err;
    if (isRegister) {
      const username = $("auth-username").value.trim();
      err = Store.register({ username, email, password });
    } else {
      err = Store.login({ email, password });
    }

    if (err) {
      errEl.textContent = err;
      errEl.style.display = "block";
    } else {
      navigate("/profile");
    }
  });
}

// ── PROFILE ──
function renderProfile() {
  document.title = "Your Profile — Cookpal";
  const user = Store.user;

  if (!user) {
    setMain(`
      <div class="auth-page" style="text-align:center">
        <h1 class="script-title">Profile</h1>
        <p class="mt-3 text-muted-foreground">Profilni ko'rish uchun avval tizimga kiring yoki ro'yxatdan o'ting.</p>
        <div class="flex justify-center gap-3 mt-6">
          <a href="#/auth?mode=login" style="border-radius:var(--radius);background:var(--primary);padding:0.5rem 1.25rem;font-size:0.875rem;font-weight:700;color:var(--primary-foreground)">Login</a>
          <a href="#/auth?mode=register" style="border-radius:var(--radius);border:1px solid var(--border);padding:0.5rem 1.25rem;font-size:0.875rem;font-weight:700">Register</a>
        </div>
      </div>
    `);
    return;
  }

  const savedRecipes = recipes.filter(r => Store.favorites.includes(r.id));
  const cartRecipes = Store.cart.map(id => recipes.find(r => r.id === id)).filter(Boolean);

  setMain(`
    <div class="page-container" style="max-width:64rem">
      <div class="flex flex-wrap items-center gap-5">
        <div class="profile-avatar">${escHtml(user.username.slice(0, 2))}</div>
        <div>
          <h1 style="font-size:1.875rem;font-weight:800">${escHtml(user.username)}</h1>
          <p class="text-sm text-muted-foreground">${escHtml(user.email)}</p>
          <p class="text-xs text-muted-foreground">Joined ${new Date(user.joined).toLocaleDateString()}</p>
        </div>
        <button id="profile-logout-btn" style="margin-left:auto;border-radius:var(--radius);border:1px solid var(--border);padding:0.5rem 1rem;font-size:0.875rem;font-weight:700;cursor:pointer;background:none">Logout</button>
      </div>

      <!-- Settings -->
      <form class="profile-settings-form" id="profile-settings-form">
        <h2 style="font-size:1.125rem;font-weight:700">Settings</h2>
        <label class="auth-label">
          <span>Username</span>
          <input class="auth-input" id="profile-username" value="${escHtml(user.username)}" />
        </label>
        <label class="auth-label">
          <span>Bio</span>
          <textarea id="profile-bio" rows="3" style="margin-top:0.25rem;width:100%;border-radius:var(--radius);border:1px solid var(--input);padding:0.75rem;font-size:0.875rem;outline:none;font-family:inherit;resize:vertical;background:var(--background);color:var(--foreground)">${escHtml(user.bio || "")}</textarea>
        </label>
        <div class="flex items-center gap-3">
          <button type="submit" style="border-radius:var(--radius);background:var(--primary);padding:0.5rem 1.25rem;font-size:0.875rem;font-weight:700;color:var(--primary-foreground);border:none;cursor:pointer">Save changes</button>
          <span id="profile-saved-msg" style="display:none;font-size:0.875rem;font-weight:700;color:var(--primary)">Saqlandi ✓</span>
        </div>
      </form>

      <!-- Collections -->
      <section class="mt-12">
        <h2 class="script-title" style="font-size:2.25rem">Collections</h2>
        ${savedRecipes.length === 0
          ? `<p class="mt-3 text-sm text-muted-foreground">Hali saqlangan retsept yo'q — kartadagi yurakni bosing.</p>`
          : `<div class="recipe-shelf mt-5" id="saved-cards">${savedRecipes.map(r => recipeCardHTML(r)).join("")}</div>`
        }
      </section>

      <!-- Cart -->
      <section class="mt-12">
        <h2 class="script-title" style="font-size:2.25rem">Cart</h2>
        ${cartRecipes.length === 0
          ? `<p class="mt-3 text-sm text-muted-foreground">Savat bo'sh.</p>`
          : `<ul class="cart-list mt-5" id="profile-cart-list">
              ${cartRecipes.map((r, i) => `
                <li key="${r.id}-${i}">
                  <img src="${r.image}" alt="${escHtml(r.title)}" />
                  <div style="flex:1;min-width:0">
                    <h4 style="font-size:0.875rem;font-weight:700">${escHtml(r.title)}</h4>
                    <p class="text-xs text-muted-foreground">${escHtml(r.cuisine)}</p>
                  </div>
                  <span class="text-price font-extrabold text-sm">$ ${r.price}</span>
                  <div class="flex items-center gap-2">
                    <button class="btn-order-sm" data-profile-order="${r.id}">Buyurtma berish</button>
                    <button class="btn-remove-sm" data-profile-remove="${r.id}">${ICONS.trash2} Remove</button>
                  </div>
                </li>
              `).join("")}
            </ul>`
        }
      </section>
    </div>
  `);

  $("profile-logout-btn").addEventListener("click", () => { Store.logout(); navigate("/"); });

  $("profile-settings-form").addEventListener("submit", e => {
    e.preventDefault();
    Store.updateProfile({
      username: $("profile-username").value.trim() || user.username,
      bio: $("profile-bio").value,
    });
    const msg = $("profile-saved-msg");
    msg.style.display = "inline";
    setTimeout(() => { msg.style.display = "none"; }, 2000);
  });

  document.querySelectorAll("button[data-profile-order]").forEach(btn => {
    btn.addEventListener("click", () => {
      const r = getRecipe(btn.dataset.profileOrder);
      if (r) openCheckoutModal(r);
    });
  });

  document.querySelectorAll("button[data-profile-remove]").forEach(btn => {
    btn.addEventListener("click", () => {
      Store.removeFromCart(btn.dataset.profileRemove);
      renderProfile();
      renderHeader();
    });
  });

  const savedCards = $("saved-cards");
  if (savedCards) attachCardEvents(savedCards);
}

// ── HELP ──
function renderHelp() {
  document.title = "Help & FAQ — Cookpal";
  const faqs = [
    { q: "Ro'yxatdan qanday o'taman?", a: "Yuqoridagi Register tugmasini bosing, ism, email va parolni kiriting. Profilingiz brauzeringizda saqlanadi va keyingi kirishda ham qoladi." },
    { q: "Retsept haqida to'liq ma'lumotni qanday ko'raman?", a: "Har bir kartadagi yoki hero bo'limidagi More tugmasini bosing — ingredientlar, bosqichlar va kaloriya ma'lumotlari chiqadi." },
    { q: "Filtrlar qanday ishlaydi?", a: "Chapdagi Diet, Allergies, Cusine va Goals ro'yxatidan istalganini bosing. Ro'yxat darhol filtrlanadi, Clear bilan tozalanadi." },
    { q: "Saqlangan retseptlarim qayerda?", a: "Kartadagi yurak belgisini bosing — retsept Profile sahifasidagi Collections bo'limiga tushadi." },
  ];

  setMain(`
    <div class="help-page">
      <h1 class="script-title" style="font-size:3rem">Help</h1>
      <p class="mt-3 text-muted-foreground">Ko'p beriladigan savollar. Javob topilmasa Contact Us orqali yozing.</p>

      <div class="faq-list">
        ${faqs.map(f => `
          <details>
            <summary>${escHtml(f.q)}</summary>
            <p>${escHtml(f.a)}</p>
          </details>
        `).join("")}
      </div>

      <div class="help-box">
        <h2 style="font-size:1.125rem;font-weight:700;color:var(--secondary-foreground)">Hali savol bormi?</h2>
        <p class="mt-2 text-sm" style="color:color-mix(in oklch,var(--secondary-foreground) 80%,transparent)">Profilingizni yaratib, retseptlarga izoh qoldirishingiz mumkin.</p>
        <a href="#/auth?mode=register" style="display:inline-block;margin-top:1rem;border-radius:var(--radius);background:var(--primary);padding:0.5rem 1.25rem;font-size:0.875rem;font-weight:700;color:var(--primary-foreground)">Register</a>
      </div>
    </div>
  `);
}

// ── HASHTAGS ──
function renderHashtags({ params }) {
  document.title = "Hashtags — Cookpal";
  const SECTIONS = ["Cusines", "Diet", "Bakery"];
  const selectedTags = params.tag ? params.tag.split(",").filter(Boolean) : [];

  // Count hashtags
  const counts = {};
  recipes.forEach(r => {
    (r.hashtags || []).forEach(tag => { counts[tag] = (counts[tag] || 0) + 1; });
  });
  const hashtagList = Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .filter(({ count }) => count > 1);

  const filteredRecipes = selectedTags.length > 0
    ? recipes.filter(r => r.hashtags?.some(t => selectedTags.includes(t)))
    : recipes.filter(r => r.hashtags && r.hashtags.length > 0);

  setMain(`
    <div>
      <div class="page-container">
        <div class="min-w-0" style="flex:1">
          <!-- nav -->
          <nav class="section-nav">
            <a href="#/" class="text-primary">Home</a>
            ${SECTIONS.map(s => `<a href="#/${s.toLowerCase()}" class="text-primary">${s}</a>`).join("")}
            <a href="#/help" class="nav-pill">❓ Help</a>
            <a href="#/hashtags" class="nav-pill active">🏷️ Hashtags</a>
            <a href="#/supplier" class="nav-pill">🚚 Supplier Portal</a>
          </nav>

          <div class="flex flex-wrap items-center justify-between gap-4 mt-10">
            <div>
              <div class="flex flex-wrap items-center gap-3">
                ${ICONS.hash}
                <h1 class="script-title" style="font-size:3rem">Hashtags</h1>
              </div>
              <p class="mt-3 text-muted-foreground">Taomlarni heshteglar bo'yicha saralab ko'ring. Bir nechta heshtegni bir vaqtda tanlashingiz mumkin.</p>
            </div>
            ${selectedTags.length > 0 ? `
              <button id="clear-tags-btn" style="border-radius:9999px;background:color-mix(in oklch,var(--destructive) 10%,transparent);padding:0.375rem 1rem;font-size:0.75rem;font-weight:700;color:var(--destructive);border:none;cursor:pointer;transition:all 150ms">
                Tozalash (${selectedTags.length})
              </button>
            ` : ""}
          </div>

          <!-- Hashtag buttons -->
          <div class="hashtag-tags">
            ${hashtagList.map(({ name, count }) => `
              <button class="hashtag-btn ${selectedTags.includes(name) ? "active" : ""}" data-tag="${escHtml(name)}">
                <span>${escHtml(name)}</span>
                <span class="hashtag-count">${count}</span>
              </button>
            `).join("")}
          </div>

          <!-- Results -->
          <div class="mt-12">
            <div class="flex items-center justify-between border-b pb-3">
              <h2 class="text-xl font-bold flex items-center gap-2">
                ${ICONS.listFilter}
                ${selectedTags.length > 0 ? escHtml(selectedTags.join(", ")) + " heshteglari bo'yicha" : "Barcha heshtegli taomlar"}
              </h2>
              <span class="text-sm font-semibold text-muted-foreground">${filteredRecipes.length} retsept topildi</span>
            </div>

            ${filteredRecipes.length === 0
              ? `<p class="mt-8 text-center text-muted-foreground" style="border:1px dashed var(--border);border-radius:0.5rem;padding:2rem">Tanlangan heshteglar bo'yicha retseptlar topilmadi.</p>`
              : `<div class="recipe-grid mt-6" id="hashtag-cards">${filteredRecipes.map(r => recipeCardHTML(r)).join("")}</div>`
            }
          </div>
        </div>
      </div>
    </div>
  `);

  // Hashtag button events
  document.querySelectorAll("button[data-tag]").forEach(btn => {
    btn.addEventListener("click", () => {
      const tag = btn.dataset.tag;
      let newTags;
      if (selectedTags.includes(tag)) {
        newTags = selectedTags.filter(t => t !== tag);
      } else {
        newTags = [...selectedTags, tag];
      }
      if (newTags.length === 0) {
        navigate("/hashtags");
      } else {
        navigate(`/hashtags?tag=${encodeURIComponent(newTags.join(","))}`);
      }
    });
  });

  const clearBtn = $("clear-tags-btn");
  if (clearBtn) clearBtn.addEventListener("click", () => navigate("/hashtags"));

  const hashtagCards = $("hashtag-cards");
  if (hashtagCards) attachCardEvents(hashtagCards);
}

// ── SUPPLIER PORTAL ──
const SUPPLIER_USERNAME = "courier";
const SUPPLIER_PASSWORD = "pass123";
const SUPPLIER_AUTH_KEY = "cookpal.supplier_auth";
const SUPPLIER_STORAGE_KEY = "cookpal.supplier_orders";

const defaultSeedOrders = [
  {
    id: "ORD-101",
    customerName: "Alisher Navoiy",
    phone: "+998 90 123 45 67",
    address: "Toshkent sh., Chilonzor t., 15-uy, 24-xonadon",
    recipeId: "italian-margherita-pizza",
    recipeTitle: "Classic Italian Margherita Pizza",
    recipeImage: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80",
    quantity: 2,
    unitPrice: 140,
    totalPrice: 280,
    paymentMethod: "Karta (HUMO)",
    cardNumber: "9860 **** **** 4120",
    status: "Kutilmoqda ⏳",
    createdAt: "Bugun, 14:30",
  },
  {
    id: "ORD-102",
    customerName: "Dilnoza Ahmedova",
    phone: "+998 97 765 43 21",
    address: "Toshkent sh., Yunusobod t., 4-kvartal, 8-uy",
    recipeId: "pad-thai-shrimp",
    recipeTitle: "Authentic Pad Thai Shrimp",
    recipeImage: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80",
    quantity: 1,
    unitPrice: 135,
    totalPrice: 135,
    paymentMethod: "Naqd pul",
    status: "Kutilmoqda ⏳",
    createdAt: "Bugun, 15:10",
  },
  {
    id: "ORD-103",
    customerName: "Sardor Rahimov",
    phone: "+998 93 333 22 11",
    address: "Toshkent sh., Mirzo Ulug'bek t., Buyuk Ipak Yoli 45",
    recipeId: "teriyaki-salmon-bowl",
    recipeTitle: "Teriyaki Glazed Salmon Bowl",
    recipeImage: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    quantity: 3,
    unitPrice: 160,
    totalPrice: 480,
    paymentMethod: "Karta (UZCARD)",
    cardNumber: "8600 **** **** 9012",
    status: "Yetkazib berildi ✅",
    createdAt: "Bugun, 12:20",
  },
];

let supplierState = {
  authenticated: null,
  orders: [],
  expandedId: null,
  showPassword: false,
  username: "",
  password: "",
  error: null,
  loading: false,
};

function renderSupplier() {
  document.title = "Yetkazib Beruvchilar Paneli — Cookpal";
  // Hide header/footer
  $("site-header").innerHTML = "";
  $("site-footer").innerHTML = "";

  const auth = localStorage.getItem(SUPPLIER_AUTH_KEY);
  supplierState.authenticated = auth === "true";

  if (supplierState.authenticated === false || supplierState.authenticated === null && auth !== "true") {
    renderSupplierLogin();
  } else {
    loadSupplierOrders();
    renderSupplierDashboard();
  }
}

function loadSupplierOrders() {
  const raw = localStorage.getItem(SUPPLIER_STORAGE_KEY);
  if (raw) {
    try { supplierState.orders = JSON.parse(raw); } catch { supplierState.orders = defaultSeedOrders; }
  } else {
    localStorage.setItem(SUPPLIER_STORAGE_KEY, JSON.stringify(defaultSeedOrders));
    supplierState.orders = defaultSeedOrders;
  }
}

function saveSupplierOrders() {
  localStorage.setItem(SUPPLIER_STORAGE_KEY, JSON.stringify(supplierState.orders));
}

function renderSupplierLogin() {
  setMain(`
    <div class="supplier-login-page">
      <div class="supplier-login-box">
        <div class="supplier-login-logo">
          <div class="supplier-logo-icon">${ICONS.truck}</div>
          <h1 style="font-size:1.875rem;font-weight:800;color:#fff;letter-spacing:-0.025em">Yetkazib Beruvchilar Paneli</h1>
          <p style="margin-top:0.5rem;font-size:0.875rem;color:#94a3b8">Bu sahifa faqat ruxsatli kuryerlar va ta'minotchilar uchun.</p>
        </div>

        <div class="supplier-login-card">
          <div style="display:flex;align-items:center;gap:0.5rem;font-size:0.75rem;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;color:var(--primary);margin-bottom:1.5rem">
            ${ICONS.lock} Tizimga kirish
          </div>

          <form id="supplier-login-form" style="display:flex;flex-direction:column;gap:1.25rem">
            <div>
              <label style="display:block;font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#94a3b8;margin-bottom:0.25rem">Foydalanuvchi nomi</label>
              <input id="supplier-username" type="text" required autocomplete="username" placeholder="courier" class="supplier-input" />
            </div>
            <div style="position:relative">
              <label style="display:block;font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#94a3b8;margin-bottom:0.25rem">Parol</label>
              <div style="position:relative">
                <input id="supplier-password" type="password" required autocomplete="current-password" placeholder="••••••••" class="supplier-input" style="padding-right:3rem" />
                <button type="button" id="toggle-password" style="position:absolute;right:0.875rem;top:50%;transform:translateY(-50%);color:#64748b;background:none;border:none;cursor:pointer;display:flex">
                  ${ICONS.eye}
                </button>
              </div>
            </div>

            <div id="supplier-error" style="display:none" class="supplier-error"></div>

            <button type="submit" class="btn-supplier-login" id="supplier-login-btn" ${supplierState.loading ? "disabled" : ""}>
              ${supplierState.loading
                ? `<span class="supplier-spinner"></span> Tekshirilmoqda...`
                : `${ICONS.lock} Kirish`
              }
            </button>
          </form>

          <div style="margin-top:1.5rem;text-align:center">
            <a href="#/" style="display:inline-flex;align-items:center;gap:0.375rem;font-size:0.75rem;font-weight:700;color:#64748b;transition:color 150ms">
              ${ICONS.arrowLeft} Asosiy saytga qaytish
            </a>
          </div>
        </div>

        <p style="margin-top:1.25rem;text-align:center;font-size:0.6875rem;color:#334155">
          Ruxsatsiz kirish urinishlari qayd etiladi va tekshiriladi.
        </p>
      </div>
    </div>
  `);

  $("toggle-password").addEventListener("click", () => {
    const inp = $("supplier-password");
    inp.type = inp.type === "password" ? "text" : "password";
    $("toggle-password").innerHTML = inp.type === "password" ? ICONS.eye : ICONS.eyeOff;
  });

  $("supplier-login-form").addEventListener("submit", e => {
    e.preventDefault();
    const uname = $("supplier-username").value.trim().toLowerCase();
    const pass = $("supplier-password").value;
    const errEl = $("supplier-error");
    const btn = $("supplier-login-btn");

    btn.disabled = true;
    btn.innerHTML = `<span class="supplier-spinner"></span> Tekshirilmoqda...`;

    setTimeout(() => {
      if (uname === SUPPLIER_USERNAME && pass === SUPPLIER_PASSWORD) {
        localStorage.setItem(SUPPLIER_AUTH_KEY, "true");
        loadSupplierOrders();
        renderSupplierDashboard();
      } else {
        errEl.textContent = "Login yoki parol noto'g'ri. Faqat ruxsat berilgan kuryerlar kirishi mumkin.";
        errEl.style.display = "block";
        btn.disabled = false;
        btn.innerHTML = `${ICONS.lock} Kirish`;
      }
    }, 700);
  });
}

function renderSupplierDashboard() {
  const orders = supplierState.orders;
  const delivered = orders.filter(o => o.status === "Yetkazib berildi ✅");
  const deliveredCount = delivered.length;
  const remainingCount = orders.length - deliveredCount;
  const totalRevenue = delivered.reduce((s, o) => s + o.totalPrice, 0);

  setMain(`
    <div class="supplier-portal">
      <!-- Nav -->
      <header class="supplier-nav">
        <div class="supplier-nav-inner">
          <div class="supplier-nav-brand">
            <span class="supplier-nav-icon">${ICONS.truck}</span>
            <div>
              <h1 style="font-size:1.125rem;font-weight:800;letter-spacing:-0.025em">Yetkazib Beruvchilar Paneli</h1>
              <p style="font-size:0.75rem;color:#94a3b8">Kuryer: courier</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <a href="#/" style="display:flex;align-items:center;gap:0.5rem;border-radius:0.75rem;border:1px solid #334155;padding:0.5rem 1rem;font-size:0.75rem;font-weight:700;color:#cbd5e1;transition:background 150ms" onmouseover="this.style.background='#1e293b'" onmouseout="this.style.background='none'">
              ${ICONS.arrowLeft} Asosiy sayt
            </a>
            <button id="supplier-logout-btn" style="display:flex;align-items:center;gap:0.5rem;border-radius:0.75rem;border:1px solid color-mix(in oklch,#ef4444 50%,transparent);padding:0.5rem 1rem;font-size:0.75rem;font-weight:700;color:#f87171;background:none;cursor:pointer;transition:background 150ms">
              ${ICONS.logOut} Chiqish
            </button>
          </div>
        </div>
      </header>

      <main style="max-width:72rem;margin:0 auto;padding:2rem 1.5rem;display:flex;flex-direction:column;gap:2rem">
        <!-- Stats -->
        <div class="supplier-stats">
          <div class="stat-card">
            <div class="stat-label"><span style="color:#60a5fa">${ICONS.package}</span> Jami Buyurtmalar</div>
            <p class="stat-value" style="color:#fff">${orders.length} ta</p>
          </div>
          <div class="stat-card">
            <div class="stat-label"><span style="color:#34d399">${ICONS.checkCircle}</span> Yetkazib Berildi</div>
            <p class="stat-value" style="color:#34d399">${deliveredCount} ta</p>
          </div>
          <div class="stat-card">
            <div class="stat-label"><span style="color:#fbbf24">${ICONS.clock}</span> Qolgan</div>
            <p class="stat-value" style="color:#fbbf24">${remainingCount} ta</p>
          </div>
          <div class="stat-card">
            <div class="stat-label"><span style="color:var(--primary)">${ICONS.dollarSign}</span> Jami Daromad</div>
            <p class="stat-value" style="color:var(--primary)">$ ${totalRevenue}</p>
          </div>
        </div>

        <!-- Orders -->
        <section>
          <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #1e293b;padding-bottom:0.75rem;margin-bottom:1rem">
            <h2 style="font-size:1.25rem;font-weight:800">Tushgan Buyurtmalar</h2>
            <span style="font-size:0.75rem;color:#64748b">Kartani bosib manzilni ko'ring</span>
          </div>

          ${orders.length === 0 ? `
            <div style="border-radius:1rem;border:1px dashed #1e293b;padding:3rem;text-align:center;color:#475569">
              Hali buyurtmalar kelmadi. Asosiy saytdan buyurtma berilganda bu yerda ko'rinadi.
            </div>
          ` : `<div id="orders-list" style="display:flex;flex-direction:column;gap:1rem">
            ${orders.map(order => renderOrderCard(order)).join("")}
          </div>`}
        </section>
      </main>
    </div>
  `);

  $("supplier-logout-btn").addEventListener("click", () => {
    localStorage.removeItem(SUPPLIER_AUTH_KEY);
    navigate("/supplier");
  });

  attachOrderEvents();

  // Listen for new orders
  window.addEventListener("cookpal_order_created", () => {
    loadSupplierOrders();
    const ordList = $("orders-list");
    if (ordList) ordList.innerHTML = supplierState.orders.map(o => renderOrderCard(o)).join("");
    attachOrderEvents();
  });
}

function renderOrderCard(order) {
  const isExpanded = supplierState.expandedId === order.id;
  const isDelivered = order.status === "Yetkazib berildi ✅";
  return `
    <div class="order-card ${isDelivered ? "delivered" : ""}" data-order-id="${order.id}">
      <div class="order-card-header">
        <img src="${order.recipeImage}" alt="${escHtml(order.recipeTitle)}" />
        <div style="flex:1;min-width:0">
          <div class="order-id-date">
            <span>${escHtml(order.id)}</span>
            <span>•</span>
            <span>${escHtml(order.createdAt)}</span>
          </div>
          <h3 class="order-title">${escHtml(order.recipeTitle)}</h3>
          <p class="order-qty">Miqdor: <strong>${order.quantity} ta</strong> ($ ${order.unitPrice} / dona)</p>
        </div>
        <div class="order-right">
          <span class="order-price">$ ${order.totalPrice}</span>
          <span class="order-status ${isDelivered ? "delivered" : "pending"}">${escHtml(order.status)}</span>
        </div>
        <div class="order-chevron">${isExpanded ? ICONS.chevronUp : ICONS.chevronDown}</div>
      </div>

      ${isExpanded ? `
        <div class="order-detail">
          <div class="order-detail-grid">
            <div class="order-info-card">
              <div class="order-info-label">${ICONS.mapPin} Yetkazib berish manzili</div>
              <p style="font-size:0.875rem;font-weight:700;color:#fff">${escHtml(order.address)}</p>
            </div>
            <div class="order-info-card">
              <div class="order-info-label">${ICONS.phone} Buyurtmachi</div>
              <p style="font-size:0.875rem;font-weight:700;color:#fff">${escHtml(order.customerName)}</p>
              <p style="font-size:0.75rem;font-family:monospace;color:#94a3b8">${escHtml(order.phone)}</p>
            </div>
            <div class="order-info-card">
              <div class="order-info-label">${ICONS.creditCard} To'lov</div>
              <p style="font-size:0.875rem;font-weight:700;color:#fff">${escHtml(order.paymentMethod)}</p>
              ${order.cardNumber ? `<p style="font-size:0.75rem;font-family:monospace;color:#94a3b8">${escHtml(order.cardNumber)}</p>` : ""}
            </div>
          </div>
          ${!isDelivered ? `
            <div style="display:flex;justify-content:flex-end;padding-top:0.25rem">
              <button class="btn-delivered" data-deliver="${order.id}">
                ${ICONS.checkCircle} Yetkazib berildi — $ ${order.totalPrice} daromadga qo'shilsin
              </button>
            </div>
          ` : `
            <div style="display:flex;align-items:center;justify-content:flex-end;gap:0.375rem;font-size:0.75rem;font-weight:700;color:#34d399">
              ${ICONS.checkCircle} Yetkazib berilgan — $ ${order.totalPrice} daromadga o'tgan.
            </div>
          `}
        </div>
      ` : ""}

      ${!isExpanded && !isDelivered ? `
        <div class="order-quick-bar">
          <span style="font-size:0.75rem;color:#475569;font-weight:700">📍 Manzilni ko'rish uchun kartani bosing</span>
          <button class="btn-delivered-quick" data-deliver="${order.id}">
            ${ICONS.checkCircle} Yetkazib berildi ($ ${order.totalPrice})
          </button>
        </div>
      ` : ""}
    </div>
  `;
}

function attachOrderEvents() {
  document.querySelectorAll(".order-card[data-order-id]").forEach(card => {
    card.addEventListener("click", e => {
      if (e.target.closest("button[data-deliver]")) return;
      const id = card.dataset.orderId;
      supplierState.expandedId = supplierState.expandedId === id ? null : id;
      const ordList = $("orders-list");
      if (ordList) ordList.innerHTML = supplierState.orders.map(o => renderOrderCard(o)).join("");
      attachOrderEvents();
    });
  });

  document.querySelectorAll("button[data-deliver]").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const id = btn.dataset.deliver;
      supplierState.orders = supplierState.orders.map(o =>
        o.id === id ? { ...o, status: "Yetkazib berildi ✅" } : o
      );
      saveSupplierOrders();
      renderSupplierDashboard();
    });
  });
}

// ── 404 ──
function render404() {
  document.title = "404 — Cookpal";
  setMain(`
    <div class="not-found">
      <div class="not-found-box">
        <h1>404</h1>
        <h2>Page not found</h2>
        <p class="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
        <div class="mt-6">
          <a href="#/" style="display:inline-flex;align-items:center;justify-content:center;border-radius:var(--radius);background:var(--primary);padding:0.5rem 1rem;font-size:0.875rem;font-weight:500;color:var(--primary-foreground);transition:opacity 150ms">Go home</a>
        </div>
      </div>
    </div>
  `);
}

// ─── App Bootstrap ────────────────────────────────────────────────────────────
function refresh() {
  const isSupplier = (window.location.hash.slice(1) || "/") === "/supplier";
  if (!isSupplier) {
    renderHeader();
    renderFooter();
  }
  Router.dispatch();
}

// Setup router
Router
  .add("/", () => renderHome())
  .add("/explore", ({ params }) => renderExplore({ params }))
  .add("/recipe/:recipeId", ({ routeParams }) => renderRecipeDetail({ routeParams }))
  .add("/auth", ({ params }) => renderAuth({ params }))
  .add("/profile", () => renderProfile())
  .add("/help", () => renderHelp())
  .add("/hashtags", ({ params }) => renderHashtags({ params }))
  .add("/supplier", () => renderSupplier());

// Listen for hash changes
window.addEventListener("hashchange", () => {
  window.scrollTo(0, 0);
  refresh();
});

// Initial render
window.addEventListener("DOMContentLoaded", () => {
  if (!window.location.hash) window.location.hash = "#/";
  refresh();
});
