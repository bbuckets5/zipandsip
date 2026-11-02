import type { Metadata } from "next";
import DrinkList from "@/components/drink-list";

export const metadata: Metadata = {
  title: "The drinks | S & S Zip and Sip",
  description:
    "Every lemonade, immune booster and tea we make. Cold pressed by hand in Nassau with real fruit.",
};

export default function DrinksPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-36">
      <p className="text-xs uppercase tracking-[0.25em] text-fresh">
        Everything we make
      </p>
      <h1 className="mt-6 max-w-2xl text-5xl leading-[1.1] sm:text-6xl">
        The drinks
      </h1>
      <p className="mt-6 max-w-md text-lg opacity-75">
        Pressed fresh in small batches. If something you want isn&apos;t listed,
        just ask.
      </p>

      <DrinkList />

      <div className="mt-24 rounded-[2rem] bg-sunset px-6 py-16 text-center">
        <h2 className="text-3xl text-cream">Ready for one?</h2>
        <p className="mt-4 text-cream/90">
          Call or message to order. Pickup and delivery in Nassau.
        </p>
        <a
          href="tel:2424363391"
          className="mt-8 inline-block rounded-full bg-cream px-8 py-4 text-lg font-medium text-leaf"
        >
          242-436-3391
        </a>
      </div>
    </main>
  );
}
