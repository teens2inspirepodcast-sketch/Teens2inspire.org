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
