# Teens2Inspire.org — live marketing, membership, and account website

This repository is the main Teens2Inspire website. The media library is a separate, authenticated application. The public homepage intentionally does not display episode thumbnails, titles, media files, library previews, or direct media-app links.

## Public experience
- Homepage headline: "Everything you love. All in one place." (editable in the existing marketing settings database).
- Primary public homepage action: **Join Us** → `/signup`.
- **Sign in** → `/login`, which hands the user to the media-app sign-in process.
- An active-partners section reads existing partnership records; it contains no administrative instructions.
- The podcast route provides a brief overview and membership call to action, not a public member-media catalogue.
- The configured promotional pop-up continues to work, including its admin editor.

## Keep these routes
The 16 page routes have specific functions. See `ROUTE_AUDIT_2026-10-30.md` for their purpose. No routes were removed just because they looked old; removing account and policy routes would break existing workflows or bookmarks.

## Infrastructure
The existing Supabase, Stripe, membership, school access, and account-authentication logic is preserved. Vercel Analytics remains in the root layout. The homepage marketing headline in the existing Supabase settings record was updated to the requested wording on October 30, 2026.

## Deployment / verification
Extract the ZIP into the **existing website repository**, preserving the tree. Use the existing environment variables (never put secrets into the repository). After committing, run `npm ci`, `npm run lint`, and `npm run build`, then test signup, sign-in handoff, payment confirmation, school redemption, contact, admin edits, legal pages, and the pop-up before promoting to production. These production tests have **not** been performed in this environment.

The policy text was cleaned of launch-preparation wording; it has **not** been independently certified for legal compliance. Obtain legal review separately as appropriate; do not put internal review reminders on customer-facing policy pages.
