# FuelUp — Gym Cafe Ordering App

A lightweight order-ahead system for a gym cafe. Members browse the menu on their phone during a workout, place an order, get a token number, and pick up at the counter. The kitchen sees orders on a realtime dashboard.

## Tech Stack

- **Next.js 16** (App Router, React 19)
- **Supabase** (Postgres + Realtime)
- **Zustand** (client-side cart)
- **Tailwind CSS v4** + shadcn-style UI primitives
- **Lucide** icons

## Getting Started

1. **Create a Supabase project** and run the migration in `supabase/migrations/0001_init.sql` via the SQL editor.
2. Copy `.env.local.example` → `.env.local` and fill in your Supabase URL & anon key.
3. Install deps and run:

```bash
npm install
npm run dev
```

4. Customer app: `http://localhost:3000`
5. Kitchen dashboard: `http://localhost:3000/dashboard` (PIN: `1234`)

## Flow

1. **Customer** → browses `/menu` → adds items to cart → `/cart` → enters name + phone → places order
2. **System** → creates order in Supabase with auto-incrementing daily token number
3. **Customer** → sees confirmation at `/order/[id]` with big token number
4. **Dashboard** → realtime subscription picks up new order → plays sound → shows sticky-note card
5. **Staff** → clicks "Print & Prepare" → receipt auto-prints → order moves to "Preparing" column
6. **Staff** → clicks "Mark Complete" when food is ready → order moves to "Completed"
7. **Customer** → shows token at counter → takes food

## Security Note

This is an MVP. The dashboard is gated by a client-side PIN (`.env.local`), not real auth. Menu and orders are publicly readable. Before going to production, add proper Supabase RLS policies and server-side auth.
