import type { Metadata } from "next";
import { SizeChart } from "@/components/SizeChart";

export const metadata: Metadata = { title: "Size charts" };

export default function SizesPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6">
      <h1 className="font-display text-4xl font-extrabold">Size charts</h1>
      <p className="mt-4 font-serif text-paper/80">
        Unisex tees XS–4XL. Switch US inches, UK, EU centimetres, or Asia. If you are between sizes, take the larger —
        Printful blanks are not skinny runway cuts.
      </p>
      <h2 className="mt-10 font-display text-xl font-bold">T-shirts</h2>
      <div className="mt-4">
        <SizeChart kind="tees" />
      </div>
      <h2 className="mt-10 font-display text-xl font-bold">Hoodies</h2>
      <div className="mt-4">
        <SizeChart kind="hoodies" />
      </div>
    </div>
  );
}
