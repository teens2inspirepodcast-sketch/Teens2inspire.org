import Link from "next/link";
import Image from "next/image";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Headphones, Play, BookOpen, Heart } from "lucide-react";
import { Header } from "@/components/site-header";
import { Reveal } from "@/components/reveal";
import { createClient } from "@/lib/supabase/server";

type PreviewItem = { id: string; title: string; description?: string | null; type: string; cover_url?: string | null };

export function Footer() {
  return <footer className="marketing-footer"><div className="footer-top"><Link className="wordmark-logo-wrap footer-logo-wrap" href="/"><Image className="wordmark-logo" src="/teens2inspire-logo.png" alt="Teens2Inspire — a media platform for Jewish teen girls" width={520} height={130} /></Link><p>A little inspiration can change the way a day feels.</p><Link className="footer-cta" href="https://media.teens2inspire.org/">Enter the media app <ArrowUpRight size={16}/></Link></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Teens2Inspire</span><span>Made with intention.</span><div><Link href="/contact">Contact</Link><Link href="/school">School access</Link><Link href="/membership">Membership</Link><Link href="/terms">Terms</Link><Link href="/privacy">Privacy</Link></div></div></footer>;
}

export function Page({ title, children }: { title: string; children: React.ReactNode }) {
  return <><Header/><main className="inner-page"><div className="inner-page-glow"/><div className="inner-page-content"><div className="eyebrow"><span className="eyebrow-dot"/> TEENS2INSPIRE / THE STORY</div><h1>{title}</h1><div className="inner-copy">{children}</div></div></main><Footer/></>;
}

async function getPreviewItems(): Promise<PreviewItem[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("content").select("id,title,description,type,cover_url").eq("status", "published").order("published_at", { ascending: false }).limit(3);
    return (data || []) as PreviewItem[];
  } catch { return []; }
}

export async function Home() {
  const previews = await getPreviewItems();
  return <><Header/><main className="marketing-main">
    <section className="hero-dark">
      <div className="hero-grain" aria-hidden="true"/><div className="hero-orbit hero-orbit-one"/><div className="hero-orbit hero-orbit-two"/>
      <div className="hero-copy">
        <div className="eyebrow hero-eyebrow"><span className="eyebrow-dot"/> A WORLD OF YOUR OWN</div>
        <h1>Good things<br/>stay <em>with you.</em></h1>
        <p className="hero-description">A thoughtful media space for Jewish teen girls. Real conversations, fresh perspectives, and inspiration for wherever life finds you.</p>
        <div className="hero-actions"><Link className="button button-pink button-large" href="/signup">Find your next favorite <ArrowUpRight size={17}/></Link><Link className="text-link" href="/about">A little about us <ArrowRight size={16}/></Link></div>
        <div className="hero-note"><span className="note-line"/> A curated space. No social feed. Just meaningful media.</div>
      </div>
      <div className="hero-art" aria-label="Live preview of the Teens2Inspire media app">
        <div className="art-halo"/>
        <div className="preview-device live-app-preview">
          <div className="preview-live-heading"><span>TEENS2INSPIRE</span><a href="https://media.teens2inspire.org/" target="_blank" rel="noreferrer">Open app <ArrowUpRight size={13}/></a></div>
          <iframe src="https://media.teens2inspire.org/" title="Live Teens2Inspire media app preview" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
        </div>
        <div className="floating-note floating-note-top"><span className="floating-note-mark"><Heart size={15}/></span><span><b>Made for your season</b><small>Thoughtful, never noisy.</small></span></div>
        <div className="floating-note floating-note-bottom"><span className="floating-note-mark"><Headphones size={15}/></span><span><b>Watch. Listen. Read.</b><small>One place to come back to.</small></span></div>
      </div>
      <a className="scroll-cue" href="#the-feeling"><span>SCROLL TO EXPLORE</span><ArrowDownRight size={16}/></a>
    </section>

    <section className="manifesto-section" id="the-feeling"><Reveal><div className="eyebrow dark-eyebrow"><span className="eyebrow-dot"/> A DIFFERENT KIND OF SPACE</div><h2>Less noise.<br/><em>More of what matters.</em></h2><p className="manifesto-lead">The internet moves fast. This is a place to slow down, find something that speaks to you, and leave with a little more than you came with.</p></Reveal><Reveal className="manifesto-side" delay={120}><div className="manifesto-number">01 <span>—</span> 03</div><p>Created with Jewish teen girls in mind. Curated with care. Built around the things that make real life feel a little clearer.</p><Link className="dark-link" href="/about">Get to know Teens2Inspire <ArrowUpRight size={16}/></Link></Reveal></section>

    <section className="experience-section"><Reveal className="section-heading"><div><div className="eyebrow"><span className="eyebrow-dot"/> FIND YOUR KIND OF INSPIRATION</div><h2>Whatever you need<br/>a little more of.</h2></div><p>Pick up a new perspective, revisit a conversation, or discover something you didn't know you needed.</p></Reveal>
      <div className="experience-grid">
        <Reveal className="experience-card experience-watch" delay={30}><div className="experience-card-top"><span>01 / WATCH</span><Play size={17}/></div><div className="experience-art art-watch"><div className="art-window"><span>REAL TALK</span><b>Conversations<br/>that stay.</b><i>TEENS2INSPIRE ORIGINALS</i></div></div><div className="experience-card-copy"><h3>See it from a new angle.</h3><p>Honest conversations and original video stories.</p></div></Reveal>
        <Reveal className="experience-card experience-listen" delay={120}><div className="experience-card-top"><span>02 / LISTEN</span><Headphones size={17}/></div><div className="experience-art art-listen"><div className="sound-rings"><i/><i/><i/><i/><i/><i/><i/></div><span className="art-label">TAKE A MOMENT</span></div><div className="experience-card-copy"><h3>Take it with you.</h3><p>Thoughtful audio for the walk, the ride, or a quiet minute.</p></div></Reveal>
        <Reveal className="experience-card experience-read" delay={210}><div className="experience-card-top"><span>03 / READ</span><BookOpen size={17}/></div><div className="experience-art art-read"><div className="reading-page"><span>NOTES TO SELF</span><b>Small reminders.<br/>Big meaning.</b><i>ON GROWING, GENTLY</i></div></div><div className="experience-card-copy"><h3>Keep the words close.</h3><p>Ideas, resources, and reminders worth returning to.</p></div></Reveal>
      </div>
    </section>

    <section className="app-invite-section"><div className="invite-glow"/><Reveal className="invite-copy"><div className="eyebrow"><span className="eyebrow-dot"/> YOUR NEXT FAVORITE IS WAITING</div><h2>Come for a minute.<br/><em>Stay for the feeling.</em></h2><p>Explore a growing library of meaningful media, saved in one place and ready whenever you are.</p><div className="hero-actions"><Link className="button button-pink button-large" href="/signup">Join Teens2Inspire <ArrowUpRight size={17}/></Link><Link className="text-link" href="https://media.teens2inspire.org/">Already a member? Open the app <ArrowRight size={16}/></Link></div></Reveal><Reveal className="invite-stamp" delay={120}><div className="stamp-ring"><span>INSPIRING</span><b>Jewish<br/>teen girls</b><span>EVERY DAY, A LITTLE</span></div></Reveal></section>
  </main><Footer/></>;
}
