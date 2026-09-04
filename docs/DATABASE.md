# Intended database schema (not applied)

Supabase is not linked. Do not run these statements until a project exists and RLS is reviewed. This file is the contract for a later migration.

## Extensions

```sql
create extension if not exists "pgcrypto";
```

## Tables

### profiles
- `id uuid primary key references auth.users`
- `full_name text`
- `created_at timestamptz default now()`

### products
- `id uuid primary key default gen_random_uuid()`
- `slug text unique not null`
- `number text not null`
- `name text not null`
- `subtitle text`
- `description text`
- `status text check (status in ('draft','coming_soon','active','sold_out','archived'))`
- `featured boolean default false`
- `scent_profile jsonb not null`
- `notes jsonb not null`
- `occasion text[]`
- `season text[]`
- `updated_at timestamptz`

### product_variants
- `id uuid primary key`
- `product_id uuid references products`
- `sku text unique`
- `label text`
- `ml int`
- `price_paise int` — nullable; null means LAUNCHING SOON
- `inventory int not null default 0 check (inventory >= 0)`

### product_images
- `id uuid primary key`
- `product_id uuid references products`
- `src text`
- `alt text`
- `placeholder boolean default true`
- `sort int`

### carts / cart_lines
Server carts are optional while localStorage is the guest cart. If added:
- `carts(id, user_id nullable, created_at)`
- `cart_lines(id, cart_id, product_id, variant_id, quantity)`
Totals are never stored as authority — recompute from variants.

### orders
- `id text primary key` — `RP` + hex
- `kind text check (kind in ('request','paid'))`
- `status text`
- `email text`
- `name text`
- `phone text`
- `subtotal_paise int`
- `discount_percent int check (discount_percent in (0,5))`
- `total_paise int`
- `provider text` — `manual` | `whatsapp` | `razorpay`
- `provider_ref text`
- `created_at timestamptz`

### order_lines
- Server-validated snapshot of name, sku, qty, unit_paise

### quiz_sessions
- anonymous `id`
- `answers jsonb`
- `primary_product_id`
- `secondary_product_id`
- no email unless the visitor later attaches an account

### next_drop_votes
- `id`
- `campaign_id`
- `email_hash text`
- `payload jsonb`
- `created_at`
- unique `(campaign_id, email_hash)`

### rewards
- `id`
- `email_hash text`
- `code_hash text`
- `percent int default 5 check (percent = 5)`
- `campaign_id`
- `issued_at`
- unique `(campaign_id, email_hash)`
Store hashes, not reusable plaintext codes.

## RLS notes

- Public `select` on `products` / variants / images where `status` in (`coming_soon`,`active`,`sold_out`).
- No public insert on products.
- `profiles`, `orders`, `rewards` readable only by the owning user.
- Service role only on the server. Never in `NEXT_PUBLIC_*`.
- Admin writes go through a service role after a separate staff auth — not the customer anon key.
- Votes insert: allow insert if `email_hash` unique for campaign; no public read of emails.

## Until this exists

The app uses `data/fragrance-config.ts`, localStorage, signed cookies, and honest empty states.
