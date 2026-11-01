# Teens2Inspire.org — Premium Design Upgrade

## Scope
This release is a **presentation-only** redesign of the existing public website and its admin screens. The complete prior codebase is included. No Supabase configuration, credentials, database migrations, auth flows, Stripe configuration, API routes, React components, or payment logic were intentionally modified for this redesign.

The only existing source file changed by this design pass is `src/app/globals.css`.

## Visual improvements
- Unified visual language with the media app: midnight plum, soft rose, lavender and warm-apricot lighting.
- Elevated sticky navigation, responsive menu, precise button and link treatments.
- Cinematic opening section with refined typography, premium in-page app preview and warm gradient lighting.
- Restructured visual rhythm for editorial mission, experience cards and new-member invitation.
- Harmonized podcast, partner, pricing, auth, admin, footer and internal-page presentation.
- Stronger text contrast, interactive focus states and small-screen design refinements.
- Respects reduced-motion preferences.

## Deployment
1. Put the contents of this package at the **root** of the public website's own GitHub repository. `package.json` and `src/` must be at the Vercel project's configured Root Directory.
2. Keep all existing production environment variables as they are; verify they exist in Vercel.
3. Deploy via your existing GitHub/Vercel workflow. This ZIP does not deploy anything automatically.
4. Run `npm install`, `npm run build`, and regression tests in your deployment environment.

## Not a functional completion claim
This design release preserves the state of the previous fix package and **does not** implement the unfinished admin-controlled promotional pop-up or complete any other unfinished features. There has been no verified live production build or end-to-end test during this design pass.
