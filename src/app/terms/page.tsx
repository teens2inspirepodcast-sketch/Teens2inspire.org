import { Page } from "@/components/site";

export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return <Page title="Terms of Service">
    <p><strong>Last updated: October 21, 2026</strong></p>
    <p>Teens2Inspire provides curated media, podcast episodes, resources, and membership features for Jewish teen girls. By creating an account or using the service, you agree to these terms and to use the platform lawfully and respectfully.</p>
    <h2>Accounts and eligibility</h2>
    <p>You must provide accurate account information and keep your login credentials private. The service is intended for users age 13 and older. Users under 13 may not create an account because the platform does not currently provide an under-13 parental-consent workflow. Parents and guardians should supervise younger users' use of connected devices and accounts.</p>
    <h2>Membership and payments</h2>
    <p>Personal membership is offered at $7.99 per month and Family membership at $9.99 per month, subject to the plan details shown at checkout. A paid membership becomes active only after successful payment confirmation. Subscriptions renew unless canceled through the available subscription-management process. Any cancellation takes effect according to the billing terms shown by the payment provider; access may continue through the paid period. School access depends on a valid, active school code and the applicable school arrangement.</p>
    <h2>Content and acceptable use</h2>
    <p>Content is provided for personal, non-commercial use. Do not copy, redistribute, publicly display, reverse engineer, interfere with, or attempt to bypass access controls for protected content. Do not misuse school codes, attempt unauthorized access, or upload content you do not have rights to use.</p>
    <h2>Availability and changes</h2>
    <p>We may update, remove, or reorganize content and features. We aim to keep the service available but do not promise uninterrupted operation. We may suspend access for abuse, security concerns, non-payment, or material violations of these terms.</p>
    <h2>Contact</h2>
    <p>For questions about these terms, use the <a href="/contact">Contact page</a>. These terms are a starting point and should be reviewed by qualified counsel before public launch.</p>
  </Page>;
}
