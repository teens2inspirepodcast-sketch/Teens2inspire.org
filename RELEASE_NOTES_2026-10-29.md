# Teens2Inspire.org — Website Editor & Asset Management

This is the full-source Next.js marketing website based on the 2026-10-27 editorial-pop-up source with the 2026-10-28 streaming-homepage patch applied. Extract these files into the root of the **teens2inspire.org** repository.

## Website editor
- Open **/admin/website** (requires existing administrator authentication). From here edit the actual Supabase-backed homepage title and intro, homepage hero image, media app preview text, membership section copy, brand logo, footer tagline, About/mission/founder text, and podcast introduction.
- Select a new logo/image from your device, then press **Upload & Save**. The file uploads to public Supabase Storage `site-brand-assets` with admin-only RLS write permission; the URL is stored in `marketing_settings` and shown on public pages.
- The updated brand logo appears on the primary website header/footer and the media app topbar when the media app package is also deployed.
- Admin dashboard shortcuts lead to **Media App Admin → Content, Partnerships, Events, Podcast Platforms** for editing their existing Supabase records, and **/admin/popup** for the existing promotional editor. All these use the same Supabase project.
- The marketing site converts media app `/api/media/artwork/...` cover paths into URLs on `media.teens2inspire.org` when rendering the media library preview and podcast cards.

## Database
- Supabase bucket migration `supabase/migrations/20261029220000_site_brand_assets.sql` is included in the package for version control, and was already applied to the existing project. No change to Stripe, checkout, webhooks, authentication or private R2 service functions.

## Limitations
- Editing the *media catalog* is intentionally done in the media app's content studio, not on the public website's signup/checkout admin page.
- Legal terms, privacy policy, school-eligibility rules, and prices are not editable as ordinary promotional text; changing them should be reviewed separately.
- A complete Next.js production build, live upload test, and end-to-end regression test were not possible in the current environment. Neither website was deployed by this package creation.
