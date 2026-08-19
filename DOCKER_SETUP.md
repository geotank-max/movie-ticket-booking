# Docker Setup

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

## Quick Start

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down
```

That's it. The app will be available at:

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| PostgreSQL | localhost:5432 |

## Services Overview

| Container | Image | Port |
|-----------|-------|------|
| `movie_booking_db` | postgres:16 | 5432 |
| `movie_booking_backend` | Python 3.12 + FastAPI | 8000 |
| `movie_booking_frontend` | Node 20 + Next.js | 3000 |

## How It Works

1. **DB** starts first and waits until healthy (via `pg_isready` healthcheck)
2. **Backend** starts after DB is healthy, runs Alembic migrations, then starts Uvicorn
3. **Frontend** starts after backend, serves the production Next.js build

The frontend uses two API URLs:
- `NEXT_PUBLIC_API_URL` — used by the browser (`http://localhost:8000`)
- `INTERNAL_API_URL` — used by server-side rendering inside the container (`http://movie_booking_backend:8000`)

## Common Commands

```bash
# Rebuild after code changes
docker compose up -d --build

# Rebuild a specific service
docker compose up -d --build frontend

# View logs
docker compose logs -f

# View logs for one service
docker compose logs -f backend

# Restart a service
docker compose restart frontend

# Stop and remove volumes (resets database)
docker compose down -v
```

## Database

- **User:** `movie_admin`
- **Password:** `movie_password`
- **Database:** `movie_booking_db`

Connect from host:
```bash
psql -h localhost -U movie_admin -d movie_booking_db
```

## Seed Data

To populate the database with sample movies after containers are running:

```bash
docker exec movie_booking_backend python seed.py
```

## Troubleshooting

**Port already in use?**
Stop any local dev servers running on ports 3000, 8000, or 5432 before starting Docker.

**Frontend shows server error?**
Check if the backend is running: `curl http://localhost:8000/movies/`
Check frontend logs: `docker compose logs frontend`

**Database connection refused?**
Wait a few seconds — the backend waits for the DB healthcheck before starting.
