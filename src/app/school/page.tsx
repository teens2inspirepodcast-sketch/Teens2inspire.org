import { Page } from "@/components/site";
import { SchoolApplicationForm } from "@/components/school-application-form";
import { SchoolCodeRedeem } from "@/components/school-code-redeem";

export default async function School({ searchParams }: { searchParams: Promise<{ redeemCode?: string }> }) {
  const params = await searchParams;
  return <Page title="Free access for your school community.">
    <SchoolCodeRedeem code={params.redeemCode} />
    <p className="lead">Schools can apply for a free Teens2Inspire access code to share with their students. Submit the form below and we will follow up with the school contact to review the request and arrange access.</p>
    <div className="panel"><h2>School access application</h2><p>Use an official school email address so we can verify the request. Applying does not automatically activate a code.</p><SchoolApplicationForm /></div>
    <section className="section"><h2>What happens next?</h2><p>We review each application, confirm the school contact, and follow up about a free student access code and information on how to get started.</p></section>
  </Page>;
}
