# Roxiler Store Ratings Platform

A full-stack store rating platform built for the Roxiler Systems recruitment assignment.

**Stack:** NestJS · React · PostgreSQL · TypeORM · JWT · Tailwind CSS

---

## 🚀 Quick Start (Get it running in 5 minutes)

### Prerequisites
- Node.js 18+
- PostgreSQL running locally

### 1. Database Setup
Open pgAdmin or psql and run:
```sql
CREATE DATABASE roxiler_db;
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your Postgres password, then:
```bash
npm run start:dev
```

### 3. Seed Test Accounts
```bash
npm run seed
```

This creates ready-to-use accounts for all three roles:

| Role | Email | Password |
|---|---|---|
| Admin | admin@roxiler.test | Admin@1234 |
| Normal User | user@roxiler.com | User@1234 |
| Store Owner | owner@roxiler.com | Owner@1234 |

### 4. Frontend
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** — log in with any account above.

---

## ✨ Features

### System Administrator
- Dashboard with live counts — total users, stores, ratings
- Add users (any role) and stores
- Sortable, filterable tables for users and stores
- User detail view — shows store rating if the user is a store owner

### Normal User
- Self-registration with full validation
- Browse and search stores by name or address
- Submit star ratings (1–5) per store
- Modify existing ratings
- Change password

### Store Owner
- Dashboard showing all raters and individual ratings
- Average rating displayed prominently
- Change password

---

## 🏗️ Architecture & Design Decisions

**Role-based access control** is enforced via a single reusable `RolesGuard` + `@Roles()` decorator, not inline `req.user.role` checks in every handler — clean, scalable, easy to extend.

**One rating per user per store** is enforced at the database level with a `@Unique(['user', 'store'])` TypeORM constraint. Re-submitting a rating updates the existing row instead of creating a duplicate — no application-level workarounds needed.

**Validation is field-specific** — separate checks for uppercase vs special character in passwords, so the frontend can display precise inline errors rather than a generic "invalid input" message.

**Case-insensitive search** uses PostgreSQL's `ILIKE` operator throughout — no need for client-side filtering or lowercasing.

**Self-registration only creates normal users** — admins and store owners can only be created by an existing admin, matching the spec exactly.

---

## 📁 Project Structure

```
roxiler-store-ratings/
├── backend/                  # NestJS API
│   └── src/
│       ├── admin/            # Admin endpoints
│       ├── auth/             # JWT auth, guards, decorators
│       ├── ratings/          # Rating submit/update logic
│       ├── store-owner/      # Store owner dashboard
│       ├── stores/           # Store CRUD + search
│       └── users/            # User management
└── frontend/                 # React + Vite + Tailwind
    └── src/
        ├── components/       # DataTable, Navbar, RatingStars, etc.
        ├── context/          # AuthContext (JWT + role state)
        └── pages/
            ├── admin/        # Dashboard, Users, Stores, AddUser
            ├── owner/        # OwnerDashboard
            └── user/         # StoreList with star ratings
```

---

## 🔐 API Reference

| Method | Route | Access | Description |
|---|---|---|---|
| POST | /auth/register | Public | Normal user signup |
| POST | /auth/login | Public | Returns JWT |
| PATCH | /auth/update-password | Any | Change own password |
| GET | /admin/dashboard | Admin | Total users/stores/ratings |
| POST | /admin/users | Admin | Create any role user |
| GET | /admin/users | Admin | List + filter + sort |
| GET | /admin/users/:id | Admin | User detail with rating |
| POST | /admin/stores | Admin | Create store |
| GET | /admin/stores | Admin | List + filter + sort |
| GET | /stores | User | Browse + search stores |
| POST | /stores/:id/rating | User | Submit or update rating |
| GET | /store-owner/dashboard | Store Owner | Raters + avg rating |

All protected routes require `Authorization: Bearer <token>`.

---

## ✅ Validation Rules

| Field | Rule |
|---|---|
| Name | 20–60 characters |
| Address | Max 400 characters |
| Password | 8–16 chars, 1 uppercase, 1 special character |
| Email | Standard email format |

Enforced on both frontend (React) and backend (class-validator DTOs).