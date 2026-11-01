-- Teens2Inspire promotional modal CMS. Run in the EXISTING Supabase project.
-- Additive only: existing billing, auth, media and Stripe schema/functions are untouched.
create table if not exists public.site_popup (
  id smallint primary key default 1 check (id = 1),
  is_enabled boolean not null default false,
  eyebrow text not null default 'A LITTLE SOMETHING NEW' check (char_length(eyebrow) <= 90),
  title text not null default 'Welcome to Teens2Inspire' check (char_length(title) between 1 and 140),
  body text not null default 'Discover a new space made for Jewish teen girls.' check (char_length(body) <= 1200),
  cta_label text not null default 'Explore Teens2Inspire' check (char_length(cta_label) <= 55),
  cta_href text not null default '/signup' check (char_length(cta_href) <= 1000),
  media_path text check (media_path is null or media_path ~ '^popup/[a-zA-Z0-9._/-]{1,220}$'),
  media_kind text check (media_kind is null or media_kind in ('image','video')),
  media_alt text not null default 'Teens2Inspire announcement' check (char_length(media_alt) <= 180),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null,
  constraint media_consistency check ((media_path is null and media_kind is null) or (media_path is not null and media_kind is not null))
);
alter table public.site_popup enable row level security;
drop policy if exists "public reads published site popup" on public.site_popup;
drop policy if exists "admin manages site popup" on public.site_popup;
create policy "public reads published site popup" on public.site_popup
  for select to anon, authenticated using (is_enabled = true);
create policy "admin manages site popup" on public.site_popup
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
revoke all on public.site_popup from public;
grant select on public.site_popup to anon, authenticated;
grant insert,update,delete on public.site_popup to authenticated;
insert into public.site_popup (id,is_enabled) values (1,false) on conflict (id) do nothing;

-- Media is intentionally PUBLIC because the modal is on a public marketing website.
-- Only authenticated administrators may upload, change, or remove assets.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('site-popup-media','site-popup-media',true, 83886080,
 array['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','video/quicktime'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "site popup admin reads uploads" on storage.objects;
create policy "site popup admin reads uploads" on storage.objects for select to authenticated
  using (bucket_id='site-popup-media' and public.is_admin());
drop policy if exists "site popup admin uploads" on storage.objects;
drop policy if exists "site popup admin edits" on storage.objects;
drop policy if exists "site popup admin deletes" on storage.objects;
create policy "site popup admin uploads" on storage.objects for insert to authenticated
  with check (bucket_id='site-popup-media' and public.is_admin() and name like 'popup/%');
create policy "site popup admin edits" on storage.objects for update to authenticated
  using (bucket_id='site-popup-media' and public.is_admin())
  with check (bucket_id='site-popup-media' and public.is_admin());
create policy "site popup admin deletes" on storage.objects for delete to authenticated
  using (bucket_id='site-popup-media' and public.is_admin());
