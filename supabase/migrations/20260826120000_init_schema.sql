-- PJ TV — schema inicial: perfiles, referentes, streams, chat, foros, likes.
create extension if not exists pgcrypto;

-- ============================================================
-- PROFILES
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique,
  role text not null default 'afiliado' check (role in ('afiliado', 'referente')),
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_public" on public.profiles
  for select using (true);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Crea automáticamente el perfil al registrarse (username/role vienen del metadata del signup).
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
    case
      when new.raw_user_meta_data ->> 'role' = 'referente' then 'referente'
      else 'afiliado'
    end
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- REFERENTE_DETAILS (datos territoriales, incluye PII sensible -> no es público)
-- ============================================================
create table public.referente_details (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  provincia text not null,
  ciudad_municipio text not null,
  barrio_direccion text not null,
  nombre_unidad_basica text,
  created_at timestamptz not null default now()
);

alter table public.referente_details enable row level security;

create policy "referente_details_select_own" on public.referente_details
  for select using (auth.uid() = user_id);

create policy "referente_details_insert_own" on public.referente_details
  for insert with check (auth.uid() = user_id);

create policy "referente_details_update_own" on public.referente_details
  for update using (auth.uid() = user_id);

-- Vista pública segura: expone provincia/ciudad para descubrimiento de streams,
-- pero nunca el barrio/dirección exacta del referente.
create view public.referente_public as
  select user_id, provincia, ciudad_municipio, nombre_unidad_basica
  from public.referente_details;

grant select on public.referente_public to anon, authenticated;

-- ============================================================
-- STREAMS
-- ============================================================
create table public.streams (
  id uuid primary key default gen_random_uuid(),
  referente_id uuid not null references public.profiles (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 140),
  description text,
  categoria text,
  mux_stream_id text,
  mux_playback_id text,
  mux_stream_key text,
  status text not null default 'idle' check (status in ('idle', 'active', 'ended')),
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.streams enable row level security;

-- El stream key de Mux nunca debe viajar al cliente: solo el service role (NestJS) lo lee.
revoke select on public.streams from anon, authenticated;
grant select (id, referente_id, title, description, categoria, mux_playback_id, status, started_at, ended_at, created_at)
  on public.streams to anon, authenticated;

create policy "streams_select_active" on public.streams
  for select using (status = 'active');

create policy "streams_select_own" on public.streams
  for select using (auth.uid() = referente_id);

create policy "streams_insert_own_referente" on public.streams
  for insert with check (
    auth.uid() = referente_id
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'referente')
  );

create policy "streams_update_own" on public.streams
  for update using (auth.uid() = referente_id);

create policy "streams_delete_own" on public.streams
  for delete using (auth.uid() = referente_id);

-- ============================================================
-- CHAT
-- ============================================================
create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  stream_id uuid not null references public.streams (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  message text not null check (char_length(message) between 1 and 500),
  created_at timestamptz not null default now()
);

alter table public.chat_messages enable row level security;

create index chat_messages_stream_id_idx on public.chat_messages (stream_id, created_at);

create table public.chat_bans (
  stream_id uuid not null references public.streams (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  banned_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now(),
  primary key (stream_id, user_id)
);

alter table public.chat_bans enable row level security;

create policy "chat_messages_select_public" on public.chat_messages
  for select using (true);

create policy "chat_messages_insert_not_banned" on public.chat_messages
  for insert with check (
    auth.uid() = user_id
    and not exists (
      select 1 from public.chat_bans b
      where b.stream_id = chat_messages.stream_id and b.user_id = auth.uid()
    )
  );

create policy "chat_messages_delete_own_or_owner" on public.chat_messages
  for delete using (
    auth.uid() = user_id
    or auth.uid() = (select s.referente_id from public.streams s where s.id = chat_messages.stream_id)
  );

create policy "chat_bans_select_stream_owner" on public.chat_bans
  for select using (
    auth.uid() = (select s.referente_id from public.streams s where s.id = chat_bans.stream_id)
  );

create policy "chat_bans_insert_stream_owner" on public.chat_bans
  for insert with check (
    auth.uid() = (select s.referente_id from public.streams s where s.id = chat_bans.stream_id)
  );

create policy "chat_bans_delete_stream_owner" on public.chat_bans
  for delete using (
    auth.uid() = (select s.referente_id from public.streams s where s.id = chat_bans.stream_id)
  );

-- ============================================================
-- FOROS
-- ============================================================
create table public.forum_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  sort_order int not null default 0
);

alter table public.forum_categories enable row level security;

create policy "forum_categories_select_public" on public.forum_categories
  for select using (true);

create table public.forum_threads (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.forum_categories (id),
  author_id uuid not null references public.profiles (id),
  title text not null check (char_length(title) between 1 and 200),
  provincia text,
  created_at timestamptz not null default now()
);

alter table public.forum_threads enable row level security;

create index forum_threads_category_idx on public.forum_threads (category_id, created_at desc);

create policy "forum_threads_select_public" on public.forum_threads
  for select using (true);

create policy "forum_threads_insert_own" on public.forum_threads
  for insert with check (auth.uid() = author_id);

create policy "forum_threads_update_own" on public.forum_threads
  for update using (auth.uid() = author_id);

create policy "forum_threads_delete_own" on public.forum_threads
  for delete using (auth.uid() = author_id);

create table public.forum_posts (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.forum_threads (id) on delete cascade,
  author_id uuid not null references public.profiles (id),
  body text not null check (char_length(body) between 1 and 5000),
  parent_post_id uuid references public.forum_posts (id),
  created_at timestamptz not null default now()
);

alter table public.forum_posts enable row level security;

create index forum_posts_thread_idx on public.forum_posts (thread_id, created_at);

create policy "forum_posts_select_public" on public.forum_posts
  for select using (true);

create policy "forum_posts_insert_own" on public.forum_posts
  for insert with check (auth.uid() = author_id);

create policy "forum_posts_update_own" on public.forum_posts
  for update using (auth.uid() = author_id);

create policy "forum_posts_delete_own" on public.forum_posts
  for delete using (auth.uid() = author_id);

-- ============================================================
-- LIKES (streams, threads, posts)
-- ============================================================
create table public.likes (
  id uuid primary key default gen_random_uuid(),
  target_type text not null check (target_type in ('stream', 'thread', 'post')),
  target_id uuid not null,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, target_type, target_id)
);

alter table public.likes enable row level security;

create index likes_target_idx on public.likes (target_type, target_id);

create policy "likes_select_public" on public.likes
  for select using (true);

create policy "likes_insert_own" on public.likes
  for insert with check (auth.uid() = user_id);

create policy "likes_delete_own" on public.likes
  for delete using (auth.uid() = user_id);

-- ============================================================
-- SEED: categorías doctrinarias fijas
-- ============================================================
insert into public.forum_categories (slug, name, sort_order) values
  ('independencia-economica', 'Independencia Económica', 1),
  ('justicia-social', 'Justicia Social', 2),
  ('soberania-politica', 'Soberanía Política', 3);

-- ============================================================
-- REALTIME: habilitar cambios en vivo para el chat
-- ============================================================
alter publication supabase_realtime add table public.chat_messages;
