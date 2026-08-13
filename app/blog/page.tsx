import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "@/lib/blog";

export const metadata: Metadata = { title: "Blog" };

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6">
      <h1 className="font-display text-4xl font-extrabold">Blog</h1>
      <p className="mt-3 font-serif text-paper/75">Culture notes. No price calls. Not financial advice.</p>
      <ul className="mt-10 space-y-8">
        {posts.map((p) => (
          <li key={p.slug}>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{p.date}</p>
            <Link href={`/blog/${p.slug}`} className="font-display text-2xl font-bold hover:text-ember">
              {p.title}
            </Link>
            <p className="mt-2 font-serif text-paper/75">{p.excerpt}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
