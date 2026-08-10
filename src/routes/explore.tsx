import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { FilterSidebar } from "@/components/FilterSidebar";
import { RecipeCard } from "@/components/RecipeCard";
import { useFilters } from "@/hooks/useFilters";
import { emptyFilters, filterRecipes } from "@/lib/recipes";

type ExploreSearch = {
  q?: string | undefined;
  cusine?: string | undefined;
  section?: string | undefined;
  sort?: string | undefined;
  diet?: string | undefined;
};

export const Route = createFileRoute("/explore")({
  validateSearch: (search: Record<string, unknown>): ExploreSearch => ({
    q: typeof search["q"] === "string" ? search["q"] : undefined,
    cusine: typeof search["cusine"] === "string" ? search["cusine"] : undefined,
    section: typeof search["section"] === "string" ? search["section"] : undefined,
    sort: typeof search["sort"] === "string" ? search["sort"] : undefined,
    diet: typeof search["diet"] === "string" ? search["diet"] : undefined,
  }),

  head: () => ({
    meta: [
      { title: "Explore Recipes — Cookpal" },
      {
        name: "description",
        content: "Search every Cookpal recipe and narrow results by diet, allergy, cuisine and goal.",
      },
      { property: "og:title", content: "Explore Recipes — Cookpal" },
      {
        property: "og:description",
        content: "Search every Cookpal recipe and filter by diet, allergy, cuisine and goal.",
      },
    ],
  }),
  component: Explore,
});

function Explore() {
  const { q, cusine, section, sort, diet } = Route.useSearch();
  const navigate = useNavigate();

  const initialFilters = {
    ...emptyFilters,
    ...(cusine ? { Cusine: [cusine] } : {}),
    ...(diet ? { Diet: [diet] } : {}),
  };

  const { filters, toggle, clear } = useFilters(initialFilters);
  const [query, setQuery] = useState(q ?? "");

  let results = filterRecipes(filters, query);

  if (section) {
    results = results.filter(
      (r) => r.section.toLowerCase() === section.toLowerCase()
    );
  }

  if (sort === "popular") {
    results = [...results].sort((a, b) => b.likes - a.likes);
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-10 lg:flex-row">
      <FilterSidebar filters={filters} onToggle={toggle} onClear={clear} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="script-title text-5xl">Explore Recipes</h1>
          {(section || sort || cusine || diet) && (
            <button
              onClick={() => navigate({ to: "/explore" })}
              className="text-xs font-bold text-primary hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const s: ExploreSearch = {};
            if (query) s.q = query;
            if (section) s.section = section;
            if (sort) s.sort = sort;
            if (cusine) s.cusine = cusine;
            if (diet) s.diet = diet;
            navigate({
              to: "/explore",
              search: s,
            });
          }}
          className="mt-4 flex items-center gap-2 rounded-full border border-border p-1 pl-4 shadow-sm"
        >
          <Search className="size-5 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, cuisine or description..."
            aria-label="Search recipes"
            className="h-11 w-full bg-transparent text-sm outline-none"
          />
          <button
            type="submit"
            aria-label="Search"
            className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:scale-105 active:scale-95"
          >
            <Search className="size-4" />
            <span className="text-sm font-bold">Search</span>
          </button>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <p className="text-sm text-muted-foreground">{results.length} recipe(s) found</p>
          {section && (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Section: {section}
            </span>
          )}
          {sort && (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Sort: {sort}
            </span>
          )}
        </div>

        <div className="scroll-shelf mt-6 grid max-h-[70vh] gap-6 overflow-y-auto pr-2 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((r) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>

        {results.length === 0 && (
          <p className="mt-8 rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
            Hech narsa topilmadi. Boshqa filtr yoki so'z bilan qidiring.
          </p>
        )}
      </div>
    </div>
  );
}

