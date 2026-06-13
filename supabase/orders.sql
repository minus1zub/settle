create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  order_number text unique not null,
  title text not null,
  phrase text,
  status text not null default 'assembled',
  author_name text,
  telegram_user_id text,
  address jsonb,
  courier_comment text,
  items jsonb not null,
  total_price integer not null default 0,
  created_at timestamptz not null default now()
);

alter table orders enable row level security;

drop policy if exists "Anyone can read orders" on orders;
create policy "Anyone can read orders"
on orders
for select
using (true);

drop policy if exists "Anyone can create orders" on orders;
create policy "Anyone can create orders"
on orders
for insert
with check (true);
