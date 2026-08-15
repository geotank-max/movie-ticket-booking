# 💻 Laptop Setup Guide (Port Conflict Fix)

This guide is for when you have a **local PostgreSQL service** running on port 5432.

---

## Quick Setup for Your Laptop

Run these commands **once** on your laptop:

### 1️⃣ Create Docker Override

```bash
# From project root
cp docker-compose.override.example.yml docker-compose.override.yml
```

The file is already configured to use port **5433** instead of 5432.

### 2️⃣ Create Backend Environment Override

```bash
cd backend
cp .env.local.example .env.local
```

The file is already configured to connect to port **5433**.

### 3️⃣ Start Everything

```bash
# From project root
docker compose up -d

# Setup backend
cd backend
pip install -r requirements.txt
alembic upgrade head
python -m uvicorn app.main:app --reload --port 8000

# In another terminal, setup frontend
cd frontend
npm install
npm run dev
```

---

## ✅ Done!

Your laptop will now use:
- **PostgreSQL Docker**: Port 5433 (instead of 5432)
- **Backend**: Port 8000
- **Frontend**: Port 3000

Your work desktop will continue using:
- **PostgreSQL Docker**: Port 5432 (default)
- **Backend**: Port 8000
- **Frontend**: Port 3000

**Both configurations work from the same `main` branch!** 🎉

---

## 🔄 Switching Between Devices

**No action needed!** Just:
- `git pull` on either device
- The local overrides (`.env.local` and `docker-compose.override.yml`) are **git-ignored**
- Each device keeps its own configuration

---

## 🗑️ Remove Local Overrides

If you want to reset to default settings:

```bash
# From project root
rm docker-compose.override.yml
rm backend/.env.local

# Restart Docker
docker compose down
docker compose up -d
```
