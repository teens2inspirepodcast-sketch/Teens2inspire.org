import { Page } from "@/components/site";
import { SchoolCodeForm } from "@/components/school-code-form";
import Link from "next/link";
export default function School() {
  return <Page title="Inspiration for your school community.">
    <p className="lead">Teens2Inspire can provide curated media access through participating schools.</p>
    <div className="panel"><h2>Have a school code?</h2><p>Create an account or sign in first, then redeem the code below.</p><SchoolCodeForm/><p style={{fontSize:13}}>Need an account? <Link href="/signup">Join Teens2Inspire</Link> · Already registered? <Link href="/login">Sign in</Link></p></div>
    <section className="section"><h2>For schools</h2><p>For school partnerships, classroom access, or a school-specific program, contact us to discuss setup and access management.</p><Link className="btn secondary" href="/contact">Contact Teens2Inspire</Link></section>
  </Page>;
}
