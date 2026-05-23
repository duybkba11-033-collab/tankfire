# TANKFIRE — 2-Player Realtime Tank Battle

Prototype fullstack realtime 2D tank battle.

Structure

```
tankfire/
├── backend/
└── frontend/
```

Quick start (backend)

1. Install dependencies

```bash
cd backend
npm install
```

2. Configure MySQL in `backend/src/config.js` (or set env vars)

3. Create DB and run schema:

```bash
# create database e.g. tankfire
# then run the SQL in backend/schema.sql
```

4. Start backend

```bash
npm run start
```

Frontend (dev)

1. Install

```bash
cd frontend
npm install
npm run dev
```

Open two browser tabs, register two users, login, press "Find Match" and play.
