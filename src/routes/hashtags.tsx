import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { RecipeCard } from "@/components/RecipeCard";
import { recipes } from "@/lib/recipes";
import { Hash, ListFilter, HelpCircle, Tag, Truck } from "lucide-react";

type HashtagsSearch = {
  tag?: string | undefined;
};

export const Route = createFileRoute("/hashtags")({
  validateSearch: (search: Record<string, unknown>): HashtagsSearch => ({
    tag: typeof search["tag"] === "string" ? search["tag"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Hashtags — Cookpal" },
      {
        name: "description",
        content: "Discover Cookpal recipes using popular tags and categories.",
      },
    ],
  }),
  component: Hashtags,
});

function Hashtags() {
  const { tag: selectedTag } = Route.useSearch();
  const navigate = useNavigate();

  const selectedTags = selectedTag ? selectedTag.split(",").filter(Boolean) : [];

  // Extract all unique hashtags from recipes
  const allHashtagsWithCounts = recipes.reduce((acc: Record<string, number>, recipe) => {
    if (recipe.hashtags) {
      recipe.hashtags.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
    }
    return acc;
  }, {});

  const hashtagList = Object.entries(allHashtagsWithCounts)
    .map(([name, count]) => ({
      name,
      count,
    }))
    .filter(({ count }) => count > 1);

  const handleTagClick = (tag: string) => {
    let newTags: string[];
    if (selectedTags.includes(tag)) {
      newTags = selectedTags.filter((t) => t !== tag);
    } else {
      newTags = [...selectedTags, tag];
    }

    if (newTags.length === 0) {
      navigate({ to: "/hashtags", search: {} });
    } else {
      navigate({ to: "/hashtags", search: { tag: newTags.join(",") } });
    }
  };

  const handleClearAll = () => {
    navigate({ to: "/hashtags", search: {} });
  };

  // Filter recipes based on selected tags (match any selected tag)
  const filteredRecipes = selectedTags.length > 0
    ? recipes.filter((r) => r.hashtags?.some((t) => selectedTags.includes(t)))
    : recipes.filter((r) => r.hashtags && r.hashtags.length > 0);

  const sections = ["Cusines", "Diet", "Bakery"] as const;

  return (
    <div>
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-10">
        <div className="min-w-0 flex-1">
          {/* Sub Navigation */}
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
              <Link
                key={sec}
                to="/"
                hash={sec.toLowerCase()}
                className="text-primary/80 transition-colors hover:text-primary cursor-pointer"
              >
                {sec}
              </Link>
            ))}
            <Link
              to="/help"
              activeProps={{ className: "bg-primary/25 text-primary ring-1 ring-primary/30 font-black" }}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-0.5 text-primary font-extrabold transition-colors hover:bg-primary/20"
            >
              <HelpCircle className="size-4" /> Help
            </Link>
            <Link
              to="/hashtags"
              activeProps={{ className: "bg-primary/25 text-primary ring-1 ring-primary/30 font-black" }}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-0.5 text-primary font-extrabold transition-colors hover:bg-primary/20"
            >
              <Tag className="size-4" /> Hashtags
            </Link>
            <Link
              to="/supplier"
              activeProps={{ className: "bg-primary/25 text-primary ring-1 ring-primary/30 font-black" }}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-0.5 text-primary font-extrabold transition-colors hover:bg-primary/20"
            >
              <Truck className="size-4" /> Supplier Portal
            </Link>
          </nav>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <Hash className="size-8 text-primary" />
                <h1 className="script-title text-5xl">Hashtags</h1>
              </div>
              <p className="mt-3 text-muted-foreground">
                Taomlarni heshteglar bo'yicha saralab ko'ring. Bir nechta heshtegni bir vaqtda tanlashingiz mumkin.
              </p>
            </div>
            {selectedTags.length > 0 && (
              <button
                onClick={handleClearAll}
                className="rounded-full bg-destructive/10 px-4 py-1.5 text-xs font-bold text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all"
              >
                Tozalash ({selectedTags.length})
              </button>
            )}
          </div>

          {/* Hashtag List */}
          <div className="mt-8 flex flex-wrap gap-3">
            {hashtagList.map(({ name, count }) => {
              const isActive = selectedTags.includes(name);
              return (
                <button
                  key={name}
                  onClick={() => handleTagClick(name)}
                  className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold shadow-sm transition-all hover:scale-105 active:scale-95 ${
                    isActive
                      ? "bg-primary text-primary-foreground font-extrabold ring-2 ring-primary ring-offset-2"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  <span>{name}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Recipes Display */}
          <div className="mt-12">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ListFilter className="size-5 text-primary" />
                {selectedTags.length > 0
                  ? `${selectedTags.join(", ")} heshteglari bo'yicha`
                  : "Barcha heshtegli taomlar"}
              </h2>
              <span className="text-sm font-semibold text-muted-foreground">
                {filteredRecipes.length} retsept topildi
              </span>
            </div>

            {filteredRecipes.length === 0 ? (
              <p className="mt-8 rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
                Tanlangan heshteglar bo'yicha retseptlar topilmadi.
              </p>
            ) : (
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredRecipes.map((r) => (
                  <RecipeCard key={r.id} recipe={r} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
