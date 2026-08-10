import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Twitter, Youtube, Send } from "lucide-react";

const columns = [
  { title: "Fresh Recipe", items: ["Recipes", "Winter salads", "Organic chicken", "Beef and Mutton", "Flavoured Milk"] },
  { title: "In News", items: ["Our Blogs", "Contests/Sweepstakes", "Video", "New Releases", "Newsletters"] },
  { title: "About US", items: ["FAQ", "Our Board", "Our Staff", "Contact Us"] },
];

export function Footer() {
  return (
    <footer className="mt-16 rounded-t-3xl bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-[1fr_2fr_1.2fr]">
        <div>
          <div className="text-3xl font-extrabold">
            Cook<span className="text-primary">pal</span>
          </div>
          <p className="mt-4 text-sm opacity-70">All Rights Reserved</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-lg font-bold">{col.title}</h3>
              <ul className="mt-3 space-y-2 text-sm opacity-75">
                {col.items.map((item) => (
                  <li key={item}>
                    <Link to="/explore" className="hover:opacity-100 hover:underline">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div>
          <h3 className="script-title text-3xl text-ink-foreground">Join Our Newsletter</h3>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-4 flex items-center gap-2 rounded-md border border-ink-foreground/30 p-1"
          >
            <input
              placeholder="Email"
              aria-label="Email"
              className="h-10 w-full bg-transparent px-3 text-sm outline-none placeholder:opacity-60"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="flex h-10 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground"
            >
              <Send className="size-4" />
            </button>
          </form>
          <div className="mt-5 flex gap-4 opacity-80">
            <Facebook className="size-5" />
            <Instagram className="size-5" />
            <Twitter className="size-5" />
            <Youtube className="size-5" />
          </div>
        </div>
      </div>
    </footer>
  );
}
