import { Page } from "@/components/site";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return <Page title="Privacy Policy">
    <p><strong>Last updated: October 21, 2026</strong></p>
    <p>This policy describes the information Teens2Inspire may process when you use its website and media app. It is a plain-language overview, not a substitute for a jurisdiction-specific legal review.</p>
    <h2>Information we collect</h2>
    <p>Depending on how you use the service, we may process your email address, account and profile details, membership status, school-code redemption, saved items, playback progress, content interactions, event or contact submissions, and technical logs needed to operate and secure the platform.</p>
    <h2>How information is used</h2>
    <p>We use information to create and secure accounts, provide membership and school access, deliver media, remember preferences, process contact requests, administer events, maintain the service, prevent abuse, and comply with legal obligations.</p>
    <h2>Service providers</h2>
    <p>The platform uses Supabase for authentication and database services, Stripe for payment checkout and subscription events, Cloudflare R2 for private media storage, and Vercel for hosting. These providers process information as needed to deliver their services under their own terms and privacy practices. Payment card details are handled by Stripe rather than stored directly by Teens2Inspire.</p>
    <h2>Sharing and security</h2>
    <p>We do not sell personal information. Information may be processed by the providers listed above, disclosed when legally required, or used to protect users and the service. We use access controls and security measures intended to limit unauthorized access, but no internet service can guarantee absolute security.</p>
    <h2>Young users and parental questions</h2>
    <p>The service is intended for users age 13 and older and does not currently support account creation for children under 13. If you believe a child under 13 has created an account, contact us through the <a href="/contact">Contact page</a> so we can review and address the account.</p>
    <h2>Retention and your choices</h2>
    <p>We retain information for as long as needed to operate the service, meet legal and accounting obligations, resolve disputes, and enforce agreements. You may contact us to ask about access, correction, or deletion of account information, subject to legal and operational requirements.</p>
    <h2>Changes and contact</h2>
    <p>We may update this policy as the service changes. Material updates will be reflected on this page. For privacy questions, use the <a href="/contact">Contact page</a>. This policy should be reviewed by qualified counsel before public launch.</p>
  </Page>;
}
