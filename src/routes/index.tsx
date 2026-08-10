import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-chicken.jpg";
import { FilterSidebar } from "@/components/FilterSidebar";
import { RecipeCard } from "@/components/RecipeCard";
import { useFilters } from "@/hooks/useFilters";
import { filterRecipes, recipes } from "@/lib/recipes";
import { Facebook, Youtube, Twitter, Instagram } from "lucide-react";

export const Route = createFileRoute("/")({
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
});

const sections = ["Cusines", "Diet", "Bakery"] as const;

function Home() {
  const { filters, toggle, clear } = useFilters();
  const visible = filterRecipes(filters, "");

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
            More
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
              Home
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
              to="/explore"
              activeProps={{ className: "text-primary underline" }}
              className="text-primary/80 transition-colors hover:text-primary"
            >
              Explore
            </Link>
            <Link
              to="/help"
              activeProps={{ className: "text-primary underline" }}
              className="text-primary/80 transition-colors hover:text-primary"
            >
              Help
            </Link>
            <Link
              to="/profile"
              activeProps={{ className: "text-primary underline" }}
              className="text-primary/80 transition-colors hover:text-primary"
            >
              Profile
            </Link>
            <Link
              to="/supplier"
              activeProps={{ className: "text-primary underline" }}
              className="rounded-full bg-primary/10 px-3 py-0.5 text-primary font-extrabold transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              🚚 Supplier Portal
            </Link>
          </nav>

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
                    Barchasini ko'rish &rarr;
                  </Link>
                </div>
                {items.length === 0 ? (
                  <p className="mt-4 text-sm text-muted-foreground">
                    Bu filtrlar bo'yicha {section} bo'limida mahsulot topilmadi.
                  </p>
                ) : (
                  <div className="scroll-shelf mt-4 flex gap-5 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3">
                    {items.map((r) => (
                      <RecipeCard key={r.id} recipe={r} />
                    ))}
                  </div>
                )}
              </section>
            );
          })}

          <p className="mt-10 text-sm text-muted-foreground">
            {visible.length} / {recipes.length} recipes shown.
          </p>
        </div>
      </div>
    </div>
  );
}
