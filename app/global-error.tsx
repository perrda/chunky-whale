"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body className="bg-white px-6 py-20 text-[#111]">
        <p className="font-mono text-xs uppercase tracking-widest">STACKHOUSE</p>
        <h1 className="mt-3 text-3xl font-bold">That page did not load.</h1>
        <p className="mt-3 max-w-md text-lg">
          Try again. If it keeps happening, stop the shop with Control+C and run the SYNC block.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-8 bg-[#f7931a] px-6 py-3 font-bold text-black"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
