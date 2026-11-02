import type { Metadata } from "next";
import { Fredoka, DM_Sans } from "next/font/google";
import Navbar from "@/components/navbar";
import { CartProvider } from "@/components/cart-context";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "S & S Zip and Sip | Natural Drinks & Juices",
  description:
    "Cold pressed Bahamian juices and lemonades made by hand with real fruit. Pickup and delivery in Nassau.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fredoka.variable} ${dmSans.variable}`}>
      <body className="antialiased">
        <CartProvider>
          <Navbar />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
