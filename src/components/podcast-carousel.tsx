"use client";

import { useRef } from "react";
import { ArrowLeft, ArrowRight, Headphones } from "lucide-react";

type Episode = { id: string; title: string; description: string | null; cover_url: string | null; published_at: string | null };

export function PodcastCarousel({ episodes }: { episodes: Episode[] }) {
  const track = useRef<HTMLDivElement>(null);
  function scroll(direction: -1 | 1) {
    if (!track.current) return;
    track.current.scrollBy({ left: direction * Math.max(280, track.current.clientWidth * 0.78), behavior: "smooth" });
  }
  return <div className="episode-carousel-wrap">
    <div className="episode-carousel-controls"><span>FEATURED CONVERSATIONS</span><div><button type="button" aria-label="Previous episodes" onClick={() => scroll(-1)}><ArrowLeft size={17} /></button><button type="button" aria-label="Next episodes" onClick={() => scroll(1)}><ArrowRight size={17} /></button></div></div>
    {episodes.length ? <div className="episode-carousel" ref={track}>
      {episodes.map((episode) => <article className="episode-card" key={episode.id}>
        <div className={`episode-art ${episode.cover_url ? "episode-art-has-cover" : "episode-art-fallback"}`} style={episode.cover_url ? { backgroundImage: `linear-gradient(0deg,rgba(24,9,17,.82),rgba(24,9,17,.02) 74%),url("${episode.cover_url}")` } : undefined}>
          <span className="episode-art-kicker">TEENS2INSPIRE PODCAST</span><span className="episode-art-topic">{episode.title}</span><span className="episode-art-icon"><Headphones size={20} /></span>
        </div>
        <div className="episode-card-copy"><div className="episode-meta"><span>EPISODE</span><span>{episode.published_at ? new Date(episode.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Teens2Inspire"}</span></div><h3>{episode.title}</h3><p className="episode-description">{episode.description || "A meaningful conversation from the Teens2Inspire Podcast."}</p><a href="#podcast-player" className="episode-open">Listen on Spotify <Headphones size={15} /></a></div>
      </article>)}
    </div> : <div className="episode-empty-state"><p>Episode covers and featured conversations will appear here as podcast episodes are published in the media library.</p></div>}
    <p className="episode-carousel-note">Swipe to browse on mobile, or use the arrows to explore the collection. The Spotify player below includes the complete show archive.</p>
  </div>;
}
