import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef, type ChangeEvent } from "react";
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  Upload,
  Flame,
  Clock,
  DollarSign,
  ChefHat,
  Sparkles,
  Check,
  Eye,
  Heart,
  Star,
  MessageCircle,
  ThumbsUp,
  Link as LinkIcon,
  Grid,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n-context";

// Sample photos available in assets
import thaiTofu from "@/assets/thai-basil-tofu.png";
import kungPao from "@/assets/kung-pao.jpg";
import mexicanChicken from "@/assets/mexican-chicken.jpg";
import eggWhite from "@/assets/egg-white-bites.jpg";
import greekFaro from "@/assets/greek-faro.jpg";
import mediterranean from "@/assets/mediterranean.jpg";
import cookies from "@/assets/cookies.jpg";
import cupcake from "@/assets/cupcake.jpg";
import asianTeriyaki from "@/assets/asian-teriyaki-bowl.png";
import tomYumGoong from "@/assets/thai-tom-yum-goong.png";
import matchaTart from "@/assets/matcha-green-tea-tart.png";

const SAMPLE_GALLERY = [
  { label: "O'zbekcha Palov / Go'shtli", src: mexicanChicken },
  { label: "Qovurilgan Tofu & Sabzavot", src: thaiTofu },
  { label: "Kung Pao Tovuq", src: kungPao },
  { label: "Osiyo Teriyaki Bowl", src: asianTeriyaki },
  { label: "O'rta yer dengizi salati", src: mediterranean },
  { label: "Yunoncha Faro & Pishiriq", src: greekFaro },
  { label: "Tuxumli pishiriq", src: eggWhite },
  { label: "Tom Yum sho'rva", src: tomYumGoong },
  { label: "Matcha Deserti", src: matchaTart },
  { label: "Shokoladli pishiriq", src: cookies },
  { label: "Keks / Kapkeyk", src: cupcake },
];

const CUISINES = [
  "O'zbek",
  "Italiya",
  "Turk",
  "Osiyo",
  "Yevropa",
  "Meksika",
  "Gruzin",
  "Arab",
  "American",
];

const DIET_OPTIONS = [
  "Halol",
  "Dairy Free",
  "Gluten Free",
  "Sugar Free",
  "Vegetarian",
  "Vegan",
  "Low Carb",
  "Keto",
];

const GOAL_OPTIONS = [
  "Weight loss",
  "Freshness",
  "Muscle gain",
  "Healthy Eating",
  "Quick & Easy",
  "Family Dinner",
];

const QUICK_INGREDIENTS = [
  "500g Guruch",
  "400g Go'sht",
  "2 dona Piyoz",
  "3 dona Sabzi",
  "100ml O'simlik yog'i",
  "Tuz va ziravorlar",
  "2 dona Pomidor",
  "3 dona Tuxum",
  "200ml Sut",
  "300g Un",
  "2 tish Sarimsoq",
  "Ko'katlar",
];

export const Route = createFileRoute("/add-recipe")({
  head: () => ({
    meta: [
      { title: "Yangi retsept qo'shish — Cookpal" },
      {
        name: "description",
        content: "Cookpal platformasiga o'z retseptingizni qo'shing va oshpazlar jamoasi bilan ulashing.",
      },
    ],
  }),
  component: AddRecipePage,
});

function AddRecipePage() {
  const { user, addCustomRecipe, addNotification } = useStore();
  const { t } = useI18n();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cuisine, setCuisine] = useState("O'zbek");
  const [section, setSection] = useState<"Cusines" | "Diet" | "Bakery">("Cusines");
  const [price, setPrice] = useState<number>(18);
  const [minutes, setMinutes] = useState<number>(35);
  const [difficulty, setDifficulty] = useState("O'rtacha");

  // Image states
  const [image, setImage] = useState<string>(SAMPLE_GALLERY[0].src);
  const [imageTab, setImageTab] = useState<"gallery" | "upload" | "url">("gallery");
  const [customUrl, setCustomUrl] = useState("");

  // Nutrition states (Calories & Macros)
  const [calories, setCalories] = useState("450 kkal");
  const [protein, setProtein] = useState("24g");
  const [fat, setFat] = useState("16g");
  const [carbs, setCarbs] = useState("50g");

  // Ingredients state
  const [ingredients, setIngredients] = useState<string[]>([
    "500g guruch",
    "400g lahm go'sht",
    "3 dona sabzi",
    "2 dona piyoz",
    "100ml o'simlik yog'i",
    "Ta'bga ko'ra tuz, zira va murch",
  ]);
  const [newIngredient, setNewIngredient] = useState("");

  // Steps state
  const [steps, setSteps] = useState<string[]>([
    "Qozonda o'simlik yog'ini qizdirib, go'shtni qizarguncha baland olovda qovuring.",
    "Piyozni to'g'rab qo'shing va oltin rangga kirguncha birga qovurishni davom eting.",
    "Somoncha to'g'ralgan sabzini solib, ziravorlarni qo'shing va 10-15 daqiqa dimlang.",
    "Yuvilgan guruchni tekis qilib yoyib, qaynoq suv quying va suvini tortgach 20 daqiqa damlang.",
  ]);
  const [newStep, setNewStep] = useState("");

  // Tags
  const [selectedDiets, setSelectedDiets] = useState<string[]>(["Halol"]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(["Freshness", "Family Dinner"]);
  const [customHashtags, setCustomHashtags] = useState("#mazzali #taom #uyda_pishiramiz");

  // Preview tab on mobile
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Handle file upload
  function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Faqat rasm fayllarini yuklash mumkin (.jpg, .png, .webp).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Rasm hajmi 5MB dan oshmasligi kerak.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        setImage(event.target.result);
        setErrorMsg("");
      }
    };
    reader.readAsDataURL(file);
  }

  function handleAddIngredient() {
    if (!newIngredient.trim()) return;
    setIngredients((prev) => [...prev, newIngredient.trim()]);
    setNewIngredient("");
  }

  function handleRemoveIngredient(index: number) {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  }

  function handleAddStep() {
    if (!newStep.trim()) return;
    setSteps((prev) => [...prev, newStep.trim()]);
    setNewStep("");
  }

  function handleRemoveStep(index: number) {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  }

  function toggleDiet(diet: string) {
    setSelectedDiets((prev) =>
      prev.includes(diet) ? prev.filter((d) => d !== diet) : [...prev, diet]
    );
  }

  function toggleGoal(goal: string) {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (!title.trim()) {
      setErrorMsg("Iltimos, taom nomini kiriting.");
      return;
    }

    if (ingredients.length === 0) {
      setErrorMsg("Kamida bitta masalliq qo'shing.");
      return;
    }

    if (steps.length === 0) {
      setErrorMsg("Kamida bitta tayyorlash bosqichini qo'shing.");
      return;
    }

    setIsSubmitting(true);

    const nutritionList = [
      { label: "Kalloriya", value: calories || "400 kkal" },
      { label: "Oqsil (Protein)", value: protein || "20g" },
      { label: "Yog' (Fat)", value: fat || "15g" },
      { label: "Uglevod (Carbs)", value: carbs || "45g" },
    ];

    const parsedHashtags = customHashtags
      .split(/[\s,]+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .map((t) => (t.startsWith("#") ? t : `#${t}`));

    const created = addCustomRecipe({
      title: title.trim(),
      description:
        description.trim() ||
        `${cuisine} oshxonasiga mansub nihoyatda mazali va to'yimli ${title} taomi.`,
      image: image || SAMPLE_GALLERY[0].src,
      cuisine,
      section,
      price: Number(price) || 15,
      minutes: Number(minutes) || 30,
      difficulty,
      nutrition: nutritionList,
      ingredients,
      steps,
      diet: selectedDiets,
      allergies: [],
      goals: selectedGoals,
      hashtags: parsedHashtags,
      comments: 0,
      likes: 1,
      rating: 5,
    });

    addNotification(`"${created.title}" retsepti profilingizga muvaffaqiyatli qo'shildi!`, "success");

    // Redirect to profile with newly added recipe
    setTimeout(() => {
      navigate({ to: "/profile" });
    }, 400);
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Banner */}
      <div className="border-b border-border bg-gradient-to-b from-primary/10 via-background to-background py-8 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <nav className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
            <Link to="/" className="hover:text-primary transition-colors">
              {t("home")}
            </Link>{" "}
            /{" "}
            <Link to="/explore" className="hover:text-primary transition-colors">
              {t("nav_recipe_index")}
            </Link>{" "}
            / <span className="text-primary font-extrabold">{t("add_recipe")}</span>
          </nav>

          <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="script-title text-3xl sm:text-4xl text-primary block">
                O'z retseptingizni yarating
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-1">
                Yangi taom va retsept qo'shish
              </h1>
              <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                Taom nomi, rasmi, kalloriyasi, masalliqlari va bosqichlarini kiriting. Qo'shilgan
                retsept profilingizdagi <strong>"Mening ishlarim"</strong> bo'limida saqlanadi.
              </p>
            </div>

            {/* Mobile View Toggle */}
            <div className="flex items-center gap-2 lg:hidden bg-secondary/80 p-1.5 rounded-xl border border-border self-start">
              <button
                type="button"
                onClick={() => setActiveTab("form")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === "form"
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <ChefHat className="size-4" /> Forma
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === "preview"
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Eye className="size-4" /> Jonli ko'rish
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-8">
        {errorMsg && (
          <div className="mb-6 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm font-bold text-destructive animate-in fade-in flex items-center gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-destructive text-white text-xs font-black">
              !
            </span>
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          {/* LEFT: FORM COLUMN */}
          <div className={activeTab === "preview" ? "hidden lg:block" : "block"}>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* SECTION 1: Asosiy ma'lumotlar */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                  <ChefHat className="size-5 text-primary" />
                  <h2 className="text-lg font-extrabold tracking-tight">
                    1. Asosiy ma'lumotlar
                  </h2>
                </div>

                {/* Taom nomi */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Taom nomi <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Masalan: Maxsus O'zbekcha Palov, Somsa, Lag'mon..."
                    className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm font-semibold outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Taom haqida qisqacha tavsif */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Taom haqida qisqacha ma'lumot
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Taomning o'ziga xosligi, ta'mi va afzalliklari haqida yozing..."
                    className="w-full rounded-xl border border-input bg-background p-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Oshxona va Kategoriya */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Oshxona turi
                    </label>
                    <select
                      value={cuisine}
                      onChange={(e) => setCuisine(e.target.value)}
                      className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-semibold outline-none focus:border-primary"
                    >
                      {CUISINES.map((c) => (
                        <option key={c} value={c}>
                          {c} oshxonasi
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Kategoriya
                    </label>
                    <div className="grid grid-cols-3 gap-1.5 h-11 bg-secondary/60 p-1 rounded-xl border border-border">
                      {(["Cusines", "Diet", "Bakery"] as const).map((sec) => (
                        <button
                          key={sec}
                          type="button"
                          onClick={() => setSection(sec)}
                          className={`rounded-lg text-xs font-extrabold transition-all capitalize ${
                            section === sec
                              ? "bg-primary text-primary-foreground shadow"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {sec === "Cusines" ? "Taomlar" : sec === "Diet" ? "Parhez" : "Non/Pishiriq"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Vaqt, Narx va Qiyinchilik */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                      <Clock className="inline size-3.5 mr-1 text-primary" /> Vaqt (daqiqa)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={480}
                      value={minutes}
                      onChange={(e) => setMinutes(Number(e.target.value))}
                      className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-bold outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                      <DollarSign className="inline size-3.5 mr-1 text-price" /> Taxminiy narx ($)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-bold outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Qiyinchilik
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-semibold outline-none focus:border-primary"
                    >
                      <option value="Oson">Oson (Easy)</option>
                      <option value="O'rtacha">O'rtacha (Medium)</option>
                      <option value="Qiyin">Qiyin (Hard)</option>
                      <option value="Super Dry">Super Dry</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Taom rasmi */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="size-5 text-primary" />
                    <h2 className="text-lg font-extrabold tracking-tight">
                      2. Taom rasmi
                    </h2>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">
                    Ko'rinish uchun muhim
                  </span>
                </div>

                {/* Image Selection Mode Tabs */}
                <div className="flex gap-2 border-b border-border pb-3 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setImageTab("gallery")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                      imageTab === "gallery"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-muted"
                    }`}
                  >
                    <Grid className="size-3.5" /> Tayyor galereyadan tanlash
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageTab("upload")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                      imageTab === "upload"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-muted"
                    }`}
                  >
                    <Upload className="size-3.5" /> Kompyuterdan yuklash
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageTab("url")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                      imageTab === "url"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-muted"
                    }`}
                  >
                    <LinkIcon className="size-3.5" /> URL havola
                  </button>
                </div>

                {/* Mode 1: Gallery */}
                {imageTab === "gallery" && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-3 font-medium">
                      O'zingizga yoqqan yuqori sifatli taom suratini bosing:
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto p-1">
                      {SAMPLE_GALLERY.map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => setImage(item.src)}
                          className={`group relative aspect-video overflow-hidden rounded-xl border-2 transition-all cursor-pointer ${
                            image === item.src
                              ? "border-primary ring-2 ring-primary/30 scale-[1.02]"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <img
                            src={item.src}
                            alt={item.label}
                            className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {image === item.src && (
                            <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                              <span className="flex size-6 items-center justify-center rounded-full bg-primary text-white">
                                <Check className="size-4 stroke-[3]" />
                              </span>
                            </div>
                          )}
                          <span className="absolute bottom-0 inset-x-0 bg-ink/80 text-[10px] text-white px-1 py-0.5 truncate text-center font-bold">
                            {item.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mode 2: Upload */}
                {imageTab === "upload" && (
                  <div className="space-y-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-secondary/30 p-8 text-center cursor-pointer transition-all hover:border-primary hover:bg-primary/5"
                    >
                      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
                        <Upload className="size-6" />
                      </div>
                      <p className="text-sm font-bold">Rasmni yuklash uchun bu yerni bosing</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG yoki WEBP (maksimal 5MB)
                      </p>
                    </div>
                  </div>
                )}

                {/* Mode 3: URL */}
                {imageTab === "url" && (
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      placeholder="https://example.com/rasm.jpg"
                      className="h-11 flex-1 rounded-xl border border-input bg-background px-4 text-sm font-semibold outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customUrl.trim()) setImage(customUrl.trim());
                      }}
                      className="rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground hover:bg-primary/90"
                    >
                      Qo'llash
                    </button>
                  </div>
                )}
              </div>

              {/* SECTION 3: Kalloriya va ozuqaviy qiymat */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                  <Flame className="size-5 text-orange-500" />
                  <h2 className="text-lg font-extrabold tracking-tight">
                    3. Kalloriya va ozuqaviy qiymat
                  </h2>
                </div>
                <p className="text-xs text-muted-foreground">
                  Foydalanuvchilar taomning sog'lomlik darajasini bilishi uchun ozuqaviy ma'lumotlarni kiriting:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-xl border border-border bg-secondary/40 p-3">
                    <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">
                      Kalloriya
                    </label>
                    <input
                      type="text"
                      value={calories}
                      onChange={(e) => setCalories(e.target.value)}
                      placeholder="450 kkal"
                      className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm font-extrabold text-primary outline-none focus:border-primary"
                    />
                  </div>

                  <div className="rounded-xl border border-border bg-secondary/40 p-3">
                    <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">
                      Oqsil (Protein)
                    </label>
                    <input
                      type="text"
                      value={protein}
                      onChange={(e) => setProtein(e.target.value)}
                      placeholder="25g"
                      className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm font-extrabold outline-none focus:border-primary"
                    />
                  </div>

                  <div className="rounded-xl border border-border bg-secondary/40 p-3">
                    <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">
                      Yog' (Fat)
                    </label>
                    <input
                      type="text"
                      value={fat}
                      onChange={(e) => setFat(e.target.value)}
                      placeholder="14g"
                      className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm font-extrabold outline-none focus:border-primary"
                    />
                  </div>

                  <div className="rounded-xl border border-border bg-secondary/40 p-3">
                    <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">
                      Uglevod (Carbs)
                    </label>
                    <input
                      type="text"
                      value={carbs}
                      onChange={(e) => setCarbs(e.target.value)}
                      placeholder="52g"
                      className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm font-extrabold outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: Masalliqlar */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <ChefHat className="size-5 text-primary" />
                    <h2 className="text-lg font-extrabold tracking-tight">
                      4. Masalliqlar (Ingredients)
                    </h2>
                  </div>
                  <span className="text-xs font-bold text-primary">
                    {ingredients.length} ta masalliq
                  </span>
                </div>

                {/* Input with Add button */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddIngredient();
                      }
                    }}
                    placeholder="Masalliq nomi va miqdorini yozing (masalan: 500g guruch)..."
                    className="h-11 flex-1 rounded-xl border border-input bg-background px-4 text-sm font-semibold outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={handleAddIngredient}
                    className="flex items-center gap-1.5 rounded-xl bg-primary px-4 text-xs font-extrabold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"
                  >
                    <Plus className="size-4" /> Qo'shish
                  </button>
                </div>

                {/* Quick Add Suggestions */}
                <div>
                  <span className="text-[11px] font-bold text-muted-foreground uppercase block mb-1.5">
                    Tezkor masalliqlar (bosing va qo'shing):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_INGREDIENTS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          if (!ingredients.includes(item)) {
                            setIngredients((prev) => [...prev, item]);
                          }
                        }}
                        className="rounded-full bg-secondary/80 border border-border px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground hover:border-primary hover:text-primary transition-colors"
                      >
                        + {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* List of Ingredients */}
                <div className="mt-3 space-y-2">
                  {ingredients.map((ing, idx) => (
                    <div
                      key={`${ing}-${idx}`}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-sm font-medium group hover:border-primary/40 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[11px] font-bold text-primary">
                          •
                        </span>
                        <span>{ing}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(idx)}
                        className="text-muted-foreground opacity-60 hover:opacity-100 hover:text-destructive transition-all"
                        title="O'chirish"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 5: Tayyorlash bosqichlari */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-5 text-primary" />
                    <h2 className="text-lg font-extrabold tracking-tight">
                      5. Tayyorlash bosqichlari (Steps)
                    </h2>
                  </div>
                  <span className="text-xs font-bold text-primary">
                    {steps.length} ta bosqich
                  </span>
                </div>

                {/* Input with Add button */}
                <div className="space-y-2">
                  <textarea
                    rows={2}
                    value={newStep}
                    onChange={(e) => setNewStep(e.target.value)}
                    placeholder="Yangi bosqich tavsifini yozing (masalan: Go'shtni to'g'rab qizigan qozonga soling...)"
                    className="w-full rounded-xl border border-input bg-background p-3 text-sm font-medium outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={handleAddStep}
                    className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-extrabold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"
                  >
                    <Plus className="size-4" /> Bosqichni qo'shish
                  </button>
                </div>

                {/* List of Steps */}
                <div className="space-y-3 pt-2">
                  {steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between gap-3 rounded-xl border border-border bg-secondary/30 p-3.5 text-sm group hover:border-primary/40 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-extrabold text-primary-foreground shadow-sm">
                          {idx + 1}
                        </span>
                        <p className="pt-0.5 leading-relaxed font-medium">{step}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveStep(idx)}
                        className="text-muted-foreground opacity-60 hover:opacity-100 hover:text-destructive transition-all pt-1"
                        title="O'chirish"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 6: Teglar va xususiyatlar */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-extrabold tracking-tight border-b border-border pb-3">
                  6. Parhez va maqsadlar (Teglar)
                </h2>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                    Parhez xususiyatlari (Diet)
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {DIET_OPTIONS.map((d) => {
                      const active = selectedDiets.includes(d);
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => toggleDiet(d)}
                          className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                            active
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "bg-secondary text-secondary-foreground hover:bg-muted"
                          }`}
                        >
                          {active ? "✓ " : "+ "}
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                    Maqsadlar (Goals)
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {GOAL_OPTIONS.map((g) => {
                      const active = selectedGoals.includes(g);
                      return (
                        <button
                          key={g}
                          type="button"
                          onClick={() => toggleGoal(g)}
                          className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                            active
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "bg-secondary text-secondary-foreground hover:bg-muted"
                          }`}
                        >
                          {active ? "✓ " : "+ "}
                          {g}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Xeshteglar (Hashtags)
                  </label>
                  <input
                    type="text"
                    value={customHashtags}
                    onChange={(e) => setCustomHashtags(e.target.value)}
                    placeholder="#milliy #oshxona #retsept"
                    className="h-11 w-full rounded-xl border border-input bg-background px-4 text-sm font-semibold outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Submit Action Bar */}
              <div className="sticky bottom-4 z-20 flex items-center justify-between gap-4 rounded-2xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur-md">
                <div className="text-xs text-muted-foreground">
                  <span className="font-bold text-foreground">Tayyormisiz?</span> Retsept darhol
                  Cookpal-da faollashadi.
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  <ChefHat className="size-5" />
                  <span>{isSubmitting ? "Saqlanmoqda..." : "Retseptni e'lon qilish"}</span>
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: LIVE PREVIEW COLUMN */}
          <div className={activeTab === "form" ? "hidden lg:block" : "block"}>
            <div className="sticky top-24 space-y-6">
              {/* Preview Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="size-4 text-primary" />
                  <span className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
                    Jonli ko'rinish (Live Preview)
                  </span>
                </div>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                  Karta va Profil
                </span>
              </div>

              {/* 1. Recipe Card Preview */}
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={image || SAMPLE_GALLERY[0].src}
                    alt={title || "Taom rasmi"}
                    className="size-full object-cover"
                  />
                  <span className="script-title absolute right-4 bottom-2 text-4xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    {cuisine}
                  </span>
                  <span className="absolute top-3 left-3 rounded-md bg-ink/80 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                    {section}
                  </span>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-extrabold leading-snug">
                      {title.trim() || "Taom nomi kiritilmagan"}
                    </h3>
                    <span className="rounded-md bg-primary px-2 py-0.5 text-xs font-black text-primary-foreground">
                      $ {price}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {description.trim() ||
                      "Taom haqida qisqacha ma'lumot shu yerda ko'rinadi..."}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground border-y border-border py-2">
                    <span className="flex items-center gap-1 font-semibold">
                      <Clock className="size-3.5 text-primary" /> {minutes} daqiqa
                    </span>
                    <span className="flex items-center gap-1 font-semibold">
                      <Flame className="size-3.5 text-orange-500" /> {calories || "450 kkal"}
                    </span>
                    <span className="font-bold text-foreground">{difficulty}</span>
                  </div>

                  {/* Nutrition pills preview */}
                  <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                    <div className="rounded-lg bg-secondary/80 p-1 font-bold">
                      <span className="block text-muted-foreground">Oqsil</span>
                      <span className="text-foreground">{protein}</span>
                    </div>
                    <div className="rounded-lg bg-secondary/80 p-1 font-bold">
                      <span className="block text-muted-foreground">Yog'</span>
                      <span className="text-foreground">{fat}</span>
                    </div>
                    <div className="rounded-lg bg-secondary/80 p-1 font-bold">
                      <span className="block text-muted-foreground">Uglevod</span>
                      <span className="text-foreground">{carbs}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {selectedDiets.map((d) => (
                      <span
                        key={d}
                        className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary"
                      >
                        {d}
                      </span>
                    ))}
                    {selectedGoals.map((g) => (
                      <span
                        key={g}
                        className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-bold text-secondary-foreground"
                      >
                        {g}
                      </span>
                    ))}
                  </div>

                  {/* Fake stats */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                    <span className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <MessageCircle className="size-3.5" /> 0
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="size-3.5" /> 1
                      </span>
                    </span>
                    <span className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="size-3.5 fill-foreground text-foreground" />
                      ))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-2">
                <div className="flex items-center gap-2 text-primary font-extrabold text-sm">
                  <ShieldCheck className="size-5" />
                  <span>Mening ishlarim kafolati</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Ushbu retsept saqlangach, profilingizdagi <strong>"Mening ishlarim"</strong> bo'limida
                  har doim ko'rinib turadi. Istalgan vaqtda uni ko'rishingiz, tahrirlashingiz yoki o'chirishingiz mumkin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
