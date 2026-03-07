# Fitness Tracker

A full-stack fitness tracking web app for logging food and activity, visualising calorie trends, and analysing food photos with AI.

---

## Features

- **Food & Activity Logs** — Track meals and workouts with calorie data
- **AI Image Analysis** — Upload a photo of food and let Gemini estimate the name and calories
- **Calorie Charts** — Recharts-powered visualisations of your daily intake and burn
- **Onboarding** — First-time setup to capture age, weight, and goal
- **Dark Mode** — Light/dark theme toggle
- **Responsive Layout** — Sidebar on desktop, bottom nav on mobile

---

## Tech Stack

| | |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS 4 |
| **UI** | Radix UI / shadcn, Lucide icons, Recharts |
| **Backend** | Strapi 5 (CMS + REST API) |
| **Database** | SQLite |
| **AI** | Google Gemini 2.5 Flash |
| **Auth** | Strapi Users & Permissions (JWT) |

---

## Project Structure

```
fitness-tracker/
├── client/          # React frontend (Vite)
└── server/          # Strapi 5 backend
```

---

## Getting Started

### Prerequisites

- [pnpm](https://pnpm.io) (client)
- Node.js 18+ (server)
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)

---

### 1. Server Setup

```bash
cd server
npm install
```

Create a `.env` file in `server/` (see [Environment Variables](#environment-variables) below), then start the dev server:

```bash
npm run dev
```

The Strapi server runs at `http://localhost:1337`.

---

### 2. Client Setup

```bash
cd client
pnpm install
```

Create a `.env` file in `client/`:

```env
VITE_STRAPI_URL=http://localhost:1337
```

Then start the dev server:

```bash
pnpm dev
```

---

## Environment Variables

### Server (`server/.env`)

```env
HOST=0.0.0.0
PORT=1337

APP_KEYS=
API_TOKEN_SALT=
ADMIN_JWT_SECRET=
TRANSFER_TOKEN_SALT=
ENCRYPTION_KEY=
JWT_SECRET=

DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

GEMINI_API_KEY=your_gemini_api_key
```

> `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `ENCRYPTION_KEY`, and `JWT_SECRET` are generated automatically when you first run `npm run dev`.

### Client (`client/.env`)

```env
VITE_STRAPI_URL=http://localhost:1337
```

---

## Scripts

### Client

| Command | Description |
|---|---|
| `pnpm dev` | Start Vite dev server |
| `pnpm build` | Production build |
| `pnpm lint` | Run ESLint |
| `pnpm pretty` | Run Prettier |

### Server

| Command | Description |
|---|---|
| `npm run dev` | Start Strapi with hot-reload |
| `npm run build` | Build Strapi admin panel |
| `npm start` | Start production server |

---

## CI

GitHub Actions runs lint + build on the client and type-check + build on the server for every push or pull request to `main`.
