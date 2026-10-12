# Security and launch checks — Main Website

Before launch:
- Keep service-role keys and Stripe secrets server-only; never use `NEXT_PUBLIC_` for secrets.
- Confirm Supabase RLS is enabled and tested for every table.
- Validate school-code redemption against server-side rules, expiry, use limits, and authenticated identity.
- Verify Stripe webhook signatures, idempotency, subscription state sync, and price IDs.
- Add rate limiting / bot protection to public contact and redemption endpoints.
- Verify email confirmation, password reset, session expiry, and account deletion workflows.
- Run `npm install`, `npm run build`, and end-to-end tests in the actual deployment environment.
- Confirm public website pages never expose private media URLs.
