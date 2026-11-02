import Link from "next/link";

export default function ThankYouPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl">Order received</h1>
      <p className="mt-4 opacity-75">
        Thanks! We&apos;ll text you shortly to confirm the details. Pay on
        pickup or delivery.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-sunset px-6 py-3 text-cream"
      >
        Back home
      </Link>
    </main>
  );
}
