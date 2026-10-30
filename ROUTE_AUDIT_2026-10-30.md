# Website route audit — October 30, 2026

Audited all 16 Next.js page routes. Zero unresolved literal internal links were found among TSX files; programmatically generated links still require end-to-end testing.

| Route | Purpose | Outcome |
|---|---|---|
| `/` | Public marketing message, signup call to action, current partners, optional promo pop-up | Simplified; no public media catalogue |
| `/about` | Mission, founder information, organizational background | Retained |
| `/podcast` | Brief podcast overview and member sign-up | Removed episode list and embedded playback |
| `/events` | Published event announcements and registration links | Retained |
| `/contact` | Support, partnerships and school inquiries | Retained |
| `/school` | School program application and code redemption | Retained |
| `/membership` | Membership pricing, secure checkout, subscription status | Retained |
| `/signup` | New membership and school account creation | Retained |
| `/login` | Sign-in handoff and checkout sign-in | Retained |
| `/terms` | Terms of Service | Retained; removed launch-preparation text |
| `/privacy` | Privacy Policy | Retained; removed internal-provider implementation notes and launch-preparation text |
| `/cookies` | Cookie Policy | Retained; updated analytics description |
| `/refunds` | Cancellation and refund requests | Retained; removed launch-preparation text |
| `/admin` | Protected content, membership, and school administration | Retained |
| `/admin/website` | Protected live website headline/logo/info editor | Retained; old unused marketing controls hidden |
| `/admin/popup` | Protected homepage promotional pop-up editor | Retained |

**Intentionally not deleted:** Older valid routes may be used in saved links, checkout callbacks, and administrative actions; indiscriminate deletion risks breaking customer and admin workflows. All 16 pages serve a distinct purpose.

**Public copy audit:** Pre-launch disclaimers and vendor setup notes removed from customer-facing refund, privacy, cookies, and terms pages. The partnership page section no longer describes how partner logos are administered. The website homepage and podcast overview no longer expose member content. Provider-specific logging and integration code remain internal.

**Implementation verification:** TypeScript/TSX and CSS parsing; literal internal link lookup; mobile-width contrast smoke checks. **Not done:** production build, live payment processing test, live-browser route crawl, or legal review.
