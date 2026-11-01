# Teens2Inspire.org — Partners homepage and Vercel Analytics

This package updates the **existing Next.js website source**. It is not an already-deployed website.

## Changes

- Adds a prominent, mobile-responsive **Partners** showcase between the published-media preview and the format/membership sections of the homepage.
- Loads partner name, logo, and website link from the **existing Supabase `public.partnerships` table**. Only records with `is_active = true` are shown. Changes to existing partnership records in the media app admin studio appear on the homepage after the next dynamic page request. No new table or migration required.
- Includes a visible **Partners** navigation link on desktop and the mobile menu.
- Uses legible, neutral white logo surfaces surrounded by the black/pink homepage. Handles missing logos and links gracefully.
- Adds `@vercel/analytics` version `^2.0.1` to `package.json`.
- Loads `Analytics` from `@vercel/analytics/next` and renders it once in `src/app/layout.tsx` after the page content so Vercel can collect page views and route changes.

## Publish and enable analytics

1. Replace the contents of the **Teens2Inspire.org** GitHub repository with the extracted package contents (including `src` and `package.json`). Do **not** upload this source to the media subdomain repository.
2. On the repository or Vercel build environment, run `npm install` to install the new package and update the lockfile if your repository uses one. Commit `package-lock.json` when generated.
3. In the **Teens2Inspire.org Vercel project**, go to **Analytics** and select **Enable** (if not already enabled). This dashboard switch is required in addition to the component in code.
4. Deploy the updated site through the usual Vercel flow. After the production deployment, open `https://teens2inspire.org/` in a browser and visit a few routes.
5. Return to **Vercel → Analytics** to check for page-view data. Initial metrics may take some time to appear. Analytics tracking normally does not run in local development mode.
6. Visit the Partners section at `https://teens2inspire.org/#partners` and confirm the existing published partner logos and links appear on desktop and phone. Check that changing an active partnership through the existing admin studio changes the public result.

## Preservation

- No Stripe products, Stripe handlers, membership billing, or price IDs were modified.
- No Supabase tables, authentication handlers, policies, or Edge Functions were modified.
- Media playback, Cloudflare R2, and media app source files were not modified.
- The previous website pop-up and website editor are unchanged.

## Tests and limitations

- TypeScript/TSX files pass standalone syntax parsing; CSS stylesheets pass PostCSS parsing.
- The ZIP passes archive integrity testing.
- Full `npm install`, production build, Vercel deployment, and live end-to-end verification **have not run in this environment** because the npm registry could not be reached.
- Enabling Analytics in the Vercel dashboard is a separate step; source code cannot enable it on its own.
