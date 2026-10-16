# Teens2Inspire.org — Marketing Website

This is the **dark editorial marketing and account website** for `teens2inspire.org`. It is intentionally separate from the light, installable media app at `media.teens2inspire.org`.

## Design direction
- Dark near-black / burgundy canvas, restrained blush-pink accents, serif editorial headlines, and generous spacing.
- Shared responsive header using the actual Teens2Inspire wordmark asset.
- Cinematic hero, layered media-app preview, scroll-reveal sections, subtle parallax-like motion, hover transitions, and reduced-motion support.
- The marketing site is primarily for discovery, account creation, and membership checkout. Its Podcast page embeds the RSS.com episode archive so visitors can play podcast episodes directly on the site; the media app hosts the wider member library.
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


## Signup and Stripe repair notes
- Signup shows Personal ($7.99/month) and Family ($9.99/month) choices before account creation.
- After email verification, members are directed back to the main-site membership flow.
- The website checkout API invokes the Supabase `stripe-checkout` Edge Function; do not add Stripe secret keys to Vercel.
- Configure `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in Supabase Edge Function secrets. Point the Stripe webhook directly to `https://mphswidvmesdkefkgwjz.supabase.co/functions/v1/stripe-webhook`.
- Required public Vercel variables are shown in `.env.example`.
- The repair files are merged into this project ZIP, but a production build and live checkout still need to be tested after deployment.

## Admin dashboard

The marketing site includes a protected `/admin` workspace for administrator-role accounts. It displays membership records, content, events, schools, inquiries, and newsletter subscribers, and provides forms to create content, events, and school access codes. Access is checked on the server through the authenticated Supabase profile role; regular users are redirected away.

### Enable the first administrator

1. Apply `supabase/migrations/001_initial.sql` and `supabase/migrations/002_security_school_access.sql` in the connected Supabase project's SQL Editor.
2. Create your account through the website and confirm it appears under **Authentication → Users**.
3. Run the administrator role update shown in `supabase/ADMIN_SETUP.md`, replacing the example email with the exact email of your own account. Verify exactly one row changed.
4. In Vercel, set `NEXT_PUBLIC_SUPABASE_URL` and either `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in Production. The app prefers the anon-key variable if both are set.
5. Redeploy the marketing-site project, then visit `https://teens2inspire.org/admin` while signed in with the administrator account.

The dashboard deliberately does not provide a manual control to grant paid membership. Paid membership must follow verified Stripe webhook events. School-code access is managed separately.

## October 2026 repair notes
- The header and footer logo are constrained responsively so the source image dimensions do not make the logo dominate the layout.
- The Podcast page includes an in-page RSS.com episode player, and episode cards jump directly to that player rather than sending visitors away from the site.
- Signup confirmation copy explicitly says to verify email first and clarifies that paid membership is not active until Stripe checkout is completed.
- Paid checkout still depends on the deployed Supabase `stripe-checkout` Edge Function and correct Stripe secrets/Price IDs. The production flow must be tested with a real test-mode or approved live-mode transaction before launch.

## Supabase school-code compatibility repair

A compatibility migration is included at
`supabase/migrations/003_repair_school_admin_schema_compatibility.sql`. The follow-up `004_live_schema_compatibility.sql` adds the missing `redeem_school_code` function, profile email sync, and the `events`/`inquiries` tables required by the marketing admin and contact forms.
It aligns the live schema with the admin form's `schools` and `school_codes`
operations, adds the newsletter table expected by this site's admin page, and
keeps administrator-only access enforced with row-level security.

The connected Supabase project has already had this migration applied and the
school/code insert flow passed a database smoke test. For another environment,
apply migrations in order and confirm the admin account has the `administrator`
role before testing school-code creation.


### Security compatibility migration
Apply `supabase/migrations/005_security_hardening.sql` after the earlier migrations. It restricts trigger-only SECURITY DEFINER functions from direct RPC use, adds administrator-only policies to legacy school-code/video-asset tables, and disables obsolete school-code RPC overloads not used by the current apps. The connected Supabase project has this migration applied.


### Family-profile compatibility
The shared Supabase schema's family-profile mutations are restricted to guarded database functions. The media app's `006_restore_guarded_family_profile_rpcs.sql` migration aligns legacy column names and grants only authenticated execution to the ownership- and entitlement-checking functions. Apply the media app migrations through `006` to the shared project.


### Fresh-install schema compatibility
Migration `007_complete_app_schema.sql` brings older base migrations up to the current shared app schema, including section metadata, content metadata, categories, billing tables, Stripe webhook idempotency records, and current content-access policies. Apply the shared migrations in numeric order through `007` before configuring production credentials.
