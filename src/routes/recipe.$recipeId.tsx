import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Clock, MessageCircle, ThumbsUp, Star, Heart, ShoppingCart } from "lucide-react";
import { RecipeCard } from "@/components/RecipeCard";
import { getRecipe, recipes, type Recipe } from "@/lib/recipes";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/recipe/$recipeId")({
  loader: ({ params }) => {
    const recipe = getRecipe(params.recipeId);
    if (!recipe) throw notFound();
    return { recipe };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Recipe not found — Cookpal" }, { name: "robots", content: "noindex" }],
      };
    }
    const { recipe } = loaderData;
    return {
      meta: [
        { title: `${recipe.title} — Cookpal Recipe` },
        { name: "description", content: recipe.description.slice(0, 155) },
        { property: "og:title", content: `${recipe.title} — Cookpal Recipe` },
        { property: "og:description", content: recipe.description.slice(0, 155) },
      ],
    };
  },
  notFoundComponent: RecipeNotFound,
  component: RecipeDetail,
});

function RecipeNotFound() {
  return (
    <div className="mx-auto max-w-md px-6 py-20 text-center">
      <h1 className="text-2xl font-bold">Bu retsept topilmadi</h1>
      <Link to="/explore" className="mt-4 inline-block font-bold text-primary hover:underline">
        Explore recipes
      </Link>
    </div>
  );
}

function RecipeDetail() {
  const { recipe } = Route.useLoaderData() as { recipe: Recipe };
  const { favorites, toggleFavorite, addToCart } = useStore();
  const liked = favorites.includes(recipe.id);
  const related = recipes.filter((r) => r.id !== recipe.id && r.section === recipe.section);

  return (
    <article className="mx-auto max-w-5xl px-6 py-10">
      <nav className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>{" "}
        / <span className="text-primary">{recipe.section}</span>
      </nav>

      <div className="mt-4 grid gap-8 md:grid-cols-2">
        <img
          src={recipe.image}
          alt={recipe.title}
          width={800}
          height={600}
          className="aspect-[4/3] w-full rounded-xl object-cover"
        />
        <div>
          <span className="script-title text-3xl">{recipe.cuisine}</span>
          <h1 className="mt-1 text-3xl font-extrabold">{recipe.title}</h1>
          <p className="mt-3 leading-relaxed text-muted-foreground">{recipe.description}</p>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="size-4" /> {recipe.minutes} minutes
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="size-4" /> {recipe.comments}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="size-4" /> {recipe.likes}
            </span>
            <span className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={
                    i < recipe.rating
                      ? "size-4 fill-foreground text-foreground"
                      : "size-4 text-border"
                  }
                />
              ))}
            </span>
            <span className="font-bold text-foreground">{recipe.difficulty}</span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {[...recipe.diet, ...recipe.goals].map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-7 flex items-center gap-3">
            <span className="text-2xl font-extrabold text-price">$ {recipe.price}</span>
            <button
              onClick={() => addToCart(recipe.id)}
              className="flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <ShoppingCart className="size-4" /> Add to cart
            </button>
            <button
              onClick={() => toggleFavorite(recipe.id)}
              className="flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-bold hover:border-primary"
            >
              <Heart className={liked ? "size-4 fill-primary text-primary" : "size-4"} />
              {liked ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-10 md:grid-cols-[1fr_1.3fr]">
        <section>
          <h2 className="script-title text-3xl">Ingredients</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {recipe.ingredients.map((i) => (
              <li key={i} className="flex gap-2 border-b border-border pb-2">
                <span className="text-primary">•</span> {i}
              </li>
            ))}
          </ul>

          <h2 className="script-title mt-10 text-3xl">Nutrition</h2>
          <dl className="mt-4 grid grid-cols-2 gap-3">
            {recipe.nutrition.map((n) => (
              <div key={n.label} className="rounded-lg bg-secondary p-3">
                <dt className="text-xs font-bold text-secondary-foreground/70">{n.label}</dt>
                <dd className="text-lg font-extrabold text-secondary-foreground">{n.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <h2 className="script-title text-3xl">How to cook</h2>
          <ol className="mt-4 space-y-4">
            {recipe.steps.map((s, i) => (
              <li key={s} className="flex gap-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed">{s}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="script-title text-3xl">More {recipe.section}</h2>
          <div className="scroll-shelf mt-5 flex gap-5 overflow-x-auto pb-4 sm:grid sm:grid-cols-3 sm:overflow-visible">
            {related.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
