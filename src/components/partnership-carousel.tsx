import { ArrowUpRight, HeartHandshake } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type Partner = {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  description?: string | null;
};

function safeUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

/**
 * Homepage partners are loaded from the existing Supabase partnership CMS.
 * Only active records appear; changing an entry in Admin updates this section.
 * No fallback partners are hard-coded or displayed as active endorsements.
 */
export async function PartnershipCarousel() {
  let partners: Partner[] = [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("partnerships")
      .select("id,name,logo_url,website_url,description")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });
    if (!error && data) partners = data as Partner[];
  } catch {
    // Keep the homepage available if Supabase is temporarily unavailable.
  }

  if (partners.length === 0) return null;

  return (
    <section className="t2i-home-partners" id="partners" aria-labelledby="t2i-partners-title">
      <div className="t2i-home-partners-inner">
        <div className="t2i-home-partners-heading">
          <div>
            <span className="t2i-home-partners-eyebrow"><HeartHandshake size={16} aria-hidden="true"/> GROWING TOGETHER</span>
            <h2 id="t2i-partners-title">Inspiring things happen <em>together.</em></h2>
          </div>
          <p>We're grateful for the brands and organizations supporting the Teens2Inspire community.</p>
        </div>
        <div className="t2i-home-partner-grid" role="list">
            {partners.map((partner) => {
              const href = safeUrl(partner.website_url);
              const logo = safeUrl(partner.logo_url);
              const content = (
                <>
                  <span className="t2i-home-partner-mark">
                    {logo ? <img src={logo} loading="lazy" alt={`${partner.name} logo`} /> : <span>{partner.name}</span>}
                  </span>
                  <span className="t2i-home-partner-footer">
                    <strong>{partner.name}</strong>
                    {href && <ArrowUpRight size={17} aria-hidden="true"/>}
                  </span>
                </>
              );
              return <div key={partner.id} role="listitem">
                {href ? <a className="t2i-home-partner" href={href} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${partner.name} (opens in a new tab)`}>{content}</a> : <div className="t2i-home-partner">{content}</div>}
              </div>;
            })}
        </div>
        <div className="t2i-home-partners-bottom">
          <Link href="/contact">Interested in partnering? <ArrowUpRight size={16} aria-hidden="true"/></Link>
        </div>
      </div>
    </section>
  );
}
