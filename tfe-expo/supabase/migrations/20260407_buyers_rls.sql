alter table public.buyers enable row level security;

drop policy if exists "buyers_insert_public" on public.buyers;
drop policy if exists "buyers_select_own_email" on public.buyers;
drop policy if exists "buyers_update_own_email" on public.buyers;

create policy "buyers_insert_public"
on public.buyers
for insert
to anon, authenticated
with check (true);

create policy "buyers_select_own_email"
on public.buyers
for select
to authenticated
using (
  lower(email) = lower((auth.jwt() ->> 'email'))
);

create policy "buyers_update_own_email"
on public.buyers
for update
to authenticated
using (
  lower(email) = lower((auth.jwt() ->> 'email'))
)
with check (
  lower(email) = lower((auth.jwt() ->> 'email'))
);
