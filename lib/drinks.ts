export type Category =
  | "Immunity Boosters"
  | "Freshly Squeezed"
  | "Punches"
  | "Seamoss";

export type Drink = {
  slug: string;
  name: string;
  note: string;
  img: string;
  category: Category;
  featured?: boolean;
};

export const categories: Category[] = [
  "Immunity Boosters",
  "Freshly Squeezed",
  "Punches",
  "Seamoss",
];

export const drinks: Drink[] = [
  // Immunity Boosters — cold pressed, 8oz
  { slug: "morning-glow", name: "Morning Glow", note: "Cold pressed booster, 8oz", img: "/mango.jpg", category: "Immunity Boosters" },
  { slug: "just-green", name: "Just Green", note: "Cold pressed booster, 8oz", img: "/guava.jpg", category: "Immunity Boosters" },
  { slug: "beets-ginger", name: "Beets & Ginger", note: "Cold pressed booster, 8oz", img: "/berry.jpg", category: "Immunity Boosters" },

  // Freshly Squeezed — 16oz
  { slug: "classic", name: "Classic", note: "Freshly squeezed, 16oz", img: "/mango.jpg", category: "Freshly Squeezed" },
  { slug: "passionfruit", name: "Passionfruit", note: "Freshly squeezed, 16oz", img: "/guava.jpg", category: "Freshly Squeezed" },
  { slug: "berry-berry", name: "Berry Berry", note: "Strawberry, raspberry, blueberry, 16oz", img: "/berry.jpg", category: "Freshly Squeezed", featured: true },
  { slug: "pineapple-ginger", name: "Pineapple Ginger", note: "Freshly squeezed, 16oz", img: "/mango.jpg", category: "Freshly Squeezed" },
  { slug: "mango", name: "Mango", note: "Ripe mango, 16oz", img: "/mango.jpg", category: "Freshly Squeezed", featured: true },
  { slug: "guava", name: "Guava", note: "Pink guava, 16oz", img: "/guava.jpg", category: "Freshly Squeezed", featured: true },
  { slug: "tamarind", name: "Tamarind", note: "Freshly squeezed, 16oz", img: "/berry.jpg", category: "Freshly Squeezed" },
  { slug: "super-green-tea", name: "Super Green Tea", note: "Soursop, pear, fevergrass, 12oz", img: "/guava.jpg", category: "Freshly Squeezed" },

  // Punches
  { slug: "gramys-punch", name: "Gramys Punch", note: "House punch", img: "/berry.jpg", category: "Punches" },
  { slug: "sky-juice", name: "Sky Juice", note: "16oz", img: "/mango.jpg", category: "Punches" },
  { slug: "soursop-punch", name: "Soursop Punch", note: "12oz", img: "/guava.jpg", category: "Punches" },

  // Seamoss
  { slug: "seamoss-regular", name: "Seamoss, Regular", note: "Fill in details", img: "/berry.jpg", category: "Seamoss" },
  { slug: "seamoss-ginger", name: "Seamoss, Ginger", note: "Fill in details", img: "/mango.jpg", category: "Seamoss" },
  { slug: "seamoss-mango", name: "Seamoss, Mango", note: "Fill in details", img: "/guava.jpg", category: "Seamoss" },
  { slug: "seamoss-berry", name: "Seamoss, Berry", note: "Fill in details", img: "/berry.jpg", category: "Seamoss" },
];

export const featured = drinks.filter((d) => d.featured);
