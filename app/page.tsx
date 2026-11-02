import Image from "next/image";
import Link from "next/link";
import { featured } from "@/lib/drinks";

const marks = [
  "Cold pressed",
  "Real fruit only",
  "Reusable bottles",
  "Bahamian made",
];

export default function Home() {
  return (
    <main>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-24 pt-36 sm:grid-cols-2 sm:gap-16 sm:pt-40">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
          <Image
            src="/berry.jpg"
            alt="Zip and Sip berry berry lemonade"
            fill
            priority
            sizes="(max-width: 640px) 100vw, 50vw"
            className="slowzoom object-cover"
          />
        </div>

        <div className="text-center sm:text-left">
          <p className="text-xs uppercase tracking-[0.25em] text-fresh">
            Nassau, Bahamas
          </p>
          <h1 className="mt-6 text-5xl leading-[1.1] sm:text-6xl">
            Cold pressed, by hand, on island time
          </h1>
          <p className="mx-auto mt-6 max-w-sm text-lg opacity-75 sm:mx-0">
            Real fruit. Nothing from concentrate. Made fresh every morning.
          </p>
          <a
            href="#order"
            className="mt-10 inline-block rounded-full bg-sunset px-8 py-4 text-cream"
          >
            Order yours
          </a>
        </div>
      </section>

      <section id="drinks" className="overflow-hidden py-20">
        <div className="mx-auto flex max-w-5xl items-end justify-between px-6">
          <h2 className="text-3xl">The drinks</h2>
          <Link href="/drinks" className="text-sm text-fresh underline">
            See everything
          </Link>
        </div>
        <div className="glide-wrap mt-10 overflow-hidden">
          <div className="glide flex w-max gap-6">
            {[...featured, ...featured].map((d, i) => (
              <div key={i} className="w-64 shrink-0">
                <div className="relative aspect-square overflow-hidden rounded-2xl">
                  <Image
                    src={d.img}
                    alt={d.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="mt-4 text-lg">{d.name}</h3>
                <p className="text-sm opacity-70">{d.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto h-px w-20 bg-gold" />

      <section id="about">
        <div className="mx-auto grid max-w-5xl gap-10 px-6 py-24 sm:grid-cols-2 sm:items-center">
          <div>
            <h2 className="text-3xl leading-snug">Made by hand, right here</h2>
            <p className="mt-5 leading-relaxed opacity-80">
              Her story goes here. Family run, fruit from local farmers and the
              markets, every bottle pressed fresh and never sitting on a shelf.
            </p>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src="/mango.jpg"
              alt="Fresh mango lemonade"
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-sand">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-7 gap-y-4 px-6 py-16">
          {marks.map((m, i) => (
            <span key={m} className="flex items-center gap-7">
              {i > 0 && <span className="text-gold">&#9679;</span>}
              <span className="font-display text-xl">{m}</span>
            </span>
          ))}
        </div>
      </section>

      <section id="order" className="bg-sunset px-6 py-24 text-center">
        <h2 className="text-4xl text-cream">Ready for one?</h2>
        <p className="mt-4 text-cream/90">
          Call or message to order. Pickup and delivery in Nassau.
        </p>
        <a
          href="tel:2424363391"
          className="mt-9 inline-block rounded-full bg-cream px-8 py-4 text-lg font-medium text-leaf"
        >
          242-436-3391
        </a>
      </section>

      <footer className="mx-auto flex max-w-5xl items-center justify-between px-6 py-10">
        <Image
          src="/logo.png"
          alt="S &amp; S Zip and Sip"
          width={200}
          height={60}
          className="h-12 w-auto"
        />
        <a
          href="https://facebook.com/sszipsip"
          className="text-sm opacity-70"
        >
          Facebook
        </a>
      </footer>
    </main>
  );
}
