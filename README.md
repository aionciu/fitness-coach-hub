# 🏋️‍♂️ Fitness Coach Hub – Developer Documentation

A modern, mobile-first SaaS platform for **independent fitness coaches** and **small coaching groups**.  
It enables coaches to manage clients, sessions, workouts, and progress — all in one energetic dashboard.

---

## 🚀 Tech Stack

- **Framework:** Next.js v15.5.4 (App Router, TypeScript, `/src` directory)
- **Database:** Supabase (Postgres + RLS)
- **Auth:** Supabase Auth (email, magic link, OAuth)
- **UI Library:** shadcn/ui + Tailwind CSS
- **State Management:** Zustand (local) + React Query (async data)
- **Animations:** Framer Motion
- **Charts:** Recharts
- **Package Manager:** pnpm
- **Deployment:** Vercel + Supabase Hosting

---

## 📂 Folder Structure

```bash
src/
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   └── layout.tsx
├── components/
├── lib/
├── hooks/
├── providers/
├── styles/
└── docs-v2/
