# ✅ Setup Checklist

## For Your Work Desktop (Already Working)

- [x] Repository cloned
- [x] Default configuration (port 5432)
- [x] No local overrides needed

**Action:** Just `git pull` and continue working as normal!

---

## For Your Personal Laptop (First Time Setup)

### Step 1: Clone and Pull
```bash
git pull origin main
```

### Step 2: Create Local Overrides (One-time only)
```bash
# From project root
cp docker-compose.override.example.yml docker-compose.override.yml

# Create backend override
cd backend
cp .env.local.example .env.local
```

### Step 3: Verify Files Created
Check that these files exist and are **NOT tracked by Git**:
- [ ] `docker-compose.override.yml` exists
- [ ] `backend/.env.local` exists

Verify with:
```bash
git status
# Should NOT show the above files
```

### Step 4: Start Everything
```bash
# Start database
docker compose up -d

# Setup backend
cd backend
pip install -r requirements.txt
alembic upgrade head
python -m uvicorn app.main:app --reload --port 8000

# In new terminal: Setup frontend
cd frontend
npm install
npm run dev
```

### Step 5: Test
- [ ] Backend: http://localhost:8000/docs
- [ ] Frontend: http://localhost:3000
- [ ] Movies page: http://localhost:3000/movies

---

## For Other Team Members (New Developers)

**No special setup needed!** Just follow README.md:

```bash
git clone <repo>
docker compose up -d
cd backend && pip install -r requirements.txt && alembic upgrade head
python -m uvicorn app.main:app --reload
# New terminal
cd frontend && npm install && npm run dev
```

**Default ports work out-of-the-box** on most systems!

---

## 🔍 Verification

After setup, verify your configuration:

### Check Database Port
```bash
docker ps | grep movie_booking_db
# Should show 5432 (desktop) or 5433 (laptop)
```

### Check Backend Config
```bash
# On laptop
cat backend/.env.local
# Should show port 5433

# On desktop  
ls backend/.env.local
# Should NOT exist (file not found)
```

### Test Connection
```bash
cd backend
python -c "from app.core.config import DATABASE_URL; print(DATABASE_URL)"
# Should show the correct port for your machine
```

---

## 📤 Before Pushing Code

Run this to ensure you don't accidentally commit local configs:

```bash
git status

# Should NOT see:
# - .env.local
# - docker-compose.override.yml
```

If you see them, they weren't properly ignored!

---

## 🆘 If Something Goes Wrong

### Reset to Defaults (Desktop)
```bash
# Just pull - you have no overrides
git pull origin main
docker compose down -v
docker compose up -d
```

### Reset to Defaults (Laptop)
```bash
# Keep your overrides
git pull origin main
docker compose down -v
docker compose up -d

# Or remove overrides completely
rm docker-compose.override.yml
rm backend/.env.local
docker compose down -v
docker compose up -d
# Then re-create overrides if needed
```

---

## 🎯 Summary

| Machine | Override Files | Database Port | Action |
|---------|---------------|---------------|---------|
| Work Desktop | ❌ None | 5432 | Just work normally |
| Personal Laptop | ✅ Yes | 5433 | Copy examples once |
| Other Devs | ❌ None | 5432 | Follow README.md |

**Key Point:** Both work desktop and laptop use `main` branch, no conflicts! 🎉
