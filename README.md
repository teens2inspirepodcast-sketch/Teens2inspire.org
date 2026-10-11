# Teens2Inspire.org

This project is the **public Teens2Inspire website and account hub**.

## Architecture

- `teens2inspire.org` — marketing site, account creation/login, school information, events, contact, and app installation instructions.
- `media.teens2inspire.org` — separate media PWA/app that owns the member content, media library, profiles, and admin studio.

This website intentionally does **not** contain the member media library or the `/v2` app UI.

## Account types

- School — free with an active school code.
- Personal — $7.99/month, one profile.
- Family — $9.99/month, up to three profiles total (the account owner plus up to two additional profiles).

Stripe checkout remains server-side. Supabase Auth handles account creation and email verification.

## Production Supabase Auth settings

Set the Supabase project Site URL to:

`https://teens2inspire.org`

Allow this redirect URL:

`https://teens2inspire.org/auth/callback`

The signup flow builds the verification redirect from the live website origin, so production verification returns to the Teens2Inspire website rather than localhost.

## Vercel environment variables

Set the public values in `.env.example` in Vercel. `NEXT_PUBLIC_R2_PUBLIC_BASE_URL` is the public custom domain for the R2 artwork bucket; it is not a secret. Do not put Stripe secrets, the Supabase service-role key, or R2 credentials in Vercel. Those private values belong in Supabase Edge Function secrets.

## School codes

The migration `20261002010000_school_codes.sql` creates the school-code tables used by the signup validation endpoint. Apply it to the production Supabase project before enabling school-code signup.

## Deploy

Deploy this folder as the Vercel project for `teens2inspire.org`.

## Shared sign-in across both subdomains

Set `NEXT_PUBLIC_AUTH_COOKIE_DOMAIN=.teens2inspire.org` in **both production Vercel projects** so the Supabase SSR session cookie can be shared between `teens2inspire.org` and `media.teens2inspire.org`. Leave it blank for localhost development. Add both production origins and their auth callback paths to the Supabase Auth URL allow list.

## Supabase Edge Functions

The `supabase/functions` folder contains the server-side Stripe checkout, billing portal, Stripe webhook, and R2 signing functions. From this project folder, link the existing project (`supabase link --project-ref mphswidvmesdkefkgwjz`) and deploy `create-checkout`, `create-billing-portal`, `manage-promotions`, `stripe-webhook`, and `r2-media`. Configure the following **in Supabase Edge Function secrets**, not in Vercel: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID_PERSONAL`, `STRIPE_PRICE_ID_FAMILY`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_PRIVATE_BUCKET_NAME`, and `R2_PUBLIC_BUCKET_NAME`. The Supabase project provides `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` to Edge Functions.

After the Edge Function webhook is deployed and tested in Stripe test mode, keep the existing Stripe endpoint URL (`https://teens2inspire.org/api/stripe/webhook`) because the website route forwards signed webhook requests to the Edge Function. Do not change the live webhook until a test event has succeeded.

For Cloudflare R2, configure bucket CORS to allow `PUT` requests from `https://media.teens2inspire.org` with the `Content-Type` header. During local development, also allow `http://localhost:3000`. Keep the private media bucket private; only thumbnails/artwork belong in the public bucket.

Before launch, apply the migrations in `supabase/migrations` after reviewing them against the existing production schema. Then test school-code signup, subscription checkout, promotion-code redemption, webhook subscription sync, member-only media access, and Admin Studio operations in a non-production/test environment.

## Fixes in this candidate package

- Paid signup preserves the selected Personal or Family plan through email confirmation and resumes Stripe checkout after confirmation.
- The media app now has a protected `/saved` Library page and the mobile Library link points to it.
- Family profile create/remove controls use the existing owner-scoped RPC contract. The added migration creates the table and restricts the RPCs to an active Family entitlement; it allows the account owner plus up to two additional profiles.
- Playwright tests now target actual routes in this two-site architecture rather than removed `/membership`, `/discover`, and `/v2/*` pages.
- Media content shelves fall back gracefully when Supabase is temporarily unreachable.

## Build verification status

**Not fully tested.** Static TypeScript/TSX parsing and local-import checks passed. The environment could not resolve `registry.npmjs.org`, so `npm ci` did not complete. The subsequent `npm run build` failed with `next: not found`, and Playwright E2E could not run because the dependency installation was incomplete. Do not deploy this candidate until dependencies can be installed and `npm run typecheck`, `npm test`, `npm run build`, and `npm run test:e2e` pass in a network-enabled environment. Review and test the new family-profile migration against the existing Supabase schema before applying it.
