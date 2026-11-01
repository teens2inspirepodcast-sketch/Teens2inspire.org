# Teens2Inspire website — November 1 improvements

- The Podcast page includes the RSS.com whole-show player, configured to list up to 100 episodes (the full present catalogue), plus direct links to Spotify, Apple Podcasts, Amazon Music, RSS.com and 24Six.
- Listening-platform fallback images now use recognizable third-party brand icons/favicons rather than handcrafted imitation logos. Logos and listening URLs remain editable via `podcast_platforms` in the media admin dashboard.
- The homepage now includes two phone mockup visuals. Upload images to `Mock-up pictures — main phone` and `Mock-up pictures — second phone` in `/admin/website` or the media-app `/admin/site-settings`; Supabase `marketing_settings` persists the changes.
- Public pages retain the original membership/signup flow, partner carousel, and live pop-up system.
- The pop-up is currently disabled in Supabase. Enable it and save through the media-app's new `/admin/popup` page or the original website `/admin/popup` page. The media-app editor uses the same login session as the media-app admin (no separate cross-domain sign-in needed).
- No existing Stripe checkout/webhook, membership, or R2 playback API source files were altered.

QA limitations: packages passed syntax/CSS and ZIP integrity checks, but full Next.js production builds and live RSS embed / upload / cross-domain pop-up tests have not run. The RSS.com iframe uses its official show-level player URL format; final live validation is still required.
