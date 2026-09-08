-- Security baseline for the student game administration surface.
-- Apply this migration in Supabase before exposing the admin dashboard.

alter table if exists public.admins enable row level security;
alter table if exists public.records enable row level security;
alter table if exists public.audit_log enable row level security;

drop policy if exists "admins can read own profile" on public.admins;
create policy "admins can read own profile"
  on public.admins
  for select
  to authenticated
  using (id = auth.uid());

drop policy if exists "public can submit records" on public.records;
create policy "public can submit records"
  on public.records
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "admins can read records" on public.records;
create policy "admins can read records"
  on public.records
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.admins
      where admins.id = auth.uid()
        and admins.role in ('admin', 'super_admin')
    )
  );

drop policy if exists "admins can read audit log" on public.audit_log;
create policy "admins can read audit log"
  on public.audit_log
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.admins
      where admins.id = auth.uid()
        and admins.role in ('admin', 'super_admin')
    )
  );

-- No client-side UPDATE/DELETE policies are intentionally created for
-- records or audit_log. Destructive operations belong in a server-side,
-- audited workflow.
