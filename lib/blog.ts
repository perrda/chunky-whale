export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  body: string[];
};

export const posts: Post[] = [
  {
    slug: "why-21-million",
    title: "Why 21 million still prints on a tee",
    date: "13 Aug 2026",
    excerpt: "The cap is the joke. The joke is the monetary policy. Wear it.",
    body: [
      "Bitcoin’s supply cap is not a mood. It is 21 million. That is why it belongs on cloth.",
      "We do not print price targets. We print the number. If someone asks what it means, they can read the white paper.",
      "Not financial advice. Just merch.",
    ],
  },
  {
    slug: "hodl-is-a-typo",
    title: "HODL started as a typo",
    date: "13 Aug 2026",
    excerpt: "December 2013, BitcoinTalk. I AM HODLING. The personality since.",
    body: [
      "A drunk forum post became the word. We print I AM HODLING because that is the origin, not a brand consultant.",
      "STACKHOUSE does not copy other houses. We print the culture that already exists.",
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
