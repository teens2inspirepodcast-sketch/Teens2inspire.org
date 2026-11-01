# Teens2Inspire — Temporary podcast-only homepage

This is a **complete copy of the existing Teens2Inspire website project** with the homepage temporarily replaced by a single podcast-centric landing page. The underlying Stripe webhooks, account verification, protected admin, Supabase integrations and legal pages remain in the project rather than being deleted. The media app is NOT included or changed.

## What visitors see

- A branded, responsive one-page homepage: Countdown, Podcast, Partners.
- The exact existing countdown embed at https://w2.countingdownto.com/7396542.
- The RSS.com show playlist at https://player.rss.com/teens2inspire?theme=light&v=2&limit=100.
- Links to Spotify, Apple Podcasts, Amazon Music, RSS.com and 24Six.
- Active partnership logos/links loaded from the existing Supabase partnership table. The last verified active partners are included as an offline fallback.
- No host biography, media app marketing, membership promotional copy, or sign-up buttons on the temporary homepage.

Former public editorial routes (About, Podcast, Events, School, Contact, etc.) redirect to the one-page landing. Essential account, legal, API and admin endpoints are retained (although not linked on the landing page) to avoid interrupting existing integrations.

## Important countdown label note

The countdown is a **third-party iframe** supplied earlier. Its *internal* wording is controlled on countingdownto.com, not in the website code. If the iframe itself still displays a name mentioning an app launch, change the countdown's title in the countdown service. This website does not label it as an app launch.

## Deploy carefully from your laptop

1. **Back up your current full website code first** (for example, keep the existing latest full ZIP and Git commit). Do not delete the GitHub repository or `.git` folder.
2. Clone/open the existing `teens2inspirepodcast-sketch/Teens2inspire.org` repository in GitHub Desktop.
3. Copy the *contents* of this extracted package over the corresponding files in the clone, retaining the `.git` folder. The site also retains its other existing routes and APIs intentionally; don't wipe these.
4. Commit and push. Vercel will build the `teens2inspire.org` project if Git integration is enabled.
5. Verify homepage on desktop/mobile, RSS player, countdown iframe, and logo links. Check Stripe webhook events independently if you have active subscriptions.
6. To restore the full website, revert this commit in GitHub Desktop or copy back the saved original version, then push.

Do **not** copy this website into the `media.teens2inspire.org` repository.

## Configuration

Keep the existing environment variables in Vercel. No new secrets are required. The partners list uses the current Supabase connection and only active partnership records; fallbacks are used if Supabase can't be reached.

## Scope of checks

Source syntax/CSS parsing and archive integrity can be verified here, but production Next.js builds, actual external embeds and live payments require testing in Vercel. The page hasn't been deployed by creating this ZIP.
