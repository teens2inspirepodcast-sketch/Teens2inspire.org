# Administrator and database setup

1. In the correct Supabase project, apply migrations `001_initial.sql`, `002_security_school_access.sql`, `003_repair_school_admin_schema_compatibility.sql`, and `004_live_schema_compatibility.sql` in order. If the live compatibility migration was already applied through the Supabase dashboard, verify its objects before reapplying.
2. Sign up through the website and verify the administrator email address.
3. In the Supabase SQL Editor, run the following query with the exact email used for the admin account:

```sql
update public.profiles p
set role = 'administrator'
from auth.users u
where p.id = u.id
  and lower(u.email) = lower('YOUR_ADMIN_EMAIL_HERE');
```

4. Confirm exactly one row changed. If none changed, check that the auth user exists and the profile trigger created a matching row.
5. Sign in and verify `/admin` is accessible only to the administrator. Test with a normal user too.
6. Use **School Access** in the admin dashboard to generate school codes. Each raw code is shown only once; store and distribute it securely. The database stores only its hash.
7. Do not manually update membership status to simulate payment in production. Stripe webhook events should control paid membership state.

## Signup-before-verification Stripe Checkout update

The marketing signup flow now creates the Supabase signup, then opens Stripe Checkout before the user verifies their email. The `stripe-checkout` Edge Function must be updated to the checked-in source before this flow will work in production:

1. Link the Supabase CLI to project `mphswidvmesdkefkgwjz` (or select the matching project in your normal deployment workflow).
2. Ensure Edge Function secrets `STRIPE_SECRET_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are configured in Supabase.
3. Deploy the function with JWT verification disabled because this handler performs its own checks for either an authenticated user or an exact-match unverified signup:

   `supabase functions deploy stripe-checkout --no-verify-jwt`

4. Do not disable JWT verification on unrelated functions. Confirm the deployed function version and test a fresh signup, valid and invalid discount codes, checkout cancellation, payment success, and email confirmation. The Stripe webhook must remain active to grant paid membership.

The site code alone does not deploy this Edge Function or change Vercel. Until the Edge Function is deployed, checkout-before-verification is not live.
