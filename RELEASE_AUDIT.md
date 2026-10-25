# Teens2Inspire.org release audit

Audit date: 2026-10-21

## Included
- Full Next.js marketing/account website source
- Home, About, Podcast, Events, School Access, Contact, Membership, Sign Up, Log In, Admin, Terms, and Privacy pages
- Actual `public/teens2inspire-logo.png` asset and site icons
- Supabase client/auth code and seven SQL migration files
- Checkout handoff to Supabase Edge Functions

## Changes in the 2026-10-22 update
- Marketing-domain `/login` now redirects to the real media-domain login and safely forwards an internal `next` path.
- Signup presents Personal ($7.99/month), Family ($9.99/month), and School (free) options; School routes to an application rather than code redemption.
- School page now has an application form for school/contact details, estimated student count, website, and notes; it submits to the existing school inquiry endpoint.
- Age checkbox copy matches the requested wording.
- Podcast page uses the Spotify show embed (not the RSS.com show player); the carousel reads published podcast records and displays each available episode cover from `cover_url`.
- Home hero card now embeds the live media app instead of rendering a hand-built mock interface.
- Email confirmation callback now supports Supabase PKCE and token-hash links and returns verified paid signups to the selected plan’s Stripe checkout; if the email template omits the plan destination, it falls back to Personal checkout rather than the marketing site’s nonexistent `/app` route.

## Checks completed in this environment
- ZIP archive opened and all source files extracted successfully.
- TypeScript transpilation/syntax diagnostics passed for all 34 marketing source files after these edits.
- Static navigation audit found no missing linked marketing routes; `/login` is intentionally a redirect to the media-domain login.
- TypeScript/TSX syntax transpilation passed for 33 source files with zero syntax diagnostics.
- No `.env`, `.env.local`, or PEM credential files were included in the archive.
- Environment examples document the public Supabase variables consumed by this app and clarify that Stripe secrets/price IDs belong in Supabase Edge Function secrets.
- Terms and Privacy pages are linked from signup and the footer.

## Not yet verified
- Full dependency-aware typecheck/build could not be run: `npm install` timed out in this environment.
- The live-app iframe depends on the deployed media domain allowing framing; confirm it renders correctly in a real browser. The direct “Open app” link remains available.
- Under-13 parental permission wording is present as requested, but this checkbox is not a verified parental-consent workflow. Do not enable accounts for under-13 users without a compliant, verifiable guardian-consent process.
- `npm install` timed out in this environment, so a full dependency-aware typecheck and `next build` could not be completed.
- Live signup/email confirmation, checkout, webhook activation, school-code redemption, RLS, and production browser flows still require deployment-level testing. Confirm the Supabase email template uses `{{ .ConfirmationURL }}` or the configured `{{ .RedirectTo }}` flow and allow-list `https://teens2inspire.org/auth/callback` in Authentication URL Configuration.
- The Terms and Privacy drafts should be reviewed by qualified counsel before launch.

This archive is a release candidate, not a claim of fully verified production readiness.


## Signup and checkout update (2026-10-22)
- Personal and Family signup now starts Stripe Checkout immediately after Supabase creates the unverified account. Email confirmation is still required to access the account.
- Signup accepts a discount code; the checkout Edge Function validates it against active Stripe promotion codes. If no code is supplied, Stripe Checkout allows a promotion code to be entered there.
- School selection remains on the signup page and displays a school-code field. If email confirmation is required, the callback returns to the school page and attempts to redeem the supplied code after the session is established.
- Deploy `supabase/functions/stripe-checkout/index.ts` with JWT verification disabled for this function only; the handler validates either a signed-in user or an exact matching unverified signup. Test duplicate signups, expired/invalid codes, successful payment, email verification, and webhook activation before launch.


## Production prep pass 2026-10-25
- Added GitHub Actions validation workflow for install, TypeScript check, and Next.js build.
- Added exact Node/npm runtime metadata and pinned the direct dependency versions from the supplied manifest.
- Corrected the Apple Podcasts URL to the project's current listing and added a data-correction migration.
- Corrected newly generated school access code display prefix to use the full Teens2Inspire brand name.
- The complete production build remains unverified because registry DNS is unavailable in this environment; no lockfile was fabricated.
