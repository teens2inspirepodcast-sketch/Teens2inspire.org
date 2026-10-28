import Link from "next/link";
import Image from "next/image";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Headphones, Play, BookOpen, Heart } from "lucide-react";
import { Header } from "@/components/site-header";
import { Reveal } from "@/components/reveal";
import { createClient } from "@/lib/supabase/server";
import { getMarketingSettings } from "@/lib/marketing-settings";
import { PartnershipCarousel } from "@/components/partnership-carousel";
import { SitePopupModal } from "@/components/site-popup";
import { readSitePopup, getPopupMediaUrl } from "@/lib/site-popup";

type PreviewItem = { id: string; title: string; description?: string | null; type: string; cover_url?: string | null };

export function Footer() {
  return <footer className="marketing-footer"><div className="footer-top"><Link className="wordmark-logo-wrap footer-logo-wrap" href="/"><Image className="wordmark-logo" src="/teens2inspire-logo.png" alt="Teens2Inspire — a media platform for Jewish teen girls" width={520} height={130} /></Link><p>A little inspiration can change the way a day feels.</p><Link className="footer-cta" href="https://media.teens2inspire.org/">Enter the media app <ArrowUpRight size={16}/></Link></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Teens2Inspire</span><span>Made with intention.</span><div><Link href="/contact">Contact</Link><Link href="/school">School access</Link><Link href="/membership">Membership</Link><Link href="/terms">Terms</Link><Link href="/privacy">Privacy</Link><Link href="/cookies">Cookies</Link><Link href="/refunds">Refunds</Link></div></div></footer>;
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
  const [settings, announcement, latest] = await Promise.all([getMarketingSettings(), readSitePopup(), getPreviewItems()]);
  const popupMedia = announcement?.is_enabled ? await getPopupMediaUrl(announcement.media_path) : null;
  return <>{announcement?.is_enabled && <SitePopupModal settings={announcement} mediaUrl={popupMedia}/>}<Header/><main className="marketing-main editorial-home">
    <div className="editorial-announcement"><span className="editorial-announcement-star">✦</span><span>WELCOME TO A DIFFERENT KIND OF MEDIA EXPERIENCE</span><Link href="/membership">DISCOVER THE MEMBERSHIP <ArrowUpRight size={13}/></Link></div>
    <section className="editorial-hero">
      <div className="editorial-hero-lines" aria-hidden="true"/>
      <div className="editorial-copy">
        <div className="editorial-edition"><span className="edition-line"/> AN INVITATION TO BE INSPIRED <span className="edition-index">NO. 01 / TEENS2INSPIRE</span></div>
        <h1>{settings.home_hero_title || "Good things stay with you."}</h1>
        <p className="editorial-deck">{settings.home_hero_subtitle || "Meaningful stories, honest conversations, and a little perspective for every kind of day."}</p>
        <div className="editorial-actions"><Link className="editorial-join" href="/signup">Discover your space <ArrowUpRight size={19}/></Link><Link className="editorial-quiet" href="/about">The story behind us <ArrowRight size={17}/></Link></div>
        <div className="editorial-bottom-meta"><span>CURATED WITH CARE</span><span>MADE FOR JEWISH TEEN GIRLS</span><span>EST. WITH PURPOSE</span></div>
      </div>
      <div className="editorial-hero-stage" aria-label="A visual preview of the Teens2Inspire media experience">
        <div className="editorial-stage-orbit" aria-hidden="true"/>
        <div className="editorial-feature-poster"><span className="feature-poster-topline">TEENS2INSPIRE <span>THE MEDIA EDIT</span></span>
          <span className="feature-poster-arc" aria-hidden="true"/>
          <div className="feature-poster-center"><span>THE POWER OF A MOMENT</span><strong>Stories<br/><i>worth</i><br/>keeping.</strong><p>WATCH · LISTEN · READ</p></div>
          <div className="feature-poster-bottom"><span>001 / A WORLD OF YOUR OWN</span><span>INSPIRING JEWISH TEEN GIRLS</span></div>
        </div>
        <div className="editorial-float editorial-float-one"><span>THE PODCAST</span><b>Conversations that matter.</b><Headphones size={18}/></div>
        <div className="editorial-float editorial-float-two"><span>AN ORIGINAL EXPERIENCE</span><b>A little space<br/>for yourself.</b><Heart size={18}/></div>
        <div className="editorial-stage-caption">THOUGHTFULLY CURATED <span>✳</span> MADE FOR YOUR EVERYDAY</div>
      </div>
    </section>
    <section className="editorial-ticker" aria-label="Our media formats"><div><span>YOUR NEW FAVORITE THING</span><i>✳</i><span>CONVERSATIONS</span><i>✳</i><span>STORIES</span><i>✳</i><span>INSPIRATION</span><i>✳</i><span>MADE FOR REAL LIFE</span></div></section>
    <section className="editorial-intro" id="the-feeling"><Reveal className="editorial-intro-label"><span>01 / WHY WE EXIST</span><span className="intro-vertical-line"/></Reveal><Reveal className="editorial-intro-content"><span className="editorial-overline">SOMETHING MORE MEANINGFUL</span><h2>{settings.mission_title || "Less noise. More of what matters."}</h2><p>{settings.mission_body || "A carefully curated corner of the internet for inspiring content, real conversations, and thoughtful moments."}</p><Link href="/about" className="editorial-inline-link">Get to know us <ArrowUpRight size={18}/></Link></Reveal><div className="editorial-intro-stamp"><span>TEENS2INSPIRE</span><strong>Feel<br/>inspired.</strong><small>LISTEN / WATCH / READ</small></div></section>
    <section className="editorial-formats" id="explore"><div className="editorial-section-heading"><div><span className="editorial-overline">02 / DISCOVER YOUR NEXT FAVORITE</span><h2>Made for <em>every</em> mood.</h2></div><p>Whether you have an hour or a few minutes, there’s something worth discovering.</p></div>
      <div className="editorial-formats-grid">
        <Link href="https://media.teens2inspire.org/app/explore?type=video" className="editorial-format-card editorial-format-watch"><div className="format-meta"><span>THE VISUAL EDIT</span><span>01—03</span></div><div className="format-art format-art-watch"><span className="format-play"><Play size={21} fill="currentColor"/></span><div>REAL STORIES<br/>REAL PEOPLE</div></div><div className="format-caption"><span>01 / WATCH</span><h3>A new perspective,<br/>in motion.</h3><span className="format-cta"><ArrowUpRight size={22}/></span></div></Link>
        <Link href="/podcast" className="editorial-format-card editorial-format-listen"><div className="format-meta"><span>THE AUDIO EDIT</span><span>02—03</span></div><div className="format-art format-art-listen"><div className="format-vinyl"><div className="format-vinyl-center"><Headphones size={31}/></div></div><span className="format-soundwave">⌁ ⌁ ⌁ ⌁ ⌁</span></div><div className="format-caption"><span>02 / LISTEN</span><h3>Good conversations<br/>travel with you.</h3><span className="format-cta"><ArrowUpRight size={22}/></span></div></Link>
        <Link href="https://media.teens2inspire.org/app/explore?type=article" className="editorial-format-card editorial-format-read"><div className="format-meta"><span>THE JOURNAL EDIT</span><span>03—03</span></div><div className="format-art format-art-read"><div className="format-page-art"><span>NOTES TO SELF / ISSUE 01</span><b>the little<br/><i>things.</i></b><span>A MOMENT TO KEEP.</span></div></div><div className="format-caption"><span>03 / READ</span><h3>Words you’ll want<br/>to come back to.</h3><span className="format-cta"><ArrowUpRight size={22}/></span></div></Link>
      </div>
    </section>
    <section className="editorial-discover"><div className="editorial-discover-head"><div><span className="editorial-overline">03 / FROM THE LIBRARY</span><h2>The inspiration edit.</h2></div><Link href="https://media.teens2inspire.org/" className="editorial-inline-link">Explore the media app <ArrowUpRight size={18}/></Link></div>
      <div className="editorial-library-preview">{latest.length ? latest.map((item,index)=><Link key={item.id} href="https://media.teens2inspire.org/" className="editorial-library-card"><div className={`editorial-library-cover library-color-${index}`} style={item.cover_url ? {backgroundImage:`linear-gradient(0deg,rgba(18,9,21,.5),transparent),url("${item.cover_url.replaceAll("\"", "%22")}")`} : undefined}><span>{String(index+1).padStart(2,"0")} / {item.type.toUpperCase()}</span><Play size={24}/></div><strong>{item.title}</strong><span>{item.description || "From our thoughtfully curated library."}</span></Link>) : <><div className="editorial-library-placeholder"><span>01 / LISTEN</span><strong>Beautiful conversations.<br/><i>Real inspiration.</i></strong><Headphones size={33}/></div><div className="editorial-library-placeholder library-placeholder-two"><span>02 / WATCH</span><strong>Stories with<br/><i>something to say.</i></strong><Play size={32}/></div><div className="editorial-library-placeholder library-placeholder-three"><span>03 / READ</span><strong>Words worth<br/><i>keeping close.</i></strong><BookOpen size={32}/></div></>}</div>
    </section>
    <PartnershipCarousel />
    <section className="editorial-final"><div className="editorial-final-orb"/><div className="editorial-final-content"><span className="editorial-overline">A PLACE TO COME BACK TO</span><h2>Make room for<br/><em>something good.</em></h2><p>A meaningful media experience for the moments that matter. Your next favorite conversation is waiting.</p><div className="editorial-final-actions"><Link href="/signup" className="editorial-join">Join Teens2Inspire <ArrowUpRight size={18}/></Link><Link href="/login" className="editorial-quiet">Already a member? Sign in <ArrowRight size={17}/></Link></div></div><span className="editorial-final-side">TEENS2INSPIRE / FIND WHAT MOVES YOU</span></section>
  </main><Footer/></>;
}
