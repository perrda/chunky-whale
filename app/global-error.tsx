"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#111111",
          color: "#ede6d9",
          fontFamily: "Georgia, serif",
          display: "grid",
          placeItems: "center",
          padding: "3rem 1.25rem",
          textAlign: "center",
        }}
      >
        <div>
          <p style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "#c4a574" }}>
            Chunky Whale
          </p>
          <h1 style={{ fontFamily: "Arial, sans-serif", fontSize: "2rem", margin: "0.75rem 0 0" }}>The shop tripped.</h1>
          <p style={{ opacity: 0.75, marginTop: "1rem" }}>Nothing was charged. Try again, or refresh.</p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              marginTop: "1.75rem",
              background: "#f7931a",
              color: "#111111",
              border: 0,
              padding: "0.75rem 1.5rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
