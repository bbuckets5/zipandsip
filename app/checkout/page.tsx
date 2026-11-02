"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart-context";

export default function CheckoutPage() {
  const { items, count, clear } = useCart();
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState<"Pickup" | "Delivery">("Pickup");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const canSubmit =
    count > 0 &&
    name.trim() !== "" &&
    phone.trim() !== "" &&
    (method === "Pickup" || address.trim() !== "");

  async function submit() {
    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, method, address, notes, items }),
      });
      if (!res.ok) throw new Error();
      clear();
      router.push("/thank-you");
    } catch {
      setError("Something went wrong. Please call 242-436-3391 to order.");
      setSending(false);
    }
  }

  if (count === 0) {
    return (
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-36">
        <h1 className="text-4xl">Checkout</h1>
        <p className="mt-6 opacity-75">Your cart is empty.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 pb-24 pt-36">
      <h1 className="text-4xl">Almost there</h1>
      <p className="mt-3 opacity-75">
        Fill this in and we&apos;ll text you to confirm. Pay on pickup or
        delivery.
      </p>

      <div className="mt-10 space-y-6">
        <div>
          <label className="text-sm opacity-80">Your name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-xl border border-gold/60 bg-white px-4 py-3 outline-none focus:border-fresh"
          />
        </div>

        <div>
          <label className="text-sm opacity-80">Phone number</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
            className="mt-2 w-full rounded-xl border border-gold/60 bg-white px-4 py-3 outline-none focus:border-fresh"
          />
        </div>

        <div>
          <label className="text-sm opacity-80">Pickup or delivery</label>
          <div className="mt-2 flex gap-3">
            {(["Pickup", "Delivery"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`flex-1 rounded-xl py-3 transition-colors ${
                  method === m
                    ? "bg-leaf text-cream"
                    : "bg-sand text-leaf hover:bg-gold/40"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {method === "Delivery" && (
          <div>
            <label className="text-sm opacity-80">Delivery address</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gold/60 bg-white px-4 py-3 outline-none focus:border-fresh"
            />
          </div>
        )}

        <div>
          <label className="text-sm opacity-80">Notes and Delivery Instructions (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="mt-2 w-full rounded-xl border border-gold/60 bg-white px-4 py-3 outline-none focus:border-fresh"
          />
        </div>

        {error && <p className="text-sm text-coral">{error}</p>}

        <button
          onClick={submit}
          disabled={!canSubmit || sending}
          className="w-full rounded-full bg-sunset py-4 text-lg text-cream disabled:opacity-50"
        >
          {sending ? "Sending..." : "Place order"}
        </button>
      </div>
    </main>
  );
}
