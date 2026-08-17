import { createFileRoute, Link } from "@tanstack/react-router";

const faqs = [
  {
    q: "Ro'yxatdan qanday o'taman?",
    a: "Yuqoridagi Register tugmasini bosing, ism, email va parolni kiriting. Profilingiz brauzeringizda saqlanadi va keyingi kirishda ham qoladi.",
  },
  {
    q: "Retsept haqida to'liq ma'lumotni qanday ko'raman?",
    a: "Har bir kartadagi yoki hero bo'limidagi More tugmasini bosing — ingredientlar, bosqichlar va kaloriya ma'lumotlari chiqadi.",
  },
  {
    q: "Filtrlar qanday ishlaydi?",
    a: "Chapdagi Diet, Allergies, Cusine va Goals ro'yxatidan istalganini bosing. Ro'yxat darhol filtrlanadi, Clear bilan tozalanadi.",
  },
  {
    q: "Saqlangan retseptlarim qayerda?",
    a: "Kartadagi yurak belgisini bosing — retsept Profile sahifasidagi Collections bo'limiga tushadi.",
  },
];

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help & FAQ — Cookpal" },
      {
        name: "description",
        content: "Answers about Cookpal accounts, recipe filters, saved collections and search.",
      },
      { property: "og:title", content: "Help & FAQ — Cookpal" },
      {
        property: "og:description",
        content: "Answers about accounts, filters, saved collections and search on Cookpal.",
      },
    ],
  }),
  component: Help,
});

function Help() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="script-title text-5xl">Help</h1>
      <p className="mt-3 text-muted-foreground">
        Ko'p beriladigan savollar. Javob topilmasa Contact Us orqali yozing.
      </p>

      <div className="mt-8 space-y-4">
        {faqs.map((f) => (
          <details
            key={f.q}
            className="group rounded-lg border border-border bg-card p-5 open:border-primary"
          >
            <summary className="cursor-pointer text-base font-bold">{f.q}</summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>

      <div className="mt-10 rounded-lg bg-secondary p-6">
        <h2 className="text-lg font-bold text-secondary-foreground">Hali savol bormi?</h2>
        <p className="mt-2 text-sm text-secondary-foreground/80">
          Profilingizni yaratib, retseptlarga izoh qoldirishingiz mumkin.
        </p>
        <Link
          to="/auth"
          search={{ mode: "register" }}
          className="mt-4 inline-block rounded-md bg-primary px-5 py-2 text-sm font-bold text-primary-foreground"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
