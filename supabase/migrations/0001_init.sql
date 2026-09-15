-- Gym Cafe ordering schema
-- Run this in the Supabase SQL editor (or via `supabase db push`) on a fresh project.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Menu
-- ---------------------------------------------------------------------------
create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10, 2) not null default 0,
  prep_minutes int not null default 10,
  category text not null default 'General',
  image_url text,
  is_available boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Daily token counter — token numbers reset to 1 every day
-- ---------------------------------------------------------------------------
create table if not exists daily_token_counter (
  day date primary key,
  last_token int not null default 0
);

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

-- ---------------------------------------------------------------------------
-- Orders
-- ---------------------------------------------------------------------------
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  token_number int not null,
  customer_name text not null,
  customer_phone text not null,
  items jsonb not null,
  total_amount numeric(10, 2) not null default 0,
  status text not null default 'new' check (status in ('new', 'preparing', 'completed')),
  estimated_ready_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_status_idx on orders (status);
create index if not exists orders_phone_idx on orders (customer_phone);
create index if not exists orders_created_at_idx on orders (created_at desc);

create or replace function set_order_token()
returns trigger
language plpgsql
as $$
begin
  if new.token_number is null or new.token_number = 0 then
    new.token_number := next_daily_token();
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_set_order_token on orders;
create trigger trg_set_order_token
  before insert on orders
  for each row execute function set_order_token();

create or replace function touch_order_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_touch_order_updated_at on orders;
create trigger trg_touch_order_updated_at
  before update on orders
  for each row execute function touch_order_updated_at();

-- ---------------------------------------------------------------------------
-- Settings (offers / banner) — single row
-- ---------------------------------------------------------------------------
create table if not exists settings (
  id text primary key default 'main',
  banner_text text not null default '',
  banner_active boolean not null default false,
  updated_at timestamptz not null default now()
);

insert into settings (id) values ('main') on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- This is an MVP: menu is publicly readable, anyone can create an order and
-- read/update orders. There is no per-user auth in this app yet — the
-- dashboard is only gated by a client-side PIN. Tighten this before storing
-- anything sensitive or going into wider production use.
-- ---------------------------------------------------------------------------
alter table menu_items enable row level security;
alter table orders enable row level security;
alter table settings enable row level security;
alter table daily_token_counter enable row level security;

create policy "menu_items are readable by anyone" on menu_items
  for select using (true);
create policy "menu_items are writable by anyone" on menu_items
  for all using (true) with check (true);

create policy "orders are readable by anyone" on orders
  for select using (true);
create policy "anyone can create an order" on orders
  for insert with check (true);
create policy "anyone can update an order" on orders
  for update using (true) with check (true);

create policy "settings are readable by anyone" on settings
  for select using (true);
create policy "settings are writable by anyone" on settings
  for all using (true) with check (true);

create policy "daily_token_counter is writable by anyone" on daily_token_counter
  for all using (true) with check (true);

-- Realtime: make sure `orders` is in the realtime publication so the
-- dashboard gets live INSERT/UPDATE events.
alter publication supabase_realtime add table orders;

-- ---------------------------------------------------------------------------
-- Seed menu
-- ---------------------------------------------------------------------------
insert into menu_items (name, description, price, prep_minutes, category, sort_order) values
  ('Protein Shake', 'Whey protein, banana, milk', 350, 3, 'Shakes & Smoothies', 1),
  ('Peanut Butter Banana Smoothie', 'Peanut butter, banana, oats, milk', 400, 4, 'Shakes & Smoothies', 2),
  ('Grilled Chicken Sandwich', 'Grilled chicken breast, whole wheat bread, veggies', 550, 12, 'Post-Workout Meals', 1),
  ('Egg White Omelette', '4 egg whites, spinach, mushrooms', 450, 10, 'Post-Workout Meals', 2),
  ('Chicken & Rice Bowl', 'Grilled chicken, brown rice, steamed veggies', 650, 15, 'Post-Workout Meals', 3),
  ('Greek Yogurt Bowl', 'Greek yogurt, honey, granola, berries', 380, 5, 'Light Bites', 1),
  ('Boiled Eggs (2 pcs)', 'Simple, quick protein', 150, 3, 'Light Bites', 2),
  ('Black Coffee', 'Freshly brewed', 200, 3, 'Drinks', 1),
  ('Fresh Lime Water', 'Still or sparkling', 150, 2, 'Drinks', 2)
on conflict do nothing;
