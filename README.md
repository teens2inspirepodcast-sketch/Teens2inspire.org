# Teens2Inspire.org — Main Website

This ZIP is the **main marketing and account website** for Teens2Inspire.org. It is separated from the media app so the two can be deployed to different Vercel projects/domains.

## Included
- Home, About, Events, School Access, Contact, Membership, Sign Up, Log In
- Supabase authentication helpers and auth callback
- Contact inquiry API
- School-code redemption API
- Stripe checkout and webhook route foundation
- Shared Supabase migrations and environment example

## Setup
1. Create a Vercel project for this folder and connect the `teens2inspire.org` domain.
2. Install dependencies with `npm install`, then run `npm run dev`.
3. Configure the variables in `.env.example` in local `.env.local` and Vercel. Never commit real secrets.
4. Apply the SQL migrations in `supabase/migrations` to the intended Supabase project.
5. Configure Stripe webhook signing secret and price IDs before enabling paid membership.
6. Test sign-up, login, school-code redemption, contact submission, and checkout in a test environment.

## Important
This is a separated project package, not a claim that production deployment or end-to-end tests have passed. Verify the build and every integration before launch. The media app is supplied separately as `teens2inspire-media.zip`.

## Build-log fix included
This package includes `src/components/pwa-register.tsx`, which was missing while imported by `src/app/layout.tsx` in the failed build log.
