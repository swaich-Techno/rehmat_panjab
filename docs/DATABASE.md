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
- `role text not null default 'customer' check (role in ('super_admin','admin','customer'))`
- `created_at timestamptz default now()`
Roles are server-controlled. Never trust a client-sent role.

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

### product_images / product_media
- `id uuid primary key`
- `product_id uuid references products`
- `src text`
- `alt text`
- `placeholder boolean default true`
- `kind text check (kind in ('still','detail','atmosphere','placeholder'))`
- `sort int`
Until Supabase Storage exists, uploads remain local placeholders and must not be labelled as cloud saves.

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

### custom_fragrance_concepts
Preference portraits from Create Your Rehmat. **Not manufacturing formulas. No percentage columns.**
- `id uuid primary key default gen_random_uuid()`
- `user_id uuid references auth.users` nullable
- `name text`
- `answers jsonb not null`
- `notes text[] not null`
- `distance text`
- `hour text`
- `email_hash text` nullable
- `created_at timestamptz default now()`
Do not store `formula_percent` or note-weight maps that pretend to be juice math.

### next_drop_votes
- `id`
- `campaign_id`
- `email_hash text`
- `payload jsonb`
- `created_at`
- unique `(campaign_id, email_hash)`

### launch_notifications
Opt-in only. Default false. Never insert a row that implies consent from a missing checkbox.
- `id uuid primary key`
- `campaign_id text not null`
- `email_hash text`
- `phone_hash text`
- `notify_email boolean not null default false`
- `notify_sms boolean not null default false`
- `created_at timestamptz`
- unique `(campaign_id, email_hash)` where email_hash is not null
SMS rows require a configured provider; otherwise reject rather than queue a fake send.

### notifications
In-app staff/customer notices. Empty until a real event exists.
- `id uuid primary key`
- `audience text check (audience in ('staff','customer'))`
- `title text not null`
- `body text`
- `read_at timestamptz`
- `created_at timestamptz`
Do not seed demo restocks or fake orders.

### admin_audit_log
- `id uuid primary key`
- `actor_id uuid`
- `actor_role text check (actor_role in ('super_admin','admin'))`
- `action text not null`
- `entity text`
- `entity_id text`
- `payload jsonb`
- `created_at timestamptz default now()`
Preview-key sessions are not a production audit trail.

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

- Public `select` on `products` / variants / `product_media` where `status` in (`coming_soon`,`active`,`sold_out`).
- No public insert on products or media.
- `profiles`, `orders`, `rewards`, `custom_fragrance_concepts` readable only by the owning user.
- `launch_notifications` insert allowed only with `notify_email` / `notify_sms` explicitly true or false from the server parse — never inferred.
- `notifications` readable by audience; no public write.
- `admin_audit_log` staff-only select; insert via service role after staff auth.
- Service role only on the server. Never in `NEXT_PUBLIC_*`.
- Admin writes go through a service role after a separate staff auth — not the customer anon key.
- Votes insert: allow insert if `email_hash` unique for campaign; no public read of emails.

## Until this exists

The app uses `data/fragrance-config.ts`, `data/homepage-cms.ts`, localStorage, signed cookies, an in-memory/`/tmp` checkout request map, and honest empty states.
