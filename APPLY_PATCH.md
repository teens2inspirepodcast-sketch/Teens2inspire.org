# Teens2Inspire.org — November 1, 2026 email-verification checkout fix

This ZIP contains the **full latest website source**, based on `Teens2Inspire-Website-Podcast-Mockups-Popup-2026-11-01.zip`, with the paid-signup flow corrected. It is **not** a media-app deployment.

## What changes

1. Stripe continues using the existing success return URL `/membership?checkout=success`; the website now routes unverified signups to `/check-email?from=checkout` instead of presenting a login link prematurely. Already verified signed-in users can proceed directly.
2. `/check-email` clearly explains how to verify, offers a resend-verification option, and includes the media-app sign-in link for verified members.
3. New signup confirmation links lead to `/email-verified`, where users are told to **sign in**, not register or pay again. Older emailed links aimed at `/membership` are also handled by the callback.
4. Expired or invalid paid-account verification links go to the check-email page rather than an unhelpful login redirect.
5. The signup page explains email confirmation before checkout.

No Stripe Edge Function, webhook, membership database, pricing, credentials, or media-app functions have been changed. The check-email page does **not** assert that a payment succeeded solely because a URL was visited: payment activation still depends on the existing webhook.

## Deployment

1. Back up and commit the current **Teens2Inspire.org** repository before replacing files.
2. Unzip to the repository root (the folder containing `package.json`). Preserve existing environment settings.
3. Run `npm install`, `npm run lint` and `npm run build` in the actual repository or Vercel CI.
4. Deploy the website only after testing the flows below. Do not upload website files to the media-app repository.

## Acceptance checks (required on a staging deployment)

- New paid signup with unverified email → Stripe test checkout → `/check-email` with instructions, not login.
- Open the verification email → `/email-verified` → sign into the media app with the existing email/password.
- Use an already expired confirmation link → helpful recovery message and resend function.
- Verified existing account → normal sign-in/checkout behavior.
- Cancel Stripe checkout → membership screen still displays cancellation notice.
- School code signup and redemption flows still work.
- Verify payment webhook updates the active membership; this ZIP does not change payment confirmation rules.

## Verification status

Updated TypeScript/TSX sources pass local syntax transpilation; new CSS passes parsing. Full Next.js build, browser integration checks, live email delivery and Stripe test checkout are **not yet completed**. No live Vercel deployment was made in this task.
