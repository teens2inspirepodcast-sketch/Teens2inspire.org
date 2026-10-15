"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [open, setOpen] = useState(false);
  return <header className="marketing-header">
    <Link className="wordmark-logo-wrap" href="/" aria-label="Teens2Inspire home"><Image className="wordmark-logo" src="/teens2inspire-logo.png" alt="Teens2Inspire — a media platform for Jewish teen girls" width={520} height={130} priority /></Link>
    <nav className={`marketing-nav${open ? " is-open" : ""}`} aria-label="Main navigation">
      <Link href="/about" onClick={() => setOpen(false)}>Our story</Link>
      <Link href="/podcast" onClick={() => setOpen(false)}>Podcast</Link>
      <Link href="/events" onClick={() => setOpen(false)}>Events</Link>
      <Link href="/school" onClick={() => setOpen(false)}>For schools</Link>
      <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
      <div className="nav-mobile-actions"><Link href="/login" onClick={() => setOpen(false)}>Sign in</Link><Link className="button button-pink" href="/signup" onClick={() => setOpen(false)}>Join us <ArrowUpRight size={15}/></Link></div>
    </nav>
    <div className="header-actions"><Link className="sign-in-link" href="/login">Sign in</Link><Link className="button button-pink header-join" href="/signup">Join us <ArrowUpRight size={15}/></Link></div>
    <button className="menu-toggle" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} onClick={() => setOpen(v => !v)}>{open ? <X size={21}/> : <Menu size={21}/>}</button>
  </header>;
}
