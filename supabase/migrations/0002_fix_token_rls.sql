-- FIX: The next_daily_token() function was blocked by RLS on daily_token_counter.
-- This patch makes the function run as SECURITY DEFINER (superuser context) so it
-- can always upsert the counter, and adds a read/write policy as a fallback.

-- 1. Recreate the function with SECURITY DEFINER
create or replace function next_daily_token()
returns int
language plpgsql
security definer
as $$
declare
  v_token int;
  v_day date := (now() at time zone 'utc')::date;
begin
  insert into daily_token_counter (day, last_token)
  values (v_day, 1)
  on conflict (day) do update set last_token = daily_token_counter.last_token + 1
  returning last_token into v_token;
  return v_token;
end;
$$;

-- 2. Also add an RLS policy as belt-and-suspenders
create policy "daily_token_counter is writable by anyone" on daily_token_counter
  for all using (true) with check (true);
