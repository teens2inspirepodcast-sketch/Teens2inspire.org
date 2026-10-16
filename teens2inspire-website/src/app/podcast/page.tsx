import { Header } from "@/components/site-header";
import { Footer } from "@/components/site";
import { PodcastCarousel } from "@/components/podcast-carousel";

export const metadata = {
  title: "Podcast | Teens2Inspire",
  description: "Explore the Teens2Inspire Podcast: honest conversations and meaningful inspiration for Jewish teen girls.",
};

export default function PodcastPage() {
  return <>
    <Header />
    <main className="podcast-page">
      <section className="podcast-hero">
        <div className="podcast-hero-glow" aria-hidden="true" />
        <div className="eyebrow"><span className="eyebrow-dot" /> THE TEENS2INSPIRE PODCAST</div>
        <h1>Real conversations.<br /><em>Meaningful moments.</em></h1>
        <p>Honest conversations, personal stories, and fresh perspectives from Jewish teen girls and the people who inspire them.</p>
        <a className="podcast-hero-link" href="#episodes">Explore episodes <span aria-hidden="true">↓</span></a>
      </section>

      <section className="podcast-library" id="episodes">
        <div className="podcast-library-heading">
          <div><div className="eyebrow"><span className="eyebrow-dot" /> THE EPISODE LIBRARY</div><h2>Find a conversation<br /><em>that speaks to you.</em></h2></div>
          <p>Browse the collection, choose a topic, and settle into a conversation.</p>
        </div>
        <PodcastCarousel />
      </section>

      <section className="podcast-player-section" id="podcast-player">
        <div className="podcast-player-copy"><div className="eyebrow"><span className="eyebrow-dot" /> THE FULL SHOW</div><h2>All episodes,<br /><em>in one place.</em></h2><p>The complete podcast player includes the latest releases and the full episode archive. New episodes appear there as they are published.</p></div>
        <div className="podcast-player-frame"><iframe src="https://player.rss.com/teens2inspire?theme=dark&v=2" title="Teens2Inspire Podcast — all episodes" width="100%" height="520" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen scrolling="no" /><p>Having trouble with the embedded player? <a href="https://rss.com/podcasts/teens2inspire" target="_blank" rel="noreferrer">Open the Teens2Inspire Podcast archive</a>.</p></div>
      </section>
    </main>
    <Footer />
  </>;
}
