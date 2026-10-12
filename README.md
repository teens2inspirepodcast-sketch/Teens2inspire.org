# Teens2Inspire.org — Marketing Website

This is the **dark editorial marketing and account website** for `teens2inspire.org`. It is intentionally separate from the light, installable media app at `media.teens2inspire.org`.

## Design direction
- Dark near-black / burgundy canvas, restrained blush-pink accents, serif editorial headlines, and generous spacing.
- Shared responsive header using the actual Teens2Inspire wordmark asset.
- Cinematic hero, layered media-app preview, scroll-reveal sections, subtle parallax-like motion, hover transitions, and reduced-motion support.
- The marketing site does not play media. It links members to the media app.
- Preview content is loaded from published Supabase content when available; the empty state does not invent episode titles or covers.

## Included
- Home, About, Events, School Access, Contact, Membership, Sign Up, Log In
- Supabase authentication helpers and email callback handling
- Contact inquiry API and school-code redemption API
- Stripe checkout and webhook route foundation
- Shared Supabase migrations, actual logo asset, environment example

## Setup
1. Create a Vercel project for this folder and connect `teens2inspire.org`.
2. Run `npm install`, then `npm run dev` locally.
3. Configure `.env.local` from `.env.example` and set the same Supabase project used by the media app. Never commit real secrets.
4. Apply the SQL migrations in `supabase/migrations` to the intended Supabase project.
5. Configure Stripe price IDs, signing secret, webhook endpoint, and redirect URLs before enabling paid membership.
6. Test signup, email verification, login handoff to the media domain, school-code redemption, contact submission, and checkout in test mode.

## Readiness status
The redesign's TypeScript/TSX files passed a syntax parse. A production build has **not** been verified because dependency installation timed out in this environment. Run `npm install` and `npm run build` in Vercel or a network-enabled environment before deploying.

The media app is supplied separately as `teens2inspire-media-redesigned.zip`.
