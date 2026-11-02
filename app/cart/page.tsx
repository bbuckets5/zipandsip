"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart-context";

export default function CartPage() {
  const { items, setQty, remove, count } = useCart();

  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-36">
      <h1 className="text-4xl">Your order</h1>

      {count === 0 ? (
        <div className="mt-8">
          <p className="opacity-75">Nothing here yet.</p>
          <Link
            href="/drinks"
            className="mt-6 inline-block rounded-full bg-sunset px-6 py-3 text-cream"
          >
            See the drinks
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-8 divide-y divide-gold/50">
            {items.map((i) => (
              <div
                key={i.slug}
                className="flex items-center justify-between gap-4 py-4"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={i.img}
                      alt={i.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg">{i.name}</h3>
                    <p className="text-sm opacity-70">{i.note}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3 rounded-full bg-sand px-3 py-1">
                    <button
                      onClick={() => setQty(i.slug, i.qty - 1)}
                      className="text-lg leading-none"
                      aria-label="One less"
                    >
                      &minus;
                    </button>
                    <span className="w-5 text-center">{i.qty}</span>
                    <button
                      onClick={() => setQty(i.slug, i.qty + 1)}
                      className="text-lg leading-none"
                      aria-label="One more"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => remove(i.slug)}
                    className="text-sm opacity-60 hover:opacity-100"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <p className="opacity-75">
              {count} {count === 1 ? "drink" : "drinks"}
            </p>
            <Link
              href="/checkout"
              className="rounded-full bg-sunset px-8 py-4 text-lg text-cream"
            >
              Checkout
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
