"use client";

import { useState } from "react";

/** Keep authentic brand artwork when available, with a readable text fallback. */
export function TemporaryBrandLogo({ src, name }: { src: string | null | undefined; name: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <span className="t2i-temp-brand-fallback">{name}</span>;
  return <img src={src} alt={`${name} logo`} loading="lazy" decoding="async" onError={() => setFailed(true)} />;
}
