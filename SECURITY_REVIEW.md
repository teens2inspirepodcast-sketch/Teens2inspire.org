# Security and launch checks — Main Website

- Keep service-role keys and Stripe secrets server-only; never prefix secrets with `NEXT_PUBLIC_`.
- Confirm Supabase RLS is enabled and tested for every table.
- Verify email confirmation and the shared-domain auth cookie flow between the marketing site and media app.
- Validate school-code redemption server-side for expiry, use limits, and authenticated identity.
- Verify Stripe webhook signatures, event idempotency, subscription-state sync, and price IDs.
- Add rate limiting / bot protection to public contact and redemption endpoints.
- Test sign-up, login, reset/recovery, session expiry, account deletion, and cross-domain navigation.
- Confirm public pages never expose private media URLs.
- Run `npm install`, `npm run build`, and end-to-end tests in the actual deployment environment.

## Repair pass — 2026-10-16

Completed in the current repair archive:
- Added live-schema compatibility migrations for school-code redemption, profile email synchronization, events, and inquiries.
- Applied the compatibility/security migrations to the connected Supabase project.
- Smoke-tested school creation/code-name synchronization and temporary event/inquiry inserts; test records were removed.
- Restricted trigger-only SECURITY DEFINER functions from direct API execution and removed RPC access to obsolete/unused functions.
- Added administrator-only policies to legacy school membership-code and video asset tables.
- Re-ran Supabase Security Advisor. The no-policy warnings for these legacy tables and the trigger-function RPC warnings are resolved.

Still required before production launch:
- Enable leaked-password protection in Supabase Dashboard → Authentication → Settings / Password Security.
- Review the remaining SECURITY DEFINER warnings for `is_admin`, `user_has_role`, and `redeem_school_code(text, uuid)`; they are retained because the current RLS/application flow uses them, and they validate the authenticated user's identity/role.
- Run the full production build and browser end-to-end tests; package installation was unavailable in this environment.
- Run a real Stripe test checkout and verify webhook delivery/idempotency using the configured Stripe secrets.
- Verify production deployment environment variables and auth email redirect URLs.
- Confirmed the public site's current content, profile, school-code, event, inquiry, and newsletter queries align with the connected database columns during the schema audit.
