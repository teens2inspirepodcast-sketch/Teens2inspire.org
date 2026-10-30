import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Header } from "@/components/site-header";
import { getMarketingSettings } from "@/lib/marketing-settings";
import { PartnershipCarousel } from "@/components/partnership-carousel";
import { SitePopupModal } from "@/components/site-popup";
import { readSitePopup, getPopupMediaUrl } from "@/lib/site-popup";

export async function Footer() {
  const settings = await getMarketingSettings();
  return <footer className="marketing-footer">
    <div className="footer-top">
      <Link className="wordmark-logo-wrap footer-logo-wrap" href="/" aria-label="Teens2Inspire home">
        {settings.brand_logo_url && /^https:\/\//.test(settings.brand_logo_url)
          ? <img className="wordmark-logo" src={settings.brand_logo_url} alt="Teens2Inspire" width={520} height={130}/>
          : <Image className="wordmark-logo" src="/teens2inspire-logo.png" alt="Teens2Inspire" width={520} height={130}/>}
      </Link>
      <p>{settings.footer_tagline || "Inspiring Jewish teen girls."}</p>
      <Link className="footer-cta" href="/signup">Join us <ArrowUpRight size={16}/></Link>
    </div>
    <div className="footer-bottom">
      <span>© {new Date().getFullYear()} Teens2Inspire</span>
      <span>Made with intention.</span>
      <div><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/school">School access</Link><Link href="/membership">Membership</Link><Link href="/terms">Terms</Link><Link href="/privacy">Privacy</Link><Link href="/cookies">Cookies</Link><Link href="/refunds">Refunds</Link></div>
    </div>
  </footer>;
}

export async function Page({ title, children }: { title: string; children: React.ReactNode }) {
  const settings = await getMarketingSettings();
  return <><Header logoSrc={settings.brand_logo_url}/><main className="inner-page"><div className="inner-page-glow"/><div className="inner-page-content"><div className="eyebrow"><span className="eyebrow-dot"/> TEENS2INSPIRE</div><h1>{title}</h1><div className="inner-copy">{children}</div></div></main><Footer/></>;
}

/** A marketing homepage, not a public mirror of members-only media. */
export async function Home() {
  const [settings, announcement] = await Promise.all([getMarketingSettings(), readSitePopup()]);
  const popupMedia = announcement?.is_enabled ? await getPopupMediaUrl(announcement.media_path) : null;
  return <>
    {announcement?.is_enabled && <SitePopupModal settings={announcement} mediaUrl={popupMedia}/>}
    <Header logoSrc={settings.brand_logo_url}/>
    <main className="t2i-live-home">
      <section className="t2i-live-hero" aria-labelledby="t2i-live-headline">
        <div className="t2i-live-ambient" aria-hidden="true"/>
        <h1 id="t2i-live-headline">{settings.home_hero_title || "Everything you love. All in one place."}</h1>
        <Link href="/signup" className="t2i-live-join">Join Us <ArrowUpRight aria-hidden="true" size={20}/></Link>
      </section>
      <PartnershipCarousel/>
    </main>
    <Footer/>
  </>;
}
