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

## ✨ Key Features

### 🗓️ Session Management
- **Schedule Sessions**: Create training sessions with or without workout templates
- **Client Integration**: Rich client selection with search and contact details
- **Status Workflow**: Complete session lifecycle (scheduled → in_progress → completed)
- **Search & Filter**: Find sessions by title, client, or status
- **Real-time Updates**: Live session status changes and synchronization

### 👥 Client Management
- **Client Profiles**: Comprehensive client information and contact details
- **Progress Tracking**: Monitor client goals and achievements
- **Session History**: View all sessions for each client
- **Bulk Operations**: Manage multiple clients efficiently

### 🏋️ Workout Builder
- **Exercise Library**: Comprehensive database of exercises
- **Workout Templates**: Create reusable workout plans
- **Custom Workouts**: Build personalized training programs
- **Difficulty Levels**: Scale workouts for different fitness levels

### 📊 Progress Tracking
- **Metrics Dashboard**: Visual progress tracking and analytics
- **Goal Setting**: Set and monitor client objectives
- **Performance History**: Track improvements over time
- **Reporting**: Generate progress reports for clients

---

## 📂 Folder Structure

```bash
src/
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   │   ├── clients/
│   │   ├── sessions/          # 🆕 Session Management
│   │   ├── workouts/
│   │   ├── progress/
│   │   └── settings/
│   └── layout.tsx
├── components/
│   ├── clients/
│   ├── sessions/              # 🆕 Session Components
│   └── ui/
├── lib/
│   ├── api/
│   │   ├── clients.ts
│   │   └── sessions.ts        # 🆕 Session API
│   ├── types/
│   │   ├── client.ts
│   │   └── session.ts         # 🆕 Session Types
│   └── test-data/
│       └── sessions.ts        # 🆕 Mock Data
├── hooks/
├── providers/
├── styles/
└── docs/
