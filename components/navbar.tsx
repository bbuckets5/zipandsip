"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart-context";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { count } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-5xl">
      <div
        className={`flex items-center justify-between rounded-full px-5 py-2 backdrop-blur-md transition-colors duration-300 ${
          scrolled ? "bg-cream/70" : "bg-transparent"
        }`}
      >
        <Link href="/">
          <Image
            src="/logo.png"
            alt="S &amp; S Zip and Sip"
            width={400}
            height={120}
            priority
            style={{ height: "3.5rem", width: "auto" }}
          />
        </Link>

        <div className="flex items-center gap-5">
          <Link href="/drinks" className="hidden text-sm text-leaf sm:block">
            drinks
          </Link>
          <Link href="/#about" className="hidden text-sm text-leaf sm:block">
            about
          </Link>
          <Link
            href="/cart"
            className="relative rounded-full bg-sunset px-4 py-2 text-sm text-cream"
          >
            cart
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-leaf text-xs text-cream">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
