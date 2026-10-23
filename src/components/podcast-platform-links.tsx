import { createClient } from "@/lib/supabase/server";
type Platform = { id: string; name: string; logo_url: string; website_url: string };
const fallback: Platform[] = [
  { id: "spotify", name: "Spotify", logo_url: "/podcast-platforms/spotify.svg", website_url: "https://open.spotify.com/show/4rpRDVE1wGkP8trMxKfxZo" },
  { id: "apple-podcasts", name: "Apple Podcasts", logo_url: "/podcast-platforms/apple-podcasts.svg", website_url: "https://podcasts.apple.com/us/podcast/teens2inspire/id1878248319" },
  { id: "amazon-music", name: "Amazon Music", logo_url: "/podcast-platforms/amazon-music.svg", website_url: "https://music.amazon.com/podcasts/d9a85777-a125-49ab-a6d2-ef1ccb44a122/teens2inspire" },
  { id: "rss-com", name: "RSS.com", logo_url: "/podcast-platforms/rss-com.svg", website_url: "https://rss.com/podcasts/teens2inspire/" },
  { id: "24six", name: "24Six", logo_url: "/podcast-platforms/24six.svg", website_url: "https://24six.app/preview/podcast/collection/22024/teens2inspire" },
];
export async function PodcastPlatformLinks() {
  let platforms = fallback;
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("podcast_platforms").select("id,name,logo_url,website_url").eq("is_active", true).order("display_order").order("name");
    if (data?.length) platforms = data as Platform[];
  } catch { /* Fallback links are still useful when Supabase is offline. */ }
  return <section className="podcast-platform-section" aria-label="Listen to Teens2Inspire on your preferred podcast platform">
    <div className="podcast-platform-heading"><div className="eyebrow"><span className="eyebrow-dot"/> LISTEN YOUR WAY</div><h2>Find us wherever<br/><em>you listen.</em></h2><p>Choose your favorite podcast app to follow the show and listen to new episodes.</p></div>
    <div className="podcast-platform-grid">{platforms.map(platform=><a className="podcast-platform-card" key={platform.id} href={platform.website_url} target="_blank" rel="noreferrer" aria-label={`Listen to Teens2Inspire on ${platform.name}`}><img src={platform.logo_url} alt={platform.name} loading="lazy"/><span>{platform.name}</span><span className="podcast-platform-arrow" aria-hidden="true">↗</span></a>)}</div>
  </section>;
}
