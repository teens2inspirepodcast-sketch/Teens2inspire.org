# Post-payment email confirmation — Teens2Inspire.org

User-facing sequence:

1. Choose a paid membership and create your account.
2. Continue through secure Stripe checkout (unchanged integration).
3. Return to a dedicated **Check your email** page. Verification is mandatory before sign-in.
4. Click the verification email link from Supabase. Existing accounts use the same password; no duplicate account creation and no second checkout.
5. Open the media-app sign-in page. Membership becomes available when the existing Stripe payment webhook confirms the subscription.

### Routes
- `/membership?checkout=success` redirects to `/check-email?from=checkout` unless the current marketing session is already verified.
- `/check-email` instructions + resend link.
- `/auth/callback` existing Supabase auth exchange, updated navigation for new/old paid signup confirmation links.
- `/email-verified` confirmation guidance and cross-domain media-app sign-in link.

### Unchanged
- `supabase/functions/stripe-checkout/index.ts`
- `supabase/functions/stripe-webhook/index.ts`
- `src/app/api/stripe/checkout/route.ts`
- Supabase database/Stripe configuration and price IDs.

### Test before production
Run an end-to-end **test-mode** signup and webhook test in staging with a fresh test email; confirm subscription status and cross-domain login. Syntax checks alone do not prove delivery, Stripe webhook timing, or live access.
