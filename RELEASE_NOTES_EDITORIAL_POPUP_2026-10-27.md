# Teens2Inspire.org — editorial redesign and promotional pop-up CMS

## Changes
- Rebuilt the marketing homepage layout: editorial hero, cover-style campaign artwork, media format sections, library preview, and closing membership presentation.
- Harmonized typography, navigation, membership panels, signup, about, podcast, contact, admin surfaces and responsive styles around premium dark plum and blush accents.
- Continued strict contrast policy: dark surfaces use light text; intentional light-paper mockups use dark text.
- Added a **promotional pop-up** on the public homepage, controlled by the Supabase `site_popup` table.
- Added `/admin/popup`: an admin-only page with editable headline, message, button, enabled switch, image/video uploads, preview, and save/publish flow.
- Admin Dashboard has a prominent **Promotional pop-up** card linking to `/admin/popup`.
- Users can close the pop-up; dismissal persists for that browser session until the announcement changes.
- Popup videos display native playback controls and do not autoplay.
- Supports image/jpeg, image/png, image/webp, image/gif, video/mp4, video/webm, video/quicktime (MOV); size up to 80 MB subject to project upload limits.

## Supabase — verified applied to the existing project
- Project: `mphswidvmesdkefkgwjz` (Teens2Inspire).
- Successfully added `public.site_popup` with Row Level Security: public reads only enabled announcements; admin can edit.
- Successfully added `site-popup-media` public-delivery Storage bucket with **admin-only writes** and upload-type/size restrictions.
- Added migration script for reproducible setup at `supabase/migrations/20261028010000_site_popup_cms.sql`.
- A single default announcement row was created and verified. `is_enabled` defaults to `false`. Enable it in the admin editor when ready.
- No existing Stripe webhook, checkout, price, authentication, or R2 Edge Function implementation was altered.

## Deployment
1. Push the contents of this ZIP to the *website* GitHub repo (project root, not nested directory).
2. Redeploy **teens2inspire.org** on Vercel.
3. Sign in with an administrator account and open `https://teens2inspire.org/admin/popup`.
4. Select an image/video directly from your device, enter the announcement, preview it, turn on **Pop-up enabled**, then click **Save changes**.
5. Visit the homepage in a fresh browser session to confirm the published design.

**Important:** The Supabase migration was already applied to the connected production project; do not run it again unless needed for another environment. An additive, idempotent migration is included for source control.

## Verification limits
All TS/TSX files parsed without syntax errors and the CSS passed a PostCSS syntax check. A complete Next.js production build and real-user visual/end-to-end testing were not available in this environment. Existing outstanding media-app features (e.g., cross-page mini-player from earlier release notes) were not implemented as part of this design/CMS release.
