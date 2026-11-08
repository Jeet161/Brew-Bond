# Beyond — Real-World Social Discovery Network

> "Not another place to scroll. A place to show up."

**Beyond** is an offline social discovery platform built around people, small-group activities, persistent circles, verified hosts, and welcoming neighborhood cafes in **Guwahati, Assam, India**.

---

## Architecture & Technology Stack

- **Framework**: Next.js 16 (App Router, Server Components & Server Actions)
- **Language**: TypeScript (Strict Mode)
- **Database**: PostgreSQL (Prisma ORM with parameterized SQL and row locking for seat capacity)
- **Styling**: Tailwind CSS v4 with custom design tokens:
  - Background: Warm Cream (`#FAF7F2`)
  - Primary: Deep Forest Green (`#1B4332`)
  - Accent: Coral / Terracotta (`#E07A5F`)
- **Authentication**: Auth.js (NextAuth v5 beta) with demo-impersonation switcher for development
- **Outbox Pattern**: PostgreSQL `OutboxEvent` table for reliable background notification delivery

---

## Directory Structure

```
Brew & Bond/
├── src/
│   ├── app/
│   │   ├── (auth)/auth/signin/   # 1-click role switcher (Participant, Host, Admin)
│   │   ├── discover/             # Filterable event feed (Neighborhoods & Categories)
│   │   ├── events/[slug]/        # Event detail, logistics, host bio & seat booking
│   │   ├── circles/              # Persistent social circles & community groups
│   │   ├── plans/                # My Plans (confirmed seats, waitlist positions)
│   │   ├── host/                 # Host management dashboard & check-ins
│   │   └── api/
│   │       ├── auth/             # NextAuth route handler
│   │       └── bookings/         # Atomic seat reservation & waitlist promotion
│   ├── components/
│   │   ├── events/               # EventCard, BookingButton
│   │   ├── shared/               # Navbar, MobileNav, Footer
│   │   └── ui/                   # Button, Badge, accessible primitives
│   ├── modules/
│   │   ├── discovery/            # Filter validation and discovery queries
│   │   └── bookings/             # Concurrency-safe transactions (FOR UPDATE)
│   ├── config/
│   │   └── guwahati.ts           # Neighborhoods, activities & city constants
│   └── lib/
│       ├── db.ts                 # Prisma Client singleton
│       ├── auth.ts               # NextAuth setup
│       ├── errors.ts             # Domain error taxonomy
│       └── utils.ts              # Currency (paise to INR) & datetime formatters
├── prisma/
│   ├── schema.prisma             # Full relational model (Events, Bookings, Circles, Venues, Trust)
│   └── seed.ts                   # Realistic Guwahati seed data
├── docker-compose.yml            # Local PostgreSQL instance
├── .env.example                  # Environment configuration template
└── package.json
```

---

## Setup with Cloud PostgreSQL (Neon / Supabase — No Docker Required)

### 1. Set your Database URL
Paste your Neon or Supabase PostgreSQL connection string into `.env`:
```env
DATABASE_URL="postgresql://username:password@ep-xyz.aws.neon.tech/neondb?sslmode=require"
```

### 2. Push Schema & Seed
```bash
pnpm db:push
npx tsx prisma/seed.ts
```

### 3. Start Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Verification & Build Validation

A clean production build has been validated:
```bash
pnpm build
```
Routes generated:
- `ƒ /` — Homepage with trust wedge, value proposition & featured meetups
- `ƒ /discover` — Multi-filter discovery (Pan Bazaar, Uzan Bazaar, Christian Basti, Zoo Road)
- `ƒ /events/[slug]` — Event details with real-time seat reservation & waitlist flow
- `ƒ /circles` — Persistent social circles
- `ƒ /plans` — My Plans (attendee confirmation cards)
- `ƒ /host` — Host portal
- `○ /auth/signin` — 1-click demo role switcher (Participant, Host, Admin)
- `ƒ /api/bookings` — Atomic booking API endpoint
