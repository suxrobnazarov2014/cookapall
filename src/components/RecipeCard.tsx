import { Link } from "@tanstack/react-router";
import { Clock, MessageCircle, ThumbsUp, Star, Heart, ShoppingCart, Check } from "lucide-react";
import type { Recipe } from "@/lib/recipes";
import { useStore } from "@/lib/store";
import { useState } from "react";

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const { favorites, toggleFavorite, cart, addToCart } = useStore();
  const liked = favorites.includes(recipe.id);
  const inCart = cart.includes(recipe.id);
  const [justAdded, setJustAdded] = useState(false);

  function handleAddToCart() {
    addToCart(recipe.id);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <article className="card-lift w-[240px] shrink-0 overflow-hidden rounded-lg border border-border bg-card sm:w-auto">
      <Link
        to="/recipe/$recipeId"
        params={{ recipeId: recipe.id }}
        className="relative block aspect-[4/3] overflow-hidden"
      >
        <img
          src={recipe.image}
          alt={recipe.title}
          loading="lazy"
          width={800}
          height={600}
          className="size-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <span className="script-title absolute right-3 bottom-1 text-3xl text-primary-foreground drop-shadow">
          {recipe.cuisine}
        </span>
      </Link>

      <div className="space-y-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <Link
            to="/recipe/$recipeId"
            params={{ recipeId: recipe.id }}
            className="text-sm leading-tight font-bold hover:text-primary"
          >
            {recipe.title}
          </Link>
          <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
            $ {recipe.price}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="size-3" /> {recipe.minutes} minutes
          </span>
          <span className="font-semibold">{recipe.difficulty}</span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <MessageCircle className="size-3" /> {recipe.comments}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="size-3" /> {recipe.likes}
            </span>
          </span>
          <span className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={
                  i < recipe.rating ? "size-3 fill-foreground text-foreground" : "size-3 text-border"
                }
              />
            ))}
          </span>
        </div>

        <div className="flex items-center gap-1.5 pt-1">
          <Link
            to="/recipe/$recipeId"
            params={{ recipeId: recipe.id }}
            className="flex-1 rounded-md bg-secondary px-2.5 py-1.5 text-center text-xs font-bold text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            More
          </Link>
          <button
            onClick={handleAddToCart}
            aria-label="Add to cart"
            title={inCart ? "Savatchada mavjud" : "Savatchaga qo'shish"}
            className={`rounded-md border border-border p-1.5 transition-all ${
              justAdded || inCart
                ? "bg-primary text-primary-foreground border-primary"
                : "hover:border-primary hover:text-primary"
            }`}
          >
            {justAdded ? <Check className="size-4 animate-bounce" /> : <ShoppingCart className="size-4" />}
          </button>
          <button
            onClick={() => toggleFavorite(recipe.id)}
            aria-label="Save recipe"
            className="rounded-md border border-border p-1.5 transition-colors hover:border-primary"
          >
            <Heart className={liked ? "size-4 fill-primary text-primary" : "size-4 text-muted-foreground"} />
          </button>
        </div>
      </div>
    </article>
  );
}

