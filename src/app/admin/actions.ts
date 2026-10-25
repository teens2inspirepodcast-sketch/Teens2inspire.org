"use server";

import { createHash, randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";

function text(formData: FormData, key: string, max = 500) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 90);
}
function go(message: string): never { redirect(`/admin?notice=${encodeURIComponent(message)}`); }

export async function createContent(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const title = text(formData, "title", 160);
  const description = text(formData, "description", 3000);
  const type = text(formData, "type", 30);
  const category = text(formData, "category", 80);
  const coverUrl = text(formData, "cover_url", 1000);
  const mediaProviderId = text(formData, "r2_media_key", 1024);
  const status = text(formData, "status", 20);
  const memberOnly = formData.get("member_only") === "on";
  if (!title) go("Add a title before saving content.");
  if (!/[a-z0-9]/i.test(title)) go("Please enter a valid title.");
  const validTypes = ["video", "podcast", "article", "resource", "printable", "pick", "event", "recipe", "original"];
  if (!validTypes.includes(type)) go("Choose a valid content type.");
  const validStatus = ["draft", "published", "archived"];
  if (!validStatus.includes(status)) go("Choose a valid content status.");
  const slugBase = slugify(title) || `content-${Date.now()}`;
  const { data: existing } = await supabase.from("content").select("slug").like("slug", `${slugBase}%`).limit(50);
  const slugs = new Set((existing || []).map((row) => row.slug));
  let slug = slugBase; let suffix = 2;
  while (slugs.has(slug)) slug = `${slugBase}-${suffix++}`;
  const { error } = await supabase.from("content").insert({
    title, slug, description, type, category: category || null,
    cover_url: coverUrl || null, r2_media_key: mediaProviderId || null,
    member_only: memberOnly, status, featured: false,
    published_at: status === "published" ? new Date().toISOString() : null,
    created_by: user.id,
  });
  if (error) go(`Content could not be saved: ${error.message}`);
  revalidatePath("/admin"); revalidatePath("/"); go("Content saved.");
}

export async function createEvent(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const title = text(formData, "title", 160);
  const description = text(formData, "description", 3000);
  const startsAt = text(formData, "starts_at", 80);
  const endsAt = text(formData, "ends_at", 80);
  const location = text(formData, "location", 250);
  const registrationUrl = text(formData, "registration_url", 1000);
  const status = text(formData, "status", 20);
  if (!title || !startsAt || !Number.isFinite(Date.parse(startsAt))) go("Enter an event title and valid start date/time.");
  if (endsAt && (!Number.isFinite(Date.parse(endsAt)) || Date.parse(endsAt) < Date.parse(startsAt))) go("The event end must be after its start.");
  if (registrationUrl && !/^https:\/\//i.test(registrationUrl)) go("Registration links must begin with https://.");
  if (!["draft", "published", "archived"].includes(status)) go("Choose a valid event status.");
  const { error } = await supabase.from("events").insert({
    title, description, starts_at: new Date(startsAt).toISOString(),
    ends_at: endsAt ? new Date(endsAt).toISOString() : null,
    location: location || null, registration_url: registrationUrl || null,
    status, created_by: user.id,
  });
  if (error) go(`Event could not be saved: ${error.message}`);
  revalidatePath("/admin"); revalidatePath("/events"); go("Event saved.");
}

export async function createSchoolCode(formData: FormData) {
  const { supabase } = await requireAdmin();
  const schoolName = text(formData, "school_name", 160);
  const email = text(formData, "contact_email", 254).toLowerCase();
  const maxUses = Number(text(formData, "max_uses", 6) || "1");
  const expiresText = text(formData, "expires_at", 40);
  if (!schoolName) go("Enter a school name.");
  if (!Number.isInteger(maxUses) || maxUses < 1 || maxUses > 10000) go("Use a limit between 1 and 10,000.");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) go("Enter a valid contact email.");
  if (expiresText && !Number.isFinite(Date.parse(expiresText))) go("Enter a valid expiration date.");
  const { data: school, error: schoolError } = await supabase.from("schools").insert({ name: schoolName, contact_email: email || null }).select("id").single();
  if (schoolError || !school) go(`School could not be saved: ${schoolError?.message || "Unknown error"}`);
  const rawCode = `TEENS2INSPIRE-${randomBytes(7).toString("hex").toUpperCase()}`;
  const codeHash = createHash("sha256").update(rawCode).digest("hex");
  const { error: codeError } = await supabase.from("school_codes").insert({
    school_id: school.id, code_hash: codeHash, max_uses: maxUses,
    expires_at: expiresText ? new Date(expiresText).toISOString() : null,
  });
  if (codeError) {
    await supabase.from("schools").delete().eq("id", school.id);
    go(`School code could not be created: ${codeError.message}`);
  }
  revalidatePath("/admin");
  // Display the one-time code only to the authenticated administrator.
  redirect(`/admin?createdCode=${encodeURIComponent(rawCode)}&notice=${encodeURIComponent("School and code created. Copy the code now; only its hash is stored.")}`);
}
