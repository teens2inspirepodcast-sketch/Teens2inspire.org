import { S3Client, PutObjectCommand, GetObjectCommand } from "npm:@aws-sdk/client-s3";
import { getSignedUrl } from "npm:@aws-sdk/s3-request-presigner";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const privateTypes = new Set(["audio/mpeg", "audio/mp4", "audio/aac", "audio/ogg", "audio/wav", "audio/x-wav", "video/mp4", "video/webm", "video/quicktime", "application/pdf", "image/jpeg", "image/png", "image/webp"]);
const imageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const safeKey = (key: string) => key.length > 0 && key.length <= 500 && !key.startsWith("/") && !key.includes("..") && !key.includes("\\") && /^[a-zA-Z0-9/_ .-]+$/.test(key);
function r2() {
  const accountId = Deno.env.get("R2_ACCOUNT_ID")!;
  return new S3Client({ region: "auto", endpoint: `https://${accountId}.r2.cloudflarestorage.com`, credentials: { accessKeyId: Deno.env.get("R2_ACCESS_KEY_ID")!, secretAccessKey: Deno.env.get("R2_SECRET_ACCESS_KEY")! } });
}
function configured() { return ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_PRIVATE_BUCKET_NAME", "R2_PUBLIC_BUCKET_NAME"].every((key) => Boolean(Deno.env.get(key))); }
Deno.serve(async (request) => {
  if (request.method !== "POST") return Response.json({ error: "Method not allowed." }, { status: 405 });
  if (!configured()) return Response.json({ error: "Media storage is not configured yet." }, { status: 503 });
  let body: { action?: string; contentId?: string; key?: string; contentType?: string; contentLength?: number; isPublic?: boolean };
  try { body = await request.json(); } catch { return Response.json({ error: "Invalid request." }, { status: 400 }); }
  const url = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const authorization = request.headers.get("Authorization");
  const userClient = createClient(url, anonKey, { global: authorization ? { headers: { Authorization: authorization } } : {} });
  const userResult = authorization ? await userClient.auth.getUser() : null;
  const user = userResult?.data.user ?? null;
  const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const s3 = r2();
  try {
    if (body.action === "upload-url") {
      if (!user) return Response.json({ error: "Please sign in to upload content." }, { status: 401 });
      const { data: profile } = await admin.from("profiles").select("role").eq("id", user.id).maybeSingle();
      if (profile?.role !== "administrator") return Response.json({ error: "You do not have permission to upload content." }, { status: 403 });
      const { key, contentType, contentLength, isPublic } = body;
      if (typeof key !== "string" || !safeKey(key) || typeof contentType !== "string" || typeof contentLength !== "number" || !Number.isSafeInteger(contentLength) || contentLength <= 0 || typeof isPublic !== "boolean") return Response.json({ error: "Choose a valid file and try again." }, { status: 400 });
      const maxSize = isPublic ? 10 * 1024 * 1024 : 2 * 1024 * 1024 * 1024;
      const allowed = isPublic ? imageTypes.has(contentType) : privateTypes.has(contentType);
      if (!allowed || contentLength > maxSize || (isPublic ? !key.startsWith("thumbnail/") : !key.startsWith("media/"))) return Response.json({ error: isPublic ? "Thumbnails must be supported images under 10 MB." : "Choose a supported audio, video, PDF, or image file under 2 GB." }, { status: 400 });
      const bucket = isPublic ? Deno.env.get("R2_PUBLIC_BUCKET_NAME")! : Deno.env.get("R2_PRIVATE_BUCKET_NAME")!;
      const command = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType, ContentLength: contentLength, CacheControl: isPublic ? "public, max-age=31536000, immutable" : "private, no-store" });
      return Response.json({ url: await getSignedUrl(s3, command, { expiresIn: 300 }), key });
    }
    if (body.action === "read") {
      if (typeof body.contentId !== "string") return Response.json({ error: "Content not found." }, { status: 404 });
      const { data: item } = await admin.from("content").select("id,status,member_only,r2_media_key").eq("id", body.contentId).maybeSingle();
      if (!item || item.status !== "published" || !item.r2_media_key) return Response.json({ error: "Content not found." }, { status: 404 });
      if (item.member_only) {
        if (!user) return Response.json({ error: "Sign in to access this content." }, { status: 401 });
        const [{ data: profile }, { data: subscription }, { data: legacyMembership }] = await Promise.all([
          admin.from("profiles").select("membership_status,membership_expires_at,membership_period_end").eq("id", user.id).maybeSingle(),
          admin.from("subscriptions").select("status,current_period_end").eq("user_id", user.id).in("status", ["active", "trialing"]).order("current_period_end", { ascending: false }).limit(1).maybeSingle(),
          admin.from("memberships").select("status,expires_at").eq("user_id", user.id).eq("status", "active").limit(1).maybeSingle(),
        ]);
        const now = Date.now();
        const profileActive = profile?.membership_status === "active" && (!profile.membership_expires_at || Date.parse(profile.membership_expires_at) > now) && (!profile.membership_period_end || Date.parse(profile.membership_period_end) > now);
        const subscriptionActive = Boolean(subscription && (subscription.status === "active" || subscription.status === "trialing") && (!subscription.current_period_end || Date.parse(subscription.current_period_end) > now));
        const legacyActive = Boolean(legacyMembership && (!legacyMembership.expires_at || Date.parse(legacyMembership.expires_at) > now));
        if (!profileActive && !subscriptionActive && !legacyActive) return Response.json({ error: "An active membership is required." }, { status: 403 });
      }
      const command = new GetObjectCommand({ Bucket: Deno.env.get("R2_PRIVATE_BUCKET_NAME")!, Key: item.r2_media_key });
      return Response.json({ url: await getSignedUrl(s3, command, { expiresIn: 3600 }) });
    }
    return Response.json({ error: "Choose a valid media action." }, { status: 400 });
  } catch {
    return Response.json({ error: "Media storage could not complete the request. Please try again." }, { status: 502 });
  }
});
