# Teens2Inspire — Website 24Six-inspired streaming design

PATCH PACKAGE — **not a standalone project**.

## Exact base
Apply to the existing Next.js repository whose previous snapshot matches `Teens2Inspire-Website-Editorial-Redesign-Popup-2026-10-27.zip`. Do not replace an unrelated project or apply to the wrong domain.

## Install
1. Back up and commit your existing repository.
2. Extract this ZIP into the ROOT of the matching repository (where `package.json` is), preserving `src/` directory structure and overwriting the changed files.
3. Keep your current `.env` files and production variables. The patch contains no `.env` file.
4. Run `npm install`, `npm run lint` and `npm run build` from the repo root, then test locally/staging.
5. Commit and deploy the site through its existing Vercel project after manual review.

## What is included
- New centered minimalist streaming homepage: black/white/pink, rounded primary and outlined buttons.
- Existing mobile hamburger header remains functional.
- New app mockup and horizontally scrolling real published Supabase content previews.
- Membership tier links, school routes, auth routes, pop-up widget and /admin/popup retained.
- Existing checkout, webhook, auth, CMS and Supabase modules are untouched.

## What is NOT changed
- No edits to `src/lib/supabase/`, Supabase Edge Functions, database migrations, Stripe prices/checkout/webhook, API routes, R2 keys/credentials, school codes or account data.
- Existing functionality and API contracts are reused. The new client player changes only the playback UI/lifecycle.

## Manual acceptance tests (not yet completed)
1. Visit the homepage on desktop, tablet and phone; check nav/mobile menu and text contrast.
2. Check published content thumbnails/links render; if there is no public readable content, an honest empty state appears.
3. Test membership signup, personal/family Stripe checkout, school code and login.
4. Enable the announcement at /admin/popup; verify it appears, dismisses, and admin-only uploads work.

## Validation
- All TypeScript/TSX source files parsed locally with TypeScript; no syntax errors.
- Both CSS files parsed with PostCSS; no syntax errors.
- The source files were diffed against the base ZIP.
- `npm install --offline` was attempted but failed (dependencies not cached). A full Next.js production build, visual QA and live end-to-end testing are **not completed**.
- No live GitHub or Vercel deployment performed.

## Applying alongside the other patch
Deploy website and media app to their SEPARATE repositories. Never mix the folders.
