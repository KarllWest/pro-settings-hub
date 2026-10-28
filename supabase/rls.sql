-- KeyBindy · Row Level Security
-- Everyone can read; only admins (profiles.is_admin) can write. Users can no longer promote themselves.
-- Safe to re-run: every policy is dropped before it is created. Run in Supabase → SQL Editor.

begin;

-- 1. Helper: is the current user an admin? SECURITY DEFINER so policies on profiles don't recurse.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select p.is_admin from public.profiles p where p.id = auth.uid()), false);
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- 2. Catalogue tables: public read, admin write.
do $$
declare t text;
begin
  foreach t in array array['teams', 'players', 'setups', 'game_stats', 'player_history'] loop
    execute format('alter table public.%I enable row level security', t);

    execute format('drop policy if exists "Public read" on public.%I', t);
    execute format('drop policy if exists "Admins write" on public.%I', t);
    execute format('create policy "Public read" on public.%I for select using (true)', t);
    execute format('create policy "Admins write" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

-- player_history had a policy letting any signed-in user change or delete everything.
drop policy if exists "Authenticated users can modify player_history" on public.player_history;
drop policy if exists "Public player_history are viewable by everyone" on public.player_history;

-- 3. profiles: users still edit their own row, but only an admin (or the service role) can change is_admin.
create or replace function public.protect_is_admin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- The dashboard / service role bypasses this (auth.uid() is null there).
  if auth.uid() is null or public.is_admin() then
    return new;
  end if;
  if tg_op = 'INSERT' then
    new.is_admin := false;
  elsif new.is_admin is distinct from old.is_admin then
    raise exception 'Only admins can change is_admin';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_is_admin on public.profiles;
create trigger protect_is_admin
  before insert or update on public.profiles
  for each row execute function public.protect_is_admin();

-- 4. Trigger functions run without EXECUTE; don't expose them as /rest/v1/rpc endpoints.
revoke execute on function public.protect_is_admin() from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

commit;

-- Check afterwards:
--   select tablename, policyname, cmd from pg_policies where schemaname = 'public' order by 1, 2;
