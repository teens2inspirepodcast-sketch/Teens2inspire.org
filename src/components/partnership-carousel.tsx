import { createClient } from "@/lib/supabase/server";
type Partner = { id: string; name: string; logo_url: string; website_url: string; description?: string | null };
const fallback: Partner[] = [
  { id: "mosaica-press", name: "Mosaica Press", logo_url: "/partners/mosaica-press.svg", website_url: "https://mosaicapress.com/" },
  { id: "jcc-marine-park", name: "JCC of Marine Park", logo_url: "/partners/jcc-marine-park.svg", website_url: "https://www.jccmp.org/" },
];
export async function PartnershipCarousel() {
  let partners = fallback;
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("partnerships").select("id,name,logo_url,website_url,description").eq("is_active", true).order("display_order").order("name");
    if (data?.length) partners = data as Partner[];
  } catch { /* The fallback wordmarks keep this public page usable if the CMS is temporarily offline. */ }
  const loop = [...partners, ...partners];
  return <section className="partnerships-section" aria-label="Teens2Inspire partners">
    <div className="partnerships-heading"><div><div className="eyebrow dark-eyebrow"><span className="eyebrow-dot"/> GOOD THINGS GROW TOGETHER</div><h2>Partners who inspire.</h2></div><p>Thank you to the organizations that help make meaningful conversations possible.</p></div>
    <div className="partner-marquee"><div className="partner-track">{loop.map((partner,index)=><a className="partner-logo-card" key={`${partner.id}-${index}`} href={partner.website_url} target="_blank" rel="noreferrer" aria-label={`Visit ${partner.name}`} aria-hidden={index >= partners.length ? true : undefined} tabIndex={index >= partners.length ? -1 : undefined}>
      <img src={partner.logo_url} alt={index < partners.length ? partner.name : ""} loading="lazy"/><span>{partner.name}</span>
    </a>)}</div></div>
  </section>;
}
