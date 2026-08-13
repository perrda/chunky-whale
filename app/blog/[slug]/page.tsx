import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost, posts } from "@/lib/blog";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getPost(slug);
  return { title: p?.title ?? "Post" };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  return (
    <article className="mx-auto max-w-2xl px-4 py-16 md:px-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{post.date}</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold">{post.title}</h1>
      {post.body.map((para) => (
        <p key={para.slice(0, 24)} className="mt-5 font-serif text-lg text-paper/85">
          {para}
        </p>
      ))}
    </article>
  );
}
