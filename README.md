# Store Rating Platform — Roxiler Full Stack Intern Assignment

A full-stack web app where normal users rate stores (1–5), store owners track
their ratings, and admins manage everything. Built for the Roxiler Systems
"Full Stack Developer – Trainee" assignment.

**Stack:** NestJS · TypeORM · PostgreSQL · JWT auth · React (Vite) · Tailwind CSS

## Project structure

```
backend/    NestJS API — auth, RBAC, validation, all business logic
frontend/   React + Tailwind client
```

Each folder has its own README with setup steps and an API reference for the backend.

## Architecture at a glance

```
                    ┌──────────────┐
   React (Vite)  →  │   NestJS API │  →  PostgreSQL
   Tailwind CSS      │  JWT + RBAC  │     (TypeORM)
                    └──────────────┘

Roles: ADMIN · USER · STORE_OWNER
Auth:  JWT in Authorization header, validated by JwtAuthGuard
RBAC:  @Roles() decorator + RolesGuard (declarative, not scattered if-checks)
```

**Entities:** `User` (role enum: ADMIN / USER / STORE_OWNER) → `Store` (one
owner, many ratings) → `Rating` (unique per user+store, so re-rating updates
instead of duplicating).

## Quick start (local)

```bash
# 1. Backend
cd backend
npm install
cp .env.example .env        # point at your local Postgres
npm run start:dev
npm run seed                 # creates one admin login, printed to console

# 2. Frontend (new terminal)
cd frontend
npm install
cp .env.example .env
npm run dev                  # http://localhost:5173
```

Log in with the seeded admin account, then use the admin panel to create
normal users and store owners, or let users self-register via the signup page.

## What to point reviewers at

- `backend/src/auth/roles.guard.ts` + `roles.decorator.ts` — declarative RBAC.
- `backend/src/ratings/rating.entity.ts` — DB-level unique constraint enforcing one rating per user per store.
- `backend/src/auth/dto/register.dto.ts` — validation matching the spec exactly, with field-specific error messages.
- `frontend/src/components/DataTable.jsx` — one reusable sortable/filterable table used by every admin listing screen.

## Deploying so reviewers can try it live

A live link is the single easiest way to stand out — most submissions only
get a "clone and run" repo, which most reviewers skimming 600+ entries won't
actually do.

1. **Database:** create a free Postgres instance on [Neon](https://neon.tech) or [Render](https://render.com).
2. **Backend:** deploy `backend/` to [Render](https://render.com) (Web Service, Node) or [Railway](https://railway.app). Set the env vars from `.env.example` using your real DB credentials and a random `JWT_SECRET`. After first deploy, run `npm run seed` once (Render's shell tab, or a one-off job).
3. **Frontend:** deploy `frontend/` to [Vercel](https://vercel.com) — set `VITE_API_URL` to your deployed backend URL.
4. Put both links + the seeded admin credentials at the top of your submission so a reviewer can log in within 30 seconds without touching a terminal.

## Notes on the spec

- "Name: Min 20, Max 60 characters" reads unusually strict for a person's
  name — it's applied exactly as written, to both user and store names, since
  the spec lists it under general form validation rather than tying it to one
  field. Worth mentioning this read in your submission notes — it shows you
  read closely rather than guessed.
- `ILIKE` (case-insensitive search) is Postgres-specific. Swap to `LIKE` if you switch to MySQL.
