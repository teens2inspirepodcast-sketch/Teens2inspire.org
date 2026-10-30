import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { EDITABLE_MARKETING_FIELDS } from "@/lib/editable-marketing-fields";
import { WebsiteSettingCard } from "@/components/website-setting-card";

export const dynamic="force-dynamic";
export default async function WebsiteEditor({searchParams}:{searchParams:Promise<{error?:string;saved?:string}>}){
 const {supabase}=await requireAdmin();
 const params=await searchParams;
 const {data,error}=await supabase.from("marketing_settings").select("setting_key,setting_value");
 const values=new Map((data||[]).map(row=>[row.setting_key,row.setting_value]));
 return <main className="website-editor-page"><header className="website-editor-top"><Link href="/admin">← Admin dashboard</Link><Link href="/">View website ↗</Link></header><div className="website-editor-intro"><span>YOUR WEBSITE / CONTENT MANAGER</span><h1>Website editor</h1><p>Edit the public website&apos;s headlines, descriptions, logo, and images. Changes are saved to Supabase, not hard-coded into the page.</p></div>
 {params.saved&&<p className="admin-notice">Setting saved. Check the public site for the update.</p>}{(params.error||error)&&<p role="alert" className="admin-alert">Could not save or load the setting. Check that the marketing CMS migration is installed and that you are signed in as administrator.</p>}
 <nav className="website-editor-shortcuts" aria-label="Other editing tools"><a href="https://media.teens2inspire.org/admin/content">Edit videos & podcasts ↗</a><a href="https://media.teens2inspire.org/admin/partnerships">Edit brand partnerships ↗</a><a href="https://media.teens2inspire.org/admin/events">Edit events ↗</a><a href="https://media.teens2inspire.org/admin/podcast-platforms">Edit podcast logos ↗</a><Link href="/admin/popup">Edit website pop-up ↗</Link></nav>
 <div className="website-settings-grid">{Object.entries(EDITABLE_MARKETING_FIELDS).map(([key,meta])=><WebsiteSettingCard key={key} settingKey={key} label={meta.label} help={meta.help} multiline={meta.multiline} image={meta.image} initialValue={values.get(key)||""}/>)}</div>
 <p className="website-editor-note">Subscription prices, school access rules, privacy policies, checkout, and account-security settings are intentionally not editable as freeform page text.</p></main>;
}
