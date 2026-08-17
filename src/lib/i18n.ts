// ─── Cookpal i18n — O'zbek / Русский / English ───────────────────────────────

export type Lang = "uz" | "ru" | "en";

export const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "uz", label: "O'zbekcha", flag: "🇺🇿" },
  { code: "ru", label: "Русский",   flag: "🇷🇺" },
  { code: "en", label: "English",   flag: "🇬🇧" },
];

const translations = {
  // ── Header top bar ──────────────────────────────────────────────────────────
  nav_community:    { uz: "Jamiyat",     ru: "Сообщество",  en: "Community"    },
  nav_books:        { uz: "Taomlar",     ru: "Блюда",       en: "Dishes"        },
  nav_recipe_index: { uz: "Retseptlar",  ru: "Рецепты",     en: "Recipe Index" },
  nav_popular:      { uz: "Mashhur",     ru: "Популярные",  en: "Popular"      },
  nav_suppliers:    { uz: "Ta'minotchi", ru: "Поставщики",  en: "Suppliers"    },
  light_mode:       { uz: "Yorug' rejim",ru: "Светлый",     en: "Light Mode"   },
  dark_mode:        { uz: "Tungi rejim", ru: "Тёмный",      en: "Dark Mode"    },
  register:         { uz: "Ro'yxatdan o'tish", ru: "Регистрация", en: "Register" },
  login:            { uz: "Kirish",      ru: "Войти",       en: "Login"        },
  logout:           { uz: "Chiqish",     ru: "Выйти",       en: "Logout"       },

  // ── Header main bar ─────────────────────────────────────────────────────────
  search_placeholder: { uz: "Retsept qidirish...", ru: "Поиск рецептов...", en: "Search recipes..." },
  search_btn:         { uz: "Qidirish",            ru: "Поиск",             en: "Search"            },
  all_categories:     { uz: "Barcha toifalar",     ru: "Все категории",     en: "All Categories"    },
  search_see_all:     { uz: "Barcha natijalarni ko'rish", ru: "Показать все результаты", en: "See all results" },
  add_recipe:         { uz: "Retsept qo'shish",    ru: "Добавить рецепт",   en: "Add Recipe"        },

  // ── User menu ───────────────────────────────────────────────────────────────
  profile:            { uz: "Profil",              ru: "Профиль",           en: "Profile"           },
  privacy:            { uz: "Maxfiylik",           ru: "Конфиденциальность",en: "Privacy"           },
  collections:        { uz: "To'plamlar",          ru: "Коллекции",         en: "Collections"       },
  settings:           { uz: "Sozlamalar",          ru: "Настройки",         en: "Settings"          },

  // ── Notifications ───────────────────────────────────────────────────────────
  notifications:      { uz: "Bildirishnomalar",    ru: "Уведомления",       en: "Notifications"     },
  mark_all_read:      { uz: "Barchasini o'qildi",  ru: "Прочитать всё",     en: "Mark all read"     },
  no_notifications:   { uz: "Bildirishnomalar yo'q", ru: "Нет уведомлений", en: "No notifications"  },

  // ── Cart ────────────────────────────────────────────────────────────────────
  cart:               { uz: "Savatcha",            ru: "Корзина",           en: "Cart"              },
  cart_empty:         { uz: "Savatchangiz bo'sh",  ru: "Корзина пуста",     en: "Your cart is empty"},
  cart_empty_hint:    { uz: "Retseptlarni ko'rib, savatcha tugmasini bosing.", ru: "Просмотрите рецепты и добавьте товары в корзину.", en: "Browse recipes and add items to your cart." },
  cart_items:         { uz: "ta mahsulot",         ru: "товаров",           en: "items"             },
  total:              { uz: "Jami summa:",         ru: "Итого:",            en: "Total:"             },
  order_now:          { uz: "Buyurtma berish",     ru: "Заказать",          en: "Order Now"         },
  remove:             { uz: "O'chirish",           ru: "Удалить",           en: "Remove"            },

  // ── Filter Sidebar ──────────────────────────────────────────────────────────
  filter_recipes:     { uz: "Filtr",               ru: "Фильтр",            en: "Filter Recipes"    },
  filter_clear:       { uz: "Tozalash",            ru: "Очистить",          en: "Clear"             },
  filter_clear_all:   { uz: "Filtrlarni tozalash", ru: "Сбросить фильтры",  en: "Clear Filters"     },

  // ── Home page ───────────────────────────────────────────────────────────────
  home:               { uz: "Bosh sahifa",         ru: "Главная",           en: "Home"              },
  help:               { uz: "Yordam",              ru: "Помощь",            en: "Help"              },
  hashtags:           { uz: "Xeshteglar",          ru: "Хештеги",           en: "Hashtags"          },
  supplier_portal:    { uz: "Ta'minotchi portali", ru: "Портал поставщиков",en: "Supplier Portal"   },
  see_all:            { uz: "Barchasini ko'rish",  ru: "Смотреть все",      en: "See all"           },
  results:            { uz: "Natijalar",           ru: "Результаты",        en: "Results"           },
  no_results:         { uz: "Hech narsa topilmadi",ru: "Ничего не найдено", en: "No results found"  },
  no_results_hint:    { uz: "Boshqa filtr kombinatsiyasini sinab ko'ring.", ru: "Попробуйте другие фильтры.", en: "Try a different filter combination." },
  recipes_shown:      { uz: "retsept ko'rsatildi", ru: "рецептов показано", en: "recipes shown"     },
  more:               { uz: "Ko'proq",             ru: "Подробнее",         en: "More"              },

  // ── Auth page ────────────────────────────────────────────────────────────────
  auth_subtitle:      { uz: "Ma'lumotlar shu brauzerda saqlanadi, keyingi kirishda profilingiz joyida qoladi.", ru: "Данные сохраняются в браузере, при следующем входе ваш профиль останется.", en: "Your data is saved in this browser, your profile will be here next time." },
  username:           { uz: "Foydalanuvchi nomi",  ru: "Имя пользователя",  en: "Username"          },
  email:              { uz: "Elektron pochta",      ru: "Электронная почта", en: "Email"             },
  password:           { uz: "Parol",                ru: "Пароль",            en: "Password"          },
  create_account:     { uz: "Akkaunt yaratish",     ru: "Создать аккаунт",   en: "Create account"    },
  sign_in:            { uz: "Kirish",               ru: "Войти",             en: "Sign in"           },
  have_account:       { uz: "Akkauntingiz bormi?",  ru: "Уже есть аккаунт?", en: "Already have an account?" },
  no_account:         { uz: "Akkauntingiz yo'qmi?", ru: "Нет аккаунта?",     en: "Don't have an account?" },
  featured_recipes:   { uz: "Tavsiya etilgan retseptlar", ru: "Рекомендуемые рецепты", en: "Featured Recipes" },

  // ── Footer ───────────────────────────────────────────────────────────────────
  all_rights:         { uz: "Barcha huquqlar himoyalangan", ru: "Все права защищены", en: "All Rights Reserved" },
  newsletter:         { uz: "Yangiliklarga obuna",  ru: "Подпишитесь на новости", en: "Join Our Newsletter" },
  email_placeholder:  { uz: "Elektron pochta",      ru: "Электронная почта", en: "Email"             },
  footer_recipes:     { uz: "Yangi retseptlar",     ru: "Свежие рецепты",    en: "Fresh Recipe"      },
  footer_news:        { uz: "Yangiliklar",          ru: "Новости",           en: "In News"           },
  footer_about:       { uz: "Biz haqimizda",        ru: "О нас",             en: "About Us"          },

  // ── General ─────────────────────────────────────────────────────────────────
  language:           { uz: "Til",                  ru: "Язык",              en: "Language"          },
  close:              { uz: "Yopish",               ru: "Закрыть",           en: "Close"             },
  not_found:          { uz: "Sahifa topilmadi",     ru: "Страница не найдена", en: "Page not found"  },
  go_home:            { uz: "Bosh sahifaga",        ru: "На главную",        en: "Go home"           },
  error_title:        { uz: "Sahifa yuklanmadi",    ru: "Страница не загрузилась", en: "This page didn't load" },
  error_hint:         { uz: "Xatolik yuz berdi. Qayta urinib ko'ring.", ru: "Что-то пошло не так. Попробуйте снова.", en: "Something went wrong. Try refreshing." },
  try_again:          { uz: "Qayta urinish",        ru: "Попробовать снова", en: "Try again"         },

  // ── Add Recipe & My Works ───────────────────────────────────────────────────
  my_works:           { uz: "Mening ishlarim",      ru: "Мои работы",        en: "My Works"          },
  my_recipes:         { uz: "Mening retseptlarim",  ru: "Мои рецепты",       en: "My Recipes"        },
  no_my_recipes:      { uz: "Siz hali retsept qo'shmadingiz", ru: "Вы еще не добавили рецепты", en: "You haven't added any recipes yet" },
  no_my_recipes_hint: { uz: "Yangi taom yaratish uchun 'Retsept qo'shish' tugmasini bosing.", ru: "Нажмите 'Добавить рецепт', чтобы создать новый.", en: "Click 'Add Recipe' to create a new one." },
  add_new_recipe:     { uz: "Yangi retsept qo'shish", ru: "Добавить новый рецепт", en: "Add New Recipe" },
  create_recipe:      { uz: "Retsept yaratish",     ru: "Создать рецепт",    en: "Create Recipe"     },
  recipe_name:        { uz: "Taom nomi",            ru: "Название блюда",    en: "Dish Name"         },
  recipe_desc:        { uz: "Qisqacha ma'lumot",    ru: "Краткое описание",  en: "Short Description" },
  recipe_image:       { uz: "Taom rasmi",           ru: "Фото блюда",        en: "Dish Photo"        },
  calories_info:      { uz: "Kalloriya va ozuqaviy qiymat", ru: "Калории и питательность", en: "Calories & Nutrition" },
  prep_steps:         { uz: "Tayyorlash bosqichlari", ru: "Шаги приготовления", en: "Preparation Steps" },
  ingredients:        { uz: "Masalliqlar",          ru: "Ингредиенты",       en: "Ingredients"       },
  recipe_success:     { uz: "Retsept muvaffaqiyatli qo'shildi!", ru: "Рецепт успешно добавлен!", en: "Recipe successfully added!" },
  delete_recipe:      { uz: "O'chirish",            ru: "Удалить",           en: "Delete"            },
  recipe_deleted:     { uz: "Retsept o'chirildi",   ru: "Рецепт удален",     en: "Recipe deleted"    },
} as const;

export type TranslationKey = keyof typeof translations;

export function translate(key: TranslationKey, lang: Lang): string {
  return translations[key]?.[lang] ?? translations[key]?.["en"] ?? key;
}
