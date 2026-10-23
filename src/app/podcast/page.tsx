import { Header } from "@/components/site-header";
import { Footer } from "@/components/site";
import { PodcastCarousel } from "@/components/podcast-carousel";
import { createClient } from "@/lib/supabase/server";
import { getMarketingSettings } from "@/lib/marketing-settings";
import { PodcastPlatformLinks } from "@/components/podcast-platform-links";

export const metadata = {
  title: "Podcast | Teens2Inspire",
  description: "Explore the Teens2Inspire Podcast: honest conversations and meaningful inspiration for Jewish teen girls.",
};

export default async function PodcastPage() {
  const settings = await getMarketingSettings();
  let episodes: Array<{ id: string; title: string; description: string | null; cover_url: string | null; published_at: string | null }> = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("content").select("id,title,description,cover_url,published_at").eq("type", "podcast").eq("status", "published").order("published_at", { ascending: false });
    episodes = (data || []) as typeof episodes;
  } catch { /* The Spotify player remains available if the content catalogue is temporarily unavailable. */ }
  return <>
    <Header />
    <main className="podcast-page">
      <section className="podcast-hero">
        <div className="podcast-hero-glow" aria-hidden="true" />
        <div className="eyebrow"><span className="eyebrow-dot" /> THE TEENS2INSPIRE PODCAST</div>
        <h1>Real conversations.<br /><em>Meaningful moments.</em></h1>
        <p>{settings.podcast_description || "Honest conversations, personal stories, and fresh perspectives from Jewish teen girls and the people who inspire them."}</p>
        <a className="podcast-hero-link" href="#episodes">Explore episodes <span aria-hidden="true">↓</span></a>
      </section>

      <section className="podcast-library" id="episodes">
        <div className="podcast-library-heading">
          <div><div className="eyebrow"><span className="eyebrow-dot" /> THE EPISODE LIBRARY</div><h2>Find a conversation<br /><em>that speaks to you.</em></h2></div>
          <p>Browse the collection, choose a topic, and settle into a conversation.</p>
        </div>
        <PodcastCarousel episodes={episodes} />
      </section>

      <PodcastPlatformLinks />

      <section className="podcast-player-section" id="podcast-player">
        <div className="podcast-player-copy"><div className="eyebrow"><span className="eyebrow-dot" /> THE FULL SHOW</div><h2>All episodes,<br /><em>in one place.</em></h2><p>Listen to the Teens2Inspire show directly on Spotify. The embedded show player includes episodes from the Spotify catalogue and updates as new episodes are published.</p></div>
        <div className="podcast-player-frame"><iframe src="https://open.spotify.com/embed/show/4rpRDVE1wGkP8trMxKfxZo?utm_source=generator&theme=0" title="Teens2Inspire Podcast — all episodes" width="100%" height="520" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen scrolling="no" /><p>Having trouble with the embedded player? <a href="https://open.spotify.com/show/4rpRDVE1wGkP8trMxKfxZo" target="_blank" rel="noreferrer">Open the Teens2Inspire Podcast on Spotify</a>.</p></div>
      </section>
    </main>
    <Footer />
  </>;
}
