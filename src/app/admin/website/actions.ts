"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { EDITABLE_MARKETING_FIELDS } from "@/lib/editable-marketing-fields";

export async function saveWebsiteSetting(form: FormData) {
 const {supabase,user}=await requireAdmin();
 const key=String(form.get("setting_key")||"");
 const value=String(form.get("setting_value")||"").trim();
 const meta=EDITABLE_MARKETING_FIELDS[key as keyof typeof EDITABLE_MARKETING_FIELDS];
 if(!meta || value.length>8000 || (!meta.image && !value) || (meta.image && value && !/^https:\/\/[^\s]+$/.test(value))) redirect("/admin/website?error=invalid");
 const {error}=await supabase.from("marketing_settings").upsert({setting_key:key,setting_value:value,updated_by:user!.id,updated_at:new Date().toISOString()},{onConflict:"setting_key"});
 if(error) redirect("/admin/website?error=save-failed");
 revalidatePath("/");revalidatePath("/about");revalidatePath("/podcast");revalidatePath("/membership");revalidatePath("/admin/website");
 redirect("/admin/website?saved=1");
}
