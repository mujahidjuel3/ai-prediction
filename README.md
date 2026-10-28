# AI Student Performance & Early Warning System

Frontend for a university academic analytics platform that monitors student performance and surfaces early-warning risk signals.

This repository contains the Main Next.js frontend and connects to the Academic Sentinel API.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- Recharts
- Lucide React

## Getting started

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` for local development. `NEXT_PUBLIC_API_BASE_URL` is the full API base URL and includes `/api/v1`; locally it defaults to `http://localhost:4000/api/v1`. Vercel Production uses `https://api.academicsentinel.live/api/v1`.

Open [http://localhost:3000](http://localhost:3000). The home route redirects to `/dashboard`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
```

## Notes

Prediction confidence and accuracy values are demonstration placeholders, not outputs from a trained model.
