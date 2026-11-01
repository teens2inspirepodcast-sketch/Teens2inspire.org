import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { TemporaryBrandLogo } from "@/components/temporary-brand-logo";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Teens2Inspire | The Podcast",
  description: "Listen to Teens2Inspire, a podcast for Jewish teen girls. Follow the countdown, explore episodes, and discover our community partners.",
  openGraph: {
    title: "Teens2Inspire | The Podcast",
    description: "Real conversations. Fresh perspectives. Inspiration worth sharing.",
    type: "website",
  },
};

type Partner = { id: string; name: string; logo_url: string | null; website_url: string | null };
type Platform = { id: string; name: string; logo_url: string | null; website_url: string | null };

const storedPartners: Partner[] = [
  { id: "koch-la-ni", name: "Koch La Ni®", logo_url: "https://mphswidvmesdkefkgwjz.supabase.co/storage/v1/object/public/site-brand-assets/branding/4bde983a-7d19-4722-a4f1-be3c44347480.jpg", website_url: "https://kochlani.com/" },
  { id: "mosaica-press", name: "Mosaica Press", logo_url: "https://thejwws.com/wp-content/uploads/2017/04/Mosaica-Press-logo.jpg", website_url: "https://mosaicapress.com/" },
  { id: "jcc-marine-park", name: "The JCC of Marine Park", logo_url: "https://www.jccmp.org/wp-content/themes/jccmp/images/logos/jccmp_logo.png?ver=3732", website_url: "https://www.jccmp.org/" },
];

const listeningPlatforms: Platform[] = [
  { id: "spotify", name: "Spotify", logo_url: "https://cdn.simpleicons.org/spotify/1DB954", website_url: "https://open.spotify.com/show/4rpRDVE1wGkP8trMxKfxZo" },
  { id: "apple", name: "Apple Podcasts", logo_url: "https://cdn.simpleicons.org/applepodcasts/9933CC", website_url: "https://podcasts.apple.com/us/podcast/teens2inspire/id1853452190" },
  { id: "amazon", name: "Amazon Music", logo_url: "https://cdn.simpleicons.org/amazonmusic/46C3D0", website_url: "https://music.amazon.com/podcasts/d9a85777-a125-49ab-a6d2-ef1ccb44a122/teens2inspire" },
  { id: "rss", name: "RSS.com", logo_url: "https://www.google.com/s2/favicons?domain=rss.com&sz=128", website_url: "https://rss.com/podcasts/teens2inspire/" },
  { id: "24six", name: "24Six", logo_url: "https://www.google.com/s2/favicons?domain=24six.app&sz=128", website_url: "https://24six.app/app/podcast/artist/3540" },
];

function safeHttps(raw: string | null): string | null {
  if (!raw) return null;
  try {
    const link = new URL(raw);
    return link.protocol === "https:" ? link.toString() : null;
  } catch { return null; }
}

async function getActivePartners(): Promise<Partner[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("partnerships")
      .select("id,name,logo_url,website_url")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });
    if (!error && data) return data as Partner[];
  } catch { /* Keep the temporary page available even if the database is offline. */ }
  return storedPartners;
}

export default async function TemporaryPodcastLanding() {
  const partners = await getActivePartners();

  return (
    <main className="t2i-temp" id="top">
      <div className="t2i-temp-topline" aria-hidden="true" />
      <header className="t2i-temp-header">
        <a href="#top" className="t2i-temp-logo-wrap" aria-label="Teens2Inspire — top of page">
          <img src="/teens2inspire-logo.png" alt="Teens2Inspire" width="225" height="75" />
        </a>
        <nav className="t2i-temp-nav" aria-label="Page sections">
          <a href="#countdown">Countdown</a>
          <a href="#podcast">Podcast</a>
          <a href="#partners">Partners</a>
        </nav>
        <a href="#podcast" className="t2i-temp-nav-action">Listen now <span aria-hidden="true">↗</span></a>
      </header>

      <section className="t2i-temp-hero" aria-labelledby="t2i-temp-headline">
        <div className="t2i-temp-hero-glow" aria-hidden="true" />
        <div className="t2i-temp-hero-grid">
          <div className="t2i-temp-hero-copy">
            <div className="t2i-temp-overline"><span className="t2i-temp-overline-dot" /> THE TEENS2INSPIRE PODCAST</div>
            <h1 id="t2i-temp-headline">A little <em>inspiration</em> goes a long way.</h1>
            <p>Real conversations. Fresh perspectives. Meaningful moments for Jewish teen girls.</p>
            <div className="t2i-temp-hero-actions">
              <a href="#podcast" className="t2i-temp-btn t2i-temp-btn-primary">Listen to the podcast <span aria-hidden="true">↗</span></a>
              <a href="#countdown" className="t2i-temp-text-link">See the countdown <span aria-hidden="true">↓</span></a>
            </div>
          </div>
          <div className="t2i-temp-countdown-frame" id="countdown">
            <div className="t2i-temp-countdown-label"><span className="t2i-temp-tiny-sparkle">✳</span> SOMETHING TO LOOK FORWARD TO</div>
            <h2>The countdown<br/><em>is on.</em></h2>
            <div className="t2i-temp-embed-container">
              <iframe
                width="300" height="154"
                src="https://w2.countingdownto.com/7396542"
                title="Teens2Inspire countdown"
                loading="lazy"
                scrolling="no"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
            <p>Keep this page close. There&apos;s more ahead.</p>
          </div>
        </div>
        <div className="t2i-temp-hero-bottom"><span>LISTEN · REFLECT · GROW</span><span aria-hidden="true">✦</span><span>ONE CONVERSATION AT A TIME</span></div>
      </section>

      <section className="t2i-temp-podcast-section" id="podcast" aria-labelledby="t2i-temp-podcast-title">
        <div className="t2i-temp-section-heading">
          <div className="t2i-temp-overline t2i-temp-overline-pink">01 / PRESS PLAY</div>
          <h2 id="t2i-temp-podcast-title">Conversations worth <em>coming back to.</em></h2>
          <p>Catch up on Teens2Inspire episodes right here. The playlist updates as new episodes are released.</p>
        </div>
        <div className="t2i-temp-player-panel">
          <div className="t2i-temp-player-top"><span className="t2i-temp-live-dot" /> NOW ON TEENS2INSPIRE <span className="t2i-temp-player-bars" aria-hidden="true">▂▅▃▆</span></div>
          <iframe
            src="https://player.rss.com/teens2inspire?theme=light&v=2&limit=100"
            title="Teens2Inspire complete podcast playlist"
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            width="100%"
            height="650"
          />
          <div className="t2i-temp-player-bottom">
            <span>All episodes, one place.</span>
            <a href="https://rss.com/podcasts/teens2inspire/" target="_blank" rel="noopener noreferrer">Open on RSS.com <span aria-hidden="true">↗</span></a>
          </div>
        </div>

        <div className="t2i-temp-platform-section" aria-labelledby="t2i-temp-platform-title">
          <div className="t2i-temp-platform-intro"><h3 id="t2i-temp-platform-title">Listen your way.</h3><p>Find Teens2Inspire on your favorite podcast platform.</p></div>
          <div className="t2i-temp-platform-grid">
            {listeningPlatforms.map((platform) => {
              const href = safeHttps(platform.website_url);
              if (!href) return null;
              return <a key={platform.id} className="t2i-temp-platform-link" href={href} target="_blank" rel="noopener noreferrer">
                <span className="t2i-temp-platform-icon"><TemporaryBrandLogo src={platform.logo_url} name={platform.name} /></span>
                <span>{platform.name}</span><span className="t2i-temp-platform-arrow" aria-hidden="true">↗</span>
              </a>;
            })}
          </div>
        </div>
      </section>

      <section className="t2i-temp-partners-section" id="partners" aria-labelledby="t2i-temp-partners-title">
        <div className="t2i-temp-partners-inner">
          <div className="t2i-temp-section-heading">
            <div className="t2i-temp-overline t2i-temp-overline-pink">02 / BETTER TOGETHER</div>
            <h2 id="t2i-temp-partners-title">Good things grow <em>together.</em></h2>
            <p>Thank you to the brands and organizations supporting Teens2Inspire.</p>
          </div>
          <div className="t2i-temp-partners-grid">
            {partners.length > 0 ? partners.map((partner) => {
              const href = safeHttps(partner.website_url);
              const card = <>
                <span className="t2i-temp-partner-logo"><TemporaryBrandLogo src={safeHttps(partner.logo_url)} name={partner.name}/></span>
                <span className="t2i-temp-partner-info"><strong>{partner.name}</strong><span aria-hidden="true">↗</span></span>
              </>;
              return href ? <a className="t2i-temp-partner" key={partner.id} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${partner.name}`}>{card}</a>
                : <div className="t2i-temp-partner" key={partner.id}>{card}</div>;
            }) : <p>Partnerships will be featured here soon.</p>}
          </div>
        </div>
      </section>

      <footer className="t2i-temp-footer">
        <div className="t2i-temp-footer-inner">
          <a className="t2i-temp-footer-name" href="#top">TEENS<span>2</span>INSPIRE</a>
          <p>A podcast for Jewish teen girls.</p>
          <span>© {new Date().getFullYear()} Teens2Inspire</span>
        </div>
      </footer>
    </main>
  );
}
