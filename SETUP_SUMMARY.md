# 📋 Setup Summary

## 🖥️ Work Desktop (Default Setup)

**No special configuration needed!** Just use:

```bash
git pull
docker compose up -d
cd backend && alembic upgrade head && python -m uvicorn app.main:app --reload
cd frontend && npm run dev
```

**Ports used:**
- PostgreSQL: `5432`
- Backend: `8000`
- Frontend: `3000`

---

## 💻 Personal Laptop (Port Conflict Fix)

**One-time setup:**

```bash
git pull
cp docker-compose.override.example.yml docker-compose.override.yml
cd backend && cp .env.local.example .env.local
```

**Then run normally:**

```bash
docker compose up -d
cd backend && alembic upgrade head && python -m uvicorn app.main:app --reload
cd frontend && npm run dev
```

**Ports used:**
- PostgreSQL: `5433` (changed from 5432)
- Backend: `8000`
- Frontend: `3000`

---

## 🔄 Workflow

### On Work Desktop:
1. Make changes
2. `git add .`
3. `git commit -m "your message"`
4. `git push origin main`

### On Personal Laptop:
1. `git pull origin main`
2. Run normally (local overrides are preserved)
3. Make changes
4. `git add .`
5. `git commit -m "your message"`
6. `git push origin main`

**Your local overrides (.env.local and docker-compose.override.yml) are git-ignored and won't be committed!**

---

## 📁 What Gets Committed

✅ **Committed to Git:**
- `.env` (default config)
- `.env.example`
- `.env.local.example`
- `docker-compose.yml` (default config)
- `docker-compose.override.example.yml`
- All code files

❌ **NOT Committed (Git-Ignored):**
- `.env.local` (your laptop overrides)
- `docker-compose.override.yml` (your laptop overrides)
- `node_modules/`
- `__pycache__/`
- `venv/`

---

## 🚨 Important Notes

1. **Both devices use the same `main` branch**
2. **No merge conflicts** because local configs are git-ignored
3. **Work desktop uses defaults**, laptop uses overrides
4. **Everyone else who clones the repo** gets working defaults
5. **Override files only needed** if you have port conflicts

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Database connection error | Check if PostgreSQL port matches in `.env.local` and `docker-compose.override.yml` |
| Port already in use | Change ports in override files |
| Migrations fail | Run `docker compose down -v` then `docker compose up -d` |
| CORS error | Make sure frontend runs on port 3000 |

---

## 🎯 Key Commands

```bash
# Start database
docker compose up -d

# Stop and remove database
docker compose down -v

# Run migrations
cd backend && alembic upgrade head

# Start backend
cd backend && python -m uvicorn app.main:app --reload

# Start frontend
cd frontend && npm run dev

# View database logs
docker logs movie_booking_db
```
