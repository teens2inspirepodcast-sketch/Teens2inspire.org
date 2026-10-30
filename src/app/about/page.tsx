import { Page } from "@/components/site";
import { getMarketingSettings } from "@/lib/marketing-settings";
import Link from "next/link";
export const metadata = { title: "About | Teens2Inspire", description: "Meet founder Goldie Fishbaum and learn the mission behind Teens2Inspire." };
export default async function About() {
  const settings = await getMarketingSettings();
  const bio = settings.founder_bio || "Goldie Fishbaum is the teen founder and host of Teens2Inspire. What began as a podcast has grown into a broader media platform for Jewish teen girls. Through honest interviews and thoughtful content, Goldie creates space for girls to hear real stories, explore questions, strengthen their values, and feel less alone as they navigate adolescence.";
  const mission = settings.mission_body || "Teens2Inspire makes meaningful media easier to find: relatable stories, thoughtful conversations, practical resources, Jewish life, and personal growth in one carefully curated space.";
  return <Page title={settings.about_headline || "A place to connect, grow, and feel understood."}>
    <p className="about-lead">{settings.about_intro || "Teens2Inspire is a media platform created for Jewish teen girls who want content with substance, warmth, and a point of view."}</p>
    <section className="about-copy-section"><div className="eyebrow dark-eyebrow"><span className="eyebrow-dot"/> THE FOUNDER</div><h2>Meet Goldie Fishbaum.</h2><p>{bio}</p><p>Goldie hosts the Teens2Inspire Podcast, where Jewish teen girls share personal experiences and talk about topics that matter in real life—from friendship and peer pressure to tznius, tefilla, emunah, school, and social media. The platform is built around listening, learning, and finding practical inspiration without the constant noise of a social feed.</p></section>
    <section className="about-copy-section about-mission"><div className="eyebrow dark-eyebrow"><span className="eyebrow-dot"/> OUR MISSION</div><h2>{settings.mission_title || "Less noise. More of what matters."}</h2><p>{mission}</p><p>Our goal is to help girls discover perspectives that feel relatable, values they want to grow into, and ideas they can bring into their day.</p></section>
    <section className="about-copy-section"><div className="eyebrow dark-eyebrow"><span className="eyebrow-dot"/> ONE CURATED PLACE</div><h2>What you’ll find here.</h2><div className="about-offerings-grid"><article><strong>Watch & listen</strong><p>Original videos, podcast conversations, and stories from people who have something meaningful to share.</p></article><article><strong>Read & save</strong><p>Articles, printables, resources, recipes, and curated picks that are useful beyond a single scroll.</p></article><article><strong>Gather & grow</strong><p>Events, school access, and future community experiences that make inspiration more practical.</p></article></div></section>
    <div className="about-actions"><Link className="button button-pink" href="/podcast">Explore the podcast ↗</Link><Link className="text-link" href="/signup">Join Teens2Inspire ↗</Link></div>
  </Page>;
}
