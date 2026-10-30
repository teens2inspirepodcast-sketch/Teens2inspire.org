import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Page } from '@/components/site';
import { getMarketingSettings } from '@/lib/marketing-settings';

export const metadata = {
  title: 'Podcast | Teens2Inspire',
  description: 'Meaningful conversations for Jewish teen girls, available with Teens2Inspire membership.'
};

/** Introducing the podcast without exposing the member catalogue on the marketing website. */
export default async function PodcastPage() {
  const settings = await getMarketingSettings();
  return <Page title={settings.podcast_hero_title || 'Real conversations. Meaningful moments.'}>
    <p className="lead">{settings.podcast_description || 'Honest conversations, personal stories, and thoughtful perspectives for Jewish teen girls.'}</p>
    <p>Discover interviews and inspiring stories alongside videos, articles, and more in your Teens2Inspire membership.</p>
    <p><Link className="button button-pink t2i-live-inline-cta" href="/signup">Join us <ArrowUpRight size={17}/></Link></p>
  </Page>;
}
