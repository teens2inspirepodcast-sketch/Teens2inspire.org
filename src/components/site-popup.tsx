"use client";

import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { SitePopup } from "@/lib/site-popup";

export function SitePopupModal({ settings, mediaUrl }: { settings: SitePopup; mediaUrl: string | null }) {
  const [open, setOpen] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Dismissal is per browsing session; editing the popup version makes it new again.
    const key = `teens2inspire-popup-${settings.updated_at || "initial"}`;
    try { if (sessionStorage.getItem(key) === "dismissed") return; } catch { /* no storage */ }
    setOpen(true);
  }, [settings.updated_at]);
  useEffect(() => {
    if (!open) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const trap = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); dismiss(); return; }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const els = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),video[controls],input:not([disabled])'));
      if (!els.length) return;
      const first = els[0], last = els[els.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", trap);
    return () => { document.body.style.overflow = oldOverflow; document.removeEventListener("keydown", trap); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  function dismiss() {
    try { sessionStorage.setItem(`teens2inspire-popup-${settings.updated_at || "initial"}`, "dismissed"); } catch { /* no storage */ }
    setOpen(false);
  }
  if (!open || !settings.is_enabled) return null;
  return <div className="promo-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) dismiss(); }}>
    <div ref={dialogRef} className={`promo-dialog ${mediaUrl ? "with-media" : "text-only"}`} role="dialog" aria-modal="true" aria-labelledby="promo-title" aria-describedby="promo-description">
      <button ref={closeButton} className="promo-close" onClick={dismiss} type="button" aria-label="Close announcement"><X size={21}/></button>
      {mediaUrl && settings.media_kind && <div className="promo-media">
        {settings.media_kind === "video"
          ? <video key={mediaUrl} controls playsInline preload="metadata" aria-label={settings.media_alt || "Teens2Inspire announcement video"}><source src={mediaUrl}/><p>Your browser cannot play this video.</p></video>
          : <img src={mediaUrl} alt={settings.media_alt || "Teens2Inspire announcement"}/>}
        <div className="promo-media-vignette" aria-hidden="true"/>
      </div>}
      <div className="promo-copy">
        <span className="promo-kicker"><i/> {settings.eyebrow || "ANNOUNCING"}</span>
        <h2 id="promo-title">{settings.title}</h2>
        <p id="promo-description">{settings.body}</p>
        <Link className="promo-action" href={settings.cta_href} onClick={dismiss}>{settings.cta_label} <ArrowUpRight size={19}/></Link>
        <button type="button" className="promo-later" onClick={dismiss}>Maybe later</button>
        <span className="promo-brand">TEENS2INSPIRE <span>✦</span> INSPIRING JEWISH TEEN GIRLS</span>
      </div>
    </div>
  </div>;
}
