"use client";

import Image from "next/image";
import { useState } from "react";
import { categories, drinks, type Category } from "@/lib/drinks";
import { useCart } from "@/components/cart-context";

export default function DrinkList() {
  const [active, setActive] = useState<Category>(categories[0]);
  const { add } = useCart();

  const shown = drinks.filter((d) => d.category === active);

  return (
    <div>
      <div className="mt-12 flex flex-wrap gap-3">
        {categories.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`rounded-full px-5 py-2 text-sm transition-colors ${
              active === f
                ? "bg-leaf text-cream"
                : "bg-sand text-leaf hover:bg-gold/40"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {shown.map((d) => (
          <div key={d.slug}>
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Image
                src={d.img}
                alt={d.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            <h3 className="mt-3 text-base leading-snug">{d.name}</h3>
            <p className="text-sm opacity-70">{d.note}</p>
            <button
              onClick={() => add({ slug: d.slug, name: d.name, note: d.note, img: d.img })}
              className="mt-3 w-full rounded-full bg-sunset py-2 text-sm text-cream transition-opacity hover:opacity-90"
            >
              Add
            </button>
          </div>
        ))}
      </div>

      {shown.length === 0 && (
        <p className="mt-10 opacity-70">Nothing in this one yet.</p>
      )}
    </div>
  );
}
