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

export async function Footer() {
  const settings = await getMarketingSettings();
  return <footer className="marketing-footer"><div className="footer-top"><Link className="wordmark-logo-wrap footer-logo-wrap" href="/">{settings.brand_logo_url && /^https:\/\//.test(settings.brand_logo_url) ? <img className="wordmark-logo" src={settings.brand_logo_url} alt="Teens2Inspire" width={520} height={130}/> : <Image className="wordmark-logo" src="/teens2inspire-logo.png" alt="Teens2Inspire — a media platform for Jewish teen girls" width={520} height={130} />}</Link><p>{settings.footer_tagline || "A little inspiration can change the way a day feels."}</p><Link className="footer-cta" href="https://media.teens2inspire.org/">Enter the media app <ArrowUpRight size={16}/></Link></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Teens2Inspire</span><span>Made with intention.</span><div><Link href="/contact">Contact</Link><Link href="/school">School access</Link><Link href="/membership">Membership</Link><Link href="/terms">Terms</Link><Link href="/privacy">Privacy</Link><Link href="/cookies">Cookies</Link><Link href="/refunds">Refunds</Link></div></div></footer>;
}

export async function Page({ title, children }: { title: string; children: React.ReactNode }) {
  const settings = await getMarketingSettings();
  return <><Header logoSrc={settings.brand_logo_url}/><main className="inner-page"><div className="inner-page-glow"/><div className="inner-page-content"><div className="eyebrow"><span className="eyebrow-dot"/> TEENS2INSPIRE / THE STORY</div><h1>{title}</h1><div className="inner-copy">{children}</div></div></main><Footer/></>;
}

async function getPreviewItems(): Promise<PreviewItem[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("content").select("id,title,description,type,cover_url").eq("status", "published").order("published_at", { ascending: false }).limit(12);
    return (data || []).map(row => ({ ...row, cover_url: typeof row.cover_url === "string" && row.cover_url.startsWith("/api/media/artwork/") ? `https://media.teens2inspire.org${row.cover_url}` : row.cover_url })) as PreviewItem[];
  } catch { return []; }
}

export async function Home() {
  const [settings, announcement, latest] = await Promise.all([getMarketingSettings(), readSitePopup(), getPreviewItems()]);
  const popupMedia = announcement?.is_enabled ? await getPopupMediaUrl(announcement.media_path) : null;
  const featured = latest[0];
  return <>
    {announcement?.is_enabled && <SitePopupModal settings={announcement} mediaUrl={popupMedia} />}
    <Header logoSrc={settings.brand_logo_url}/>
    <main className="t2i-site-streaming">
      <section className="t2i-site-hero" aria-labelledby="t2i-site-headline">
        <div className="t2i-site-soft-light" aria-hidden="true" />{settings.home_hero_image_url && /^https:\/\//.test(settings.home_hero_image_url) && <div className="t2i-site-custom-hero-image" aria-hidden="true" style={{backgroundImage:`url("${settings.home_hero_image_url.replaceAll('"','%22')}")`}}/>}
        <span className="t2i-site-kicker"><span/> A MEDIA SPACE MADE FOR YOU</span>
        <h1 id="t2i-site-headline">{settings.home_hero_title || <>A little more<br/><em>inspiration.</em><br/>Every day.</>}</h1>
        <p className="t2i-site-deck">{settings.home_hero_subtitle || "Discover meaningful videos, conversations, and stories — thoughtfully curated for Jewish teen girls."}</p>
        <div className="t2i-site-hero-actions"><Link href="/signup" className="t2i-site-join">Join Teens2Inspire <ArrowUpRight size={18}/></Link><Link href="/about" className="t2i-site-outline">Learn more <ArrowRight size={17}/></Link></div>
        <span className="t2i-site-underhero">WATCH. LISTEN. READ. BE INSPIRED.</span>
      </section>
      <section className="t2i-site-preview-block" aria-label="Preview the Teens2Inspire media app">
        <div className="t2i-site-preview-header"><div><span className="t2i-site-label">YOUR NEW FAVORITE SPACE</span><h2>{settings.home_app_title || "Everything you love. All in one place."}</h2></div><p>{settings.home_app_description || "One beautiful media library, filled with meaningful content. Stream a conversation, discover a new perspective, or save something for later."}</p></div>
        <div className="t2i-site-app-window">
          <div className="t2i-site-app-toolbar"><span className="t2i-site-app-brand">Teens<span>2</span>Inspire</span><div><span>Explore</span><span>Listen</span><span>Watch</span><span>Library</span></div><span className="t2i-site-app-avatar">T</span></div>
          <div className="t2i-site-app-hero"><div className="t2i-site-app-hero-text"><span>THE INSPIRATION COLLECTION</span><strong>Good things<br/>start here.</strong><small>Beautiful content for your everyday.</small><Link href="https://media.teens2inspire.org/app" className="t2i-site-app-mini-button">Explore the app <ArrowRight size={13}/></Link></div>{featured?.cover_url && <div className="t2i-site-app-hero-image" style={{backgroundImage:`url("${featured.cover_url.replaceAll('"','%22')}")`}} aria-hidden="true"/>}<span className="t2i-site-app-hero-glow"/></div>
          <div className="t2i-site-app-shelf-heading"><strong>Handpicked for you</strong><span>Discover more <ArrowRight size={12}/></span></div>
          <div className="t2i-site-app-covers">{latest.slice(0,5).map((item, i)=><Link href={`https://media.teens2inspire.org/app/content/${encodeURIComponent(item.id)}`} key={item.id} className="t2i-site-app-cover"><div className={`t2i-site-cover-art t2i-site-cover-${i}`} style={item.cover_url ? {backgroundImage:`url("${item.cover_url.replaceAll('"','%22')}")`} : undefined}>{!item.cover_url && <span>Teens2Inspire</span>}</div><b>{item.title}</b><small>{item.type}</small></Link>)}{!latest.length && ["Watch","Listen","Read","Discover"].map((name,i)=><div className="t2i-site-app-cover" key={name}><div className={`t2i-site-cover-art t2i-site-cover-${i}`}><span>Teens2Inspire</span></div><b>{name} with purpose</b><small>COMING SOON</small></div>)}</div>
        </div>
        <div className="t2i-site-app-preview-footer"><span>AN EXPERIENCE MADE FOR YOU</span><Link href="https://media.teens2inspire.org/app">Open the media app <ArrowUpRight size={17}/></Link></div>
      </section>
      <section className="t2i-site-library-section" aria-labelledby="t2i-site-library-title"><div className="t2i-site-library-top"><div><span className="t2i-site-label">FROM OUR LIBRARY</span><h2 id="t2i-site-library-title">Find something <em>meaningful.</em></h2></div><Link href="https://media.teens2inspire.org/app/explore">Browse all <ArrowUpRight size={17}/></Link></div>
        {latest.length ? <div className="t2i-site-content-row">{latest.map(item=><Link className="t2i-site-content-card" key={item.id} href={`https://media.teens2inspire.org/app/content/${encodeURIComponent(item.id)}`}><div className="t2i-site-content-art" style={item.cover_url ? {backgroundImage:`url("${item.cover_url.replaceAll('"','%22')}")`} : undefined}>{!item.cover_url && <span>Teens2Inspire</span>}<i><Play size={18} fill="currentColor" /></i></div><small>{item.type}</small><h3>{item.title}</h3><p>{item.description || "Discover this story in the Teens2Inspire app."}</p></Link>)}</div> : <p className="t2i-site-no-content">Newly published videos, podcasts, and stories will appear here automatically from the Teens2Inspire library.</p>}
      </section>
      <section className="t2i-site-format-band"><div><Headphones size={26}/><strong>Listen</strong><span>Conversations that stay with you.</span></div><div><Play size={26}/><strong>Watch</strong><span>Beautiful stories and new perspectives.</span></div><div><BookOpen size={26}/><strong>Read</strong><span>Fresh ideas for real life.</span></div></section>
      <section className="t2i-site-membership"><span className="t2i-site-label">YOUR SPACE STARTS HERE</span><h2>{settings.home_membership_title || "More inspiration. Less noise."}</h2><p>{settings.home_membership_description || "Join Teens2Inspire and enjoy a thoughtfully curated media experience made for Jewish teen girls."}</p><div className="t2i-site-membership-actions"><Link href="/membership" className="t2i-site-join">Explore membership <ArrowUpRight size={18}/></Link><Link href="/school" className="t2i-site-outline">School access</Link></div><div className="t2i-site-price-notes"><span>PERSONAL · $7.99/MONTH</span><span>FAMILY · $9.99/MONTH</span><span>ELIGIBLE SCHOOLS · FREE</span></div></section>
    </main><Footer/>
  </>;
}
