# Roxiler Backend — NestJS + PostgreSQL

## Stack
- NestJS (Express platform)
- TypeORM + PostgreSQL
- JWT auth via Passport
- class-validator for request validation
- bcrypt for password hashing

## Setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env with your local Postgres credentials
```

Create the database (Postgres must be running locally, or point DB_HOST at a hosted instance):

```sql
CREATE DATABASE roxiler_db;
```

Start the server (auto-creates tables via `synchronize: true`):

```bash
npm run start:dev
```

Create the first admin account so you have something to log in with:

```bash
npm run seed
```

This logs the admin email/password to the console (defaults come from `.env`).

## API overview

| Method | Route | Role | Purpose |
|---|---|---|---|
| POST | /auth/register | public | Normal user signup |
| POST | /auth/login | public | Returns JWT |
| PATCH | /auth/update-password | any logged in | Change own password |
| POST | /admin/users | ADMIN | Create user/admin/store owner |
| GET | /admin/users | ADMIN | List + filter (name/email/address/role) + sort |
| GET | /admin/users/:id | ADMIN | User detail (includes rating if store owner) |
| POST | /admin/stores | ADMIN | Create store, optionally link an owner |
| GET | /admin/stores | ADMIN | List + filter + sort, includes avg rating |
| GET | /admin/dashboard | ADMIN | totalUsers / totalStores / totalRatings |
| GET | /stores | USER | Browse/search stores, own rating included |
| POST | /stores/:id/rating | USER | Submit or update a rating (1–5) |
| GET | /store-owner/dashboard | STORE_OWNER | Raters list + average rating |

All protected routes require `Authorization: Bearer <token>`.

## Design notes (worth mentioning if asked in a review)

- **Role-based access** is enforced with a single reusable `RolesGuard` + `@Roles()` decorator rather than checking `req.user.role` inside every handler — same idea as Spring Security's method-level `@PreAuthorize`.
- **One rating per (user, store)** is enforced at the database level with a TypeORM `@Unique(['user','store'])` constraint, not just in application logic — submitting again updates the existing row instead of creating a duplicate.
- **Validation messages are field-specific** (e.g. separate checks for uppercase vs. special character in passwords) so the frontend can show precise errors instead of a generic "invalid input."
- **`ILIKE` is Postgres-specific** for case-insensitive search/filtering. If you switch to MySQL, replace `ILIKE` with `LIKE` (and consider a case-insensitive collation) in `users.service.ts` and `stores.service.ts`.
- Self-registration (`/auth/register`) can only ever create a normal `USER` — admins and store owners can only be created by an existing admin, matching the spec.
