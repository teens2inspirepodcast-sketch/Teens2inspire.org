# Teens2Inspire main website

Main marketing/account site for `teens2inspire.org`. Includes a responsive landing page, $7.99 Personal and $9.99 Family membership presentation, school-code entry, Supabase Auth signup/login, and a three-card Download App guide (Desktop / Android / Apple).

## Setup
1. Install Node.js 20+ and run `npm install`, then `npm run dev`.
2. Copy `.env.example` to `.env.local` and fill in the Supabase project URL and public anon key.
3. Configure Supabase Auth redirect URLs for `https://teens2inspire.org/login` and your preview domains.
4. Deploy the project to Vercel and attach `teens2inspire.org`.
5. Deploy/configure the Supabase Edge Functions `create-checkout-session` and `redeem-school-code` separately. The browser project deliberately contains no Stripe secret. Membership cards must be wired to the checkout function after account verification.

## Security notes
Only public Supabase values belong in the frontend. Store Stripe secret/webhook signing keys and Cloudflare R2 credentials as Supabase Edge Function secrets. The checkout and school-code Edge Functions must validate the authenticated user, price IDs, code expiry/usage, and allowed redirect URLs server-side.

## Build status
The source package is reconstructed from the saved project requirements. This environment could not reach the npm registry, so dependencies and production build have not been installed or verified here. Do not represent this package as end-to-end production-tested until the configured project passes CI/build and checkout/auth smoke tests.
