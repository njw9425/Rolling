# Rolling Stones Platform

Starter implementation for a Rolling Stones bowling club growth platform. The app focuses on improvement-based competition instead of only rewarding high scores.

## Included

- Next.js App Router + TypeScript + Tailwind CSS
- Home dashboard
- Growth, average, and high-score rankings
- Match logging page with auth-aware save flow
- Login and signup screens
- Admin dashboard foundation
- My Page personal dashboard
- Prisma-ready server data layer with mock fallback
- Prisma schema draft and seed script

## Demo accounts

- Admin: `captain@rollingstones.club` / `bowling123!`
- Member: `member@rollingstones.club` / `bowling123!`

Without `DATABASE_URL`, the app runs in demo mode and uses signed cookies for session flow.

## Run locally

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` and fill in your values.

Prisma setup:

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

## Recommended next steps

1. Connect league events and badges to real database tables
2. Add per-frame detailed game entry
3. Build season creation and ranking policy editors
4. Add charts to the personal My Page
5. Upgrade Next.js to the latest patched 15.x release
