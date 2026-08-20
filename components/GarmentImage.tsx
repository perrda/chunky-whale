"use client";

import { useEffect, useRef, useState } from "react";
import { paintRecolor } from "@/lib/recolor-garment";

const cache = new Map<string, string>();
const CACHE_MAX = 64;

function remember(key: string, value: string) {
  if (cache.has(key)) cache.delete(key);
  cache.set(key, value);
  while (cache.size > CACHE_MAX) {
    const oldest = cache.keys().next().value;
    if (!oldest) break;
    cache.delete(oldest);
  }
}

export function GarmentImage({
  src,
  hex,
  alt,
  className = "",
  recolor = true,
}: {
  src: string;
  hex?: string;
  alt: string;
  className?: string;
  /** False when we already have a real photo for this colour. */
  recolor?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!hex || !recolor) {
      setUrl(null);
      setFailed(false);
      return;
    }
    const key = `${src}|${hex}`;
    const hit = cache.get(key);
    if (hit) {
      setUrl(hit);
      setFailed(false);
      return;
    }

    let dead = false;
    const img = new window.Image();
    img.decoding = "async";
    img.onload = () => {
      if (dead) return;
      const canvas = canvasRef.current ?? document.createElement("canvas");
      try {
        paintRecolor(canvas, img, hex);
        const next = canvas.toDataURL("image/png");
        remember(key, next);
        setUrl(next);
        setFailed(false);
      } catch {
        setFailed(true);
      }
    };
    img.onerror = () => {
      if (!dead) setFailed(true);
    };
    img.src = src;
    return () => {
      dead = true;
    };
  }, [src, hex, recolor]);

  const show = !hex || !recolor || failed ? src : url;

  return (
    <div className={`relative h-full w-full bg-white ${className}`}>
      <canvas ref={canvasRef} className="hidden" aria-hidden />
      {show ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={show} alt={alt} className="h-full w-full object-contain p-[8%]" />
      ) : (
        <div className="h-full w-full bg-white" aria-hidden />
      )}
    </div>
  );
}
