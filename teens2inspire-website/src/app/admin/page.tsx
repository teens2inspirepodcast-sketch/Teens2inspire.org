import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createContent, createEvent, createSchoolCode } from "./actions";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ notice?: string; createdCode?: string }>;
const date = (value: string | null) => value ? new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "—";
const statusClass = (status: string) => `admin-status admin-status-${status.replace(/[^a-z0-9_-]/gi, "-")}`;

export default async function AdminDashboard({ searchParams }: { searchParams: SearchParams }) {
  const { supabase, user, profile } = await requireAdmin();
  const params = await searchParams;
  const [profilesResult, contentResult, eventsResult, inquiriesResult, schoolsResult, newsletterResult] = await Promise.all([
    supabase.from("profiles").select("id,email,display_name,role,membership_tier,membership_status,created_at,membership_period_end,cancel_at_period_end").order("created_at", { ascending: false }).limit(100),
    supabase.from("content").select("id,title,type,status,member_only,created_at").order("created_at", { ascending: false }).limit(100),
    supabase.from("events").select("id,title,starts_at,status,location").order("starts_at", { ascending: true }).limit(50),
    supabase.from("inquiries").select("id,kind,name,email,subject,message,created_at").order("created_at", { ascending: false }).limit(50),
    supabase.from("schools").select("id,name,contact_email,is_active,created_at").order("created_at", { ascending: false }).limit(100),
    supabase.from("newsletter_subscribers").select("id,email,status,created_at").order("created_at", { ascending: false }).limit(100),
  ]);
  const profiles = profilesResult.data || [];
  const content = contentResult.data || [];
  const events = eventsResult.data || [];
  const inquiries = inquiriesResult.data || [];
  const schools = schoolsResult.data || [];
  const subscribers = newsletterResult.data || [];
  const activeMembers = profiles.filter((p) => p.membership_status === "active").length;
  const paidMembers = profiles.filter((p) => p.membership_status === "active" && p.membership_tier !== "school").length;
  const issue = [profilesResult, contentResult, eventsResult, inquiriesResult, schoolsResult, newsletterResult].find((r) => r.error)?.error;

  return <main className="admin-shell">
    <header className="admin-topbar"><Link href="/" className="admin-brand">TEENS<span>2</span>INSPIRE <small>ADMIN</small></Link><div className="admin-user"><span>{profile?.display_name || user.email}</span><Link href="/">View website ↗</Link></div></header>
    <div className="admin-content">
      <div className="admin-heading"><div><p className="admin-eyebrow">PRIVATE WORKSPACE</p><h1>Admin dashboard</h1><p>Memberships, media, school access, events, and community inquiries.</p></div><span className="admin-role">Administrator</span></div>
      {params.notice && <div className="admin-notice" role="status">{params.notice}</div>}
      {params.createdCode && <section className="admin-code-reveal"><div><strong>New school access code</strong><p>Copy this code now. Only its hash is stored in the database.</p><code>{params.createdCode}</code></div><p className="admin-copy-note">Copy and save this code now; it will not be shown again.</p></section>}
      {issue && <div className="admin-alert">Some dashboard data could not load: {issue.message}. Check that both Supabase migrations have been applied.</div>}
      <section className="admin-stats">
        <article><span>Total accounts</span><strong>{profiles.length}</strong><small>Most recent 100</small></article>
        <article><span>Active memberships</span><strong>{activeMembers}</strong><small>Includes school access</small></article>
        <article><span>Paid members</span><strong>{paidMembers}</strong><small>Personal and family</small></article>
        <article><span>Published content</span><strong>{content.filter((item) => item.status === "published").length}</strong><small>Of the most recent 100 entries</small></article>
      </section>
      <section className="admin-panel" id="members"><div className="admin-panel-heading"><div><p className="admin-eyebrow">ACCOUNTS & BILLING</p><h2>Memberships</h2></div><span>{profiles.length} shown</span></div><p className="admin-help">Membership status is read from Supabase. Stripe webhook events should update paid membership status; this dashboard does not manually grant paid access.</p>
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Member</th><th>Plan</th><th>Status</th><th>Period ends</th><th>Joined</th></tr></thead><tbody>{profiles.map((p) => <tr key={p.id}><td><strong>{p.display_name || "Member"}</strong><small>{p.email || p.id}</small></td><td>{p.membership_tier || "—"}</td><td><span className={statusClass(p.membership_status || "inactive")}>{p.membership_status || "inactive"}</span>{p.cancel_at_period_end && <small>Cancellation scheduled</small>}</td><td>{date(p.membership_period_end)}</td><td>{date(p.created_at)}</td></tr>)}{profiles.length === 0 && <tr><td colSpan={5}>No profiles found. Sign-up/profile trigger and database migrations may need checking.</td></tr>}</tbody></table></div>
      </section>
      <div className="admin-two-col">
        <section className="admin-panel" id="content"><div className="admin-panel-heading"><div><p className="admin-eyebrow">MEDIA LIBRARY</p><h2>Add content</h2></div></div><form action={createContent} className="admin-form"><label>Title<input name="title" required maxLength={160} /></label><label>Description<textarea name="description" rows={3} maxLength={3000}/></label><div className="admin-form-row"><label>Type<select name="type" defaultValue="video">{["video","podcast","article","resource","printable","pick","recipe","original"].map(x=><option key={x} value={x}>{x}</option>)}</select></label><label>Status<select name="status" defaultValue="draft"><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label></div><label>Category<input name="category" maxLength={80}/></label><label>Cover image URL<input name="cover_url" type="url" placeholder="https://…"/></label><label>Private R2 media key<input name="r2_media_key" placeholder="e.g. podcasts/episode.mp3" maxLength={1024}/></label><label className="admin-check"><input name="member_only" type="checkbox"/> Members only</label><button className="admin-button" type="submit">Save content</button></form><div className="admin-recent"><h3>Recent content</h3>{content.slice(0,8).map((c)=><div className="admin-list-row" key={c.id}><span><strong>{c.title}</strong><small>{c.type}{c.member_only ? " · Members only" : ""}</small></span><span className={statusClass(c.status)}>{c.status}</span></div>)}{content.length===0&&<p className="admin-help">No content entries yet.</p>}</div></section>
        <section className="admin-panel" id="events"><div className="admin-panel-heading"><div><p className="admin-eyebrow">COMMUNITY</p><h2>Create event</h2></div></div><form action={createEvent} className="admin-form"><label>Event title<input name="title" required maxLength={160}/></label><label>Description<textarea name="description" rows={3} maxLength={3000}/></label><label>Starts at<input name="starts_at" type="datetime-local" required/></label><label>Ends at (optional)<input name="ends_at" type="datetime-local"/></label><label>Location<input name="location" maxLength={250}/></label><label>Registration URL<input name="registration_url" type="url" placeholder="https://…"/></label><label>Status<select name="status" defaultValue="draft"><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label><button className="admin-button" type="submit">Save event</button></form><div className="admin-recent"><h3>Upcoming / recent events</h3>{events.slice(0,8).map((e)=><div className="admin-list-row" key={e.id}><span><strong>{e.title}</strong><small>{date(e.starts_at)}{e.location ? ` · ${e.location}` : ""}</small></span><span className={statusClass(e.status)}>{e.status}</span></div>)}{events.length===0&&<p className="admin-help">No events yet.</p>}</div></section>
      </div>
      <section className="admin-panel" id="schools"><div className="admin-panel-heading"><div><p className="admin-eyebrow">SCHOOL ACCESS</p><h2>Create school code</h2></div></div><form action={createSchoolCode} className="admin-form admin-school-form"><label>School name<input name="school_name" required maxLength={160}/></label><label>Contact email (optional)<input name="contact_email" type="email" maxLength={254}/></label><label>Maximum redemptions<input name="max_uses" type="number" min={1} max={10000} defaultValue={25} required/></label><label>Expires at (optional)<input name="expires_at" type="datetime-local"/></label><button className="admin-button" type="submit">Create school and code</button></form><p className="admin-help">Codes are generated securely. Only the code hash is stored; the plaintext code is shown once after creation.</p><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>School</th><th>Contact</th><th>Status</th><th>Created</th></tr></thead><tbody>{schools.map((s)=><tr key={s.id}><td>{s.name}</td><td>{s.contact_email || "—"}</td><td><span className={statusClass(s.is_active ? "active" : "inactive")}>{s.is_active ? "active" : "inactive"}</span></td><td>{date(s.created_at)}</td></tr>)}{schools.length===0&&<tr><td colSpan={4}>No schools created yet.</td></tr>}</tbody></table></div></section>
      <div className="admin-two-col"><section className="admin-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">INBOX</p><h2>Contact & school inquiries</h2></div><span>{inquiries.length}</span></div>{inquiries.slice(0,15).map((i)=><article className="admin-inquiry" key={i.id}><div><strong>{i.name}</strong><span className={statusClass(i.kind)}>{i.kind}</span></div><a href={`mailto:${i.email}`}>{i.email}</a>{i.subject&&<b>{i.subject}</b>}<p>{i.message}</p><small>{date(i.created_at)}</small></article>)}{inquiries.length===0&&<p className="admin-help">No inquiries found.</p>}</section>
      <section className="admin-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">NEWSLETTER</p><h2>Subscribers</h2></div><span>{subscribers.length}</span></div>{subscribers.slice(0,30).map((s)=><div className="admin-list-row" key={s.id}><span><strong>{s.email}</strong><small>{date(s.created_at)}</small></span><span className={statusClass(s.status)}>{s.status}</span></div>)}{subscribers.length===0&&<p className="admin-help">No newsletter subscribers found.</p>}</section></div>
      <footer className="admin-footer">Signed in as {user.email || "administrator"} · <Link href="/">Return to Teens2Inspire</Link></footer>
    </div>
  </main>;
}
