-- PEACE SLIDES account data. All private rows are isolated by Supabase Auth RLS.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_favourites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type text not null check (item_type in ('theme','background','font','font_style','text_color','effect','setting')),
  item_id text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (user_id, item_type, item_id)
);

create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  preferences jsonb not null default '{}'::jsonb,
  recent_designs jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.saved_songs (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (length(trim(title)) > 0),
  song_document jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists saved_songs_user_updated_idx on public.saved_songs(user_id, updated_at desc);

create or replace function public.handle_new_peace_slides_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name) values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', '')) on conflict (id) do nothing;
  insert into public.user_preferences (user_id) values (new.id) on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_peace_slides on auth.users;
create trigger on_auth_user_created_peace_slides after insert on auth.users
for each row execute procedure public.handle_new_peace_slides_user();

alter table public.profiles enable row level security;
alter table public.user_favourites enable row level security;
alter table public.user_preferences enable row level security;
alter table public.saved_songs enable row level security;

create policy "profiles_select_own" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "favourites_select_own" on public.user_favourites for select to authenticated using ((select auth.uid()) = user_id);
create policy "favourites_insert_own" on public.user_favourites for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "favourites_delete_own" on public.user_favourites for delete to authenticated using ((select auth.uid()) = user_id);
create policy "preferences_select_own" on public.user_preferences for select to authenticated using ((select auth.uid()) = user_id);
create policy "preferences_insert_own" on public.user_preferences for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "preferences_update_own" on public.user_preferences for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "songs_select_own" on public.saved_songs for select to authenticated using ((select auth.uid()) = user_id);
create policy "songs_insert_own" on public.saved_songs for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "songs_update_own" on public.saved_songs for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "songs_delete_own" on public.saved_songs for delete to authenticated using ((select auth.uid()) = user_id);

grant select, update on public.profiles to authenticated;
grant select, insert, delete on public.user_favourites to authenticated;
grant select, insert, update on public.user_preferences to authenticated;
grant select, insert, update, delete on public.saved_songs to authenticated;
