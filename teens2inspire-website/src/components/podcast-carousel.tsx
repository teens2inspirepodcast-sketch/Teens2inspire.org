"use client";

import { useRef } from "react";
import { ArrowLeft, ArrowRight, Headphones } from "lucide-react";

const episodes = [
  { number: "✦", label: "SPECIAL", title: "Camp Must-Haves 2026", guest: "Teens2Inspire Camp Edition", topic: "Camp & Lifestyle", description: "A camp-season episode with ideas to help you feel prepared and organized.", tone: "camp", date: "Jun 26, 2026" },
  { number: "09", label: "S1 · E9", title: "The Finals Episode", guest: "ft. Chana Raff & Talya Gabay", topic: "School & Mindset", description: "Study pressure, motivation, and finding a calmer way through finals season.", tone: "finals", date: "Apr 26, 2026" },
  { number: "08", label: "S1 · E8", title: "Emunah and Bitachon", guest: "ft. Reva Schreiber", topic: "Faith & Trust", description: "Building trust in Hashem and finding strength when life feels uncertain.", tone: "emunah", date: "Mar 27, 2026" },
  { number: "07", label: "S1 · E7", title: "Don’t Grow Up Too Fast", guest: "ft. Morah Tziri Preis", topic: "Growing Up", description: "Growing through challenges, discovering purpose, and lessons learned along the way.", tone: "growth", date: "Feb 18, 2026" },
  { number: "06", label: "S1 · E6", title: "Should Teens Be Exposed to Social Media?", guest: "ft. Estie Seroya", topic: "Social Media", description: "Comparison, online pressure, and how to use social media more thoughtfully.", tone: "social", date: "Jan 8, 2026" },
  { number: "04", label: "S1 · E4", title: "Grow Yourself as a Teen", guest: "ft. Lielle Blinkoff", topic: "Personal Growth", description: "Practical inspiration for personal growth and becoming more intentional.", tone: "personal", date: "Dec 10, 2025" },
  { number: "03", label: "S1 · E3", title: "Tefilla: A Path to Hashem", guest: "ft. Dasi Glenn", topic: "Tefilla", description: "Making davening more personal and finding ways to strengthen connection.", tone: "tefilla", date: "Dec 3, 2025" },
  { number: "02", label: "S1 · E2", title: "Facing Challenges Through Strength", guest: "ft. Lily Farbowitz", topic: "Resilience", description: "Turning challenges into strength while staying connected to what matters.", tone: "strength", date: "Nov 26, 2025" },
  { number: "01", label: "S1 · E1", title: "Tackling Tznius", guest: "ft. Adina Kalaie", topic: "Tznius", description: "An honest conversation about tznius and building a meaningful relationship with it.", tone: "tznius", date: "Nov 17, 2025" },
  { number: "01", label: "SPECIAL", title: "Teens2Inspire Trailer", guest: "Meet the podcast", topic: "Welcome", description: "Meet the show and the idea behind one inspiring teen at a time.", tone: "trailer", date: "Nov 14, 2025" },
];

export function PodcastCarousel() {
  const track = useRef<HTMLDivElement>(null);
  function scroll(direction: -1 | 1) {
    if (!track.current) return;
    track.current.scrollBy({ left: direction * Math.max(280, track.current.clientWidth * 0.78), behavior: "smooth" });
  }
  return <div className="episode-carousel-wrap">
    <div className="episode-carousel-controls"><span>FEATURED CONVERSATIONS</span><div><button type="button" aria-label="Previous episodes" onClick={() => scroll(-1)}><ArrowLeft size={17} /></button><button type="button" aria-label="Next episodes" onClick={() => scroll(1)}><ArrowRight size={17} /></button></div></div>
    <div className="episode-carousel" ref={track}>
      {episodes.map((episode) => <article className="episode-card" key={episode.number + episode.title}>
        <div className={`episode-art episode-art-${episode.tone}`}>
          <span className="episode-art-kicker">TEENS2INSPIRE PODCAST</span><span className="episode-art-number">{episode.number}</span><span className="episode-art-topic">{episode.topic}</span>
          <span className="episode-art-icon"><Headphones size={20} /></span>
        </div>
        <div className="episode-card-copy"><div className="episode-meta"><span>{episode.label}</span><span>{episode.date}</span></div><h3>{episode.title}</h3><p className="episode-guest">{episode.guest}</p><p className="episode-description">{episode.description}</p><a href="#podcast-player" className="episode-open">Listen in player below <Headphones size={15} /></a></div>
      </article>)}
    </div>
    <p className="episode-carousel-note">Swipe to browse on mobile, or use the arrows to explore the collection. The full player below contains the live archive.</p>
  </div>;
}
