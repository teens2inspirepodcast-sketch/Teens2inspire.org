import Link from 'next/link';
import { ArrowUpRight, Headphones } from 'lucide-react';
import { Page } from '@/components/site';
import { getMarketingSettings } from '@/lib/marketing-settings';
import { PodcastPlatformLinks } from '@/components/podcast-platform-links';

export const metadata = {
  title: 'Podcast | Teens2Inspire',
  description: 'Listen to all Teens2Inspire podcast episodes and find our show on your favorite listening platform.',
};

/** RSS.com maintains the public playlist as episodes are published. */
export default async function PodcastPage() {
  const settings = await getMarketingSettings();
  return <Page title={settings.podcast_hero_title || 'The Teens2Inspire Podcast'}>
    <p className="lead">{settings.podcast_description || 'Real conversations, meaningful perspectives, and inspiration made for Jewish teen girls.'}</p>
    <section className="t2i-rss-podcast-section" aria-label="Listen to all Teens2Inspire podcast episodes">
      <div className="t2i-rss-heading"><Headphones size={22}/><div><h2>Listen to every episode.</h2><p>Play the show right here. New episodes appear as they are published.</p></div></div>
      <iframe src="https://player.rss.com/teens2inspire?theme=light&v=2&limit=100" title="Teens2Inspire Podcast — complete RSS.com playlist" width="100%" height="650" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" scrolling="yes" />
      <p className="t2i-rss-fallback">Trouble playing? <a href="https://rss.com/podcasts/teens2inspire/" target="_blank" rel="noopener noreferrer">Open the podcast on RSS.com <ArrowUpRight size={15}/></a></p>
    </section>
    <PodcastPlatformLinks />
    <section className="t2i-podcast-endcta"><h2>More inspiration, all in one place.</h2><p>Join Teens2Inspire for videos, articles, and a personal media library.</p><Link href="/signup" className="button button-pink">Join us <ArrowUpRight size={17}/></Link></section>
  </Page>;
}
