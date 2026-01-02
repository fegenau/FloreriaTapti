-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Orders Table
create table orders (
  id uuid default uuid_generate_v4() primary key,
  customer_name text not null,
  customer_rut text not null,
  customer_email text,
  customer_phone text,
  shipping_address text not null,
  shipping_commune text,
  status text check (status in ('pending', 'paid', 'failed', 'shipped')) default 'pending',
  total_amount integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Subscriptions Table
create table subscriptions (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references orders(id),
  duration_days integer check (duration_days in (15, 30)),
  start_date date,
  end_date date,
  is_active boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
