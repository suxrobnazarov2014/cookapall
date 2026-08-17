import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-chicken.jpg";
import { FilterSidebar } from "@/components/FilterSidebar";
import { RecipeCard } from "@/components/RecipeCard";
import { useFilters } from "@/hooks/useFilters";
import { filterRecipes, recipes } from "@/lib/recipes";
import { Facebook, Youtube, Twitter, Instagram, HelpCircle, Tag, Truck } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";

export const Route = createFileRoute("/")(({
  head: () => ({
    meta: [
      { title: "Cookpal — Filter, Save & Cook Better Recipes" },
      {
        name: "description",
        content:
          "Browse Cookpal recipes by diet, allergies, cuisine and goals. Search, save favourites and read full step-by-step instructions.",
      },
      { property: "og:title", content: "Cookpal — Filter, Save & Cook Better Recipes" },
      {
        property: "og:description",
        content: "Diet, allergy and cuisine filters over hundreds of cook-ready recipes.",
      },
    ],
  }),
  component: Home,
}));

const sections = ["Cusines", "Diet", "Bakery"] as const;

function Home() {
  const { filters, toggle, clear } = useFilters();
  const { t } = useI18n();
  const visible = filterRecipes(filters, "");
  const filtersOn = Object.values(filters).flat().length > 0;

  return (
    <div>
      <section className="relative">
        <img
          src={heroImg}
          alt="Grilled chicken salad in a white bowl on a wooden table"
          width={1920}
          height={900}
          className="h-[340px] w-full object-cover md:h-[420px]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/30 to-transparent" />
        <div className="absolute inset-0 mx-auto flex max-w-7xl flex-col justify-center px-6">
          <h1 className="text-4xl text-ink-foreground md:text-6xl">
            <span className="font-light">Meat</span>{" "}
            <span className="font-extrabold">Chicken</span>
          </h1>
          <Link
            to="/recipe/$recipeId"
            params={{ recipeId: "mexican-chicken" }}
            className="mt-6 w-fit border-2 border-ink-foreground/80 px-10 py-3 text-2xl text-ink-foreground transition-colors hover:bg-ink-foreground hover:text-ink"
          >
            {t("more")}
          </Link>
        </div>
        <div className="absolute top-1/2 right-0 hidden -translate-y-1/2 flex-col md:flex">
          {[Facebook, Youtube, Twitter, Instagram].map((Icon, i) => (
            <span
              key={i}
              className="flex size-12 items-center justify-center bg-ink/80 text-ink-foreground"
            >
              <Icon className="size-5" />
            </span>
          ))}
        </div>
      </section>

      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-10 lg:flex-row">
        <FilterSidebar filters={filters} onToggle={toggle} onClear={clear} />

        <div className="min-w-0 flex-1">
          <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 border-y border-border py-4 text-base sm:text-lg font-bold">
            <Link
              to="/"
              activeOptions={{ exact: true }}
              activeProps={{ className: "text-primary underline" }}
              className="text-primary/80 transition-colors hover:text-primary"
            >
              {t("home")}
            </Link>
            {sections.map((sec) => (
              <a
                key={sec}
                href={`#${sec.toLowerCase()}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(sec.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-primary/80 transition-colors hover:text-primary cursor-pointer"
              >
                {sec}
              </a>
            ))}
            <Link
              to="/help"
              activeProps={{ className: "bg-primary/25 text-primary ring-1 ring-primary/30 font-black" }}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-0.5 text-primary font-extrabold transition-colors hover:bg-primary/20"
            >
              <HelpCircle className="size-4" /> {t("help")}
            </Link>
            <Link
              to="/hashtags"
              activeProps={{ className: "bg-primary/25 text-primary ring-1 ring-primary/30 font-black" }}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-0.5 text-primary font-extrabold transition-colors hover:bg-primary/20"
            >
              <Tag className="size-4" /> {t("hashtags")}
            </Link>
            <Link
              to="/supplier"
              activeProps={{ className: "bg-primary/25 text-primary ring-1 ring-primary/30 font-black" }}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-0.5 text-primary font-extrabold transition-colors hover:bg-primary/20"
            >
              <Truck className="size-4" /> {t("supplier_portal")}
            </Link>
          </nav>

          {/* Filter aktiv bo'lganda — barcha natijalar bir grid da */}
          {filtersOn ? (
            <section className="mt-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="script-title text-4xl">
                  {t("results")}
                  <span className="ml-3 text-base font-normal text-muted-foreground">
                    ({visible.length})
                  </span>
                </h2>
                <button
                  onClick={clear}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  {t("filter_clear_all")} ✕
                </button>
              </div>
              {visible.length === 0 ? (
                <div className="mt-6 rounded-xl border border-dashed border-border p-12 text-center">
                  <p className="text-lg font-semibold text-muted-foreground">
                    {t("no_results")}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t("no_results_hint")}
                  </p>
                  <button
                    onClick={clear}
                    className="mt-4 rounded-md bg-primary px-5 py-2 text-sm font-bold text-primary-foreground"
                  >
                    {t("filter_clear_all")}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {visible.map((r) => (
                    <RecipeCard key={r.id} recipe={r} />
                  ))}
                </div>
              )}
            </section>
          ) : (
            /* Filter yo'q — eski section ko'rinishi */
            <>
              {sections.map((section) => {
                const items = visible.filter((r) => r.section === section);
                return (
                  <section key={section} id={section.toLowerCase()} className="mt-10 scroll-mt-28">
                    <div className="flex items-center justify-between">
                      <h2 className="script-title text-4xl">{section}</h2>
                      <Link
                        to="/explore"
                        search={{ section }}
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        {t("see_all")} &rarr;
                      </Link>
                    </div>
                    <div className="scroll-shelf mt-4 flex gap-5 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3">
                      {items.map((r) => (
                        <RecipeCard key={r.id} recipe={r} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </>
          )}

          <p className="mt-10 text-sm text-muted-foreground">
            {visible.length} / {recipes.length} {t("recipes_shown")}.
          </p>
        </div>
      </div>
    </div>
  );
}
