# Settle MVP

Settle is a Telegram Mini App MVP where a user assembles an almost-real home goods order, chooses an address, gets a clean order card, and shares a public link with friends.

The product is order-first: not Pinterest, not a moodboard, not a real checkout.

## Stack

- React + TypeScript + Vite
- React Router
- Zustand + localStorage
- Supabase JS
- DaData address suggestions and optional 2GIS geocoding/map confirmation
- Telegram WebApp fallback helpers, without making the SDK a blocker
- Sonner toasts
- Lucide icons

## Local Setup

Install dependencies:

```bash
npm install
```

Create `.env.local` from `.env.example`:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_PUBLIC_APP_URL=
VITE_TELEGRAM_BOT_USERNAME=settle_home_bot
VITE_DADATA_TOKEN=
VITE_2GIS_KEY=
VITE_DEFAULT_CITY=Якутск
VITE_DEFAULT_COUNTRY=RU
```

Run locally:

```bash
npm run dev
```

Do not put `BOT_TOKEN` into frontend env files. The bot token must be kept server-side only and should be rotated if it was shared in documents or chat.

## Supabase

Create the `orders` table by running:

```sql
-- supabase/orders.sql
```

The full SQL is in `supabase/orders.sql`.

For MVP, read and insert policies are open. Later, add abuse prevention and Telegram `initData` verification.

Required frontend keys:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Address APIs

Address suggestions use DaData when `VITE_DADATA_TOKEN` is present.

Optional map/reverse geocoding uses 2GIS when `VITE_2GIS_KEY` is present.

```env
VITE_DADATA_TOKEN=
VITE_2GIS_KEY=
VITE_DEFAULT_CITY=Якутск
VITE_DEFAULT_COUNTRY=RU
```

Do not put the DaData secret key into frontend env. Only the public/token value belongs here. If a future DaData method requires a secret, add a server/proxy first.

If DaData or 2GIS keys are missing, the address screen still works through manual input and confirmation without map.

## Vercel

Add the same variables in Vercel Project Settings -> Environment Variables.

After the first deploy, set:

```env
VITE_PUBLIC_APP_URL=https://your-project.vercel.app
```

Public order links are built as:

```txt
VITE_PUBLIC_APP_URL/order/:slug
```

If `VITE_PUBLIC_APP_URL` is empty, the app uses `window.location.origin`.

## Implemented

- Mobile-first app shell with bottom navigation.
- Home, rooms, catalog, product, order, address, public order, saved pages.
- 7 rooms and 30 mock SKU.
- Local draft order with quantities, address, saved products, last slug.
- Order card preview with order number, status, items, total, phrase, CTA.
- Supabase service for saving and reading public orders.
- DaData/manual address flow with optional map confirmation and graceful fallback.
- Telegram user data fallback through `window.Telegram.WebApp`, when available.
- Public page hides the precise address and courier comment.
- Russian UI copy with Settle tone.

## TODO

- PNG export for the order card.
- Stronger Supabase RLS and Telegram `initData` verification.
- Real Telegram BackButton integration.
- Production visual QA inside Telegram WebView.
- Optional Open Graph/share image setup.
