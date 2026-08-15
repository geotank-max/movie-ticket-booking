# 🎬 Movie Ticket Booking System

A full-stack movie ticket booking application built with **FastAPI** (Backend) and **Next.js** (Frontend).

---

## 📋 Prerequisites

Make sure you have the following installed:

- **Docker & Docker Compose** (for PostgreSQL database)
- **Python 3.9+** (for backend)
- **Node.js 18+** (for frontend)
- **Git**

---

## 🚀 Quick Start

### 1️⃣ Clone the Repository

```bash
git clone <your-repo-url>
cd movie-ticket-booking
```

### 2️⃣ Start the Database

```bash
docker compose up -d
```

This will start PostgreSQL on port **5432**.

### 3️⃣ Set Up Backend

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start the backend server
python -m uvicorn app.main:app --reload --port 8000
```

Backend will run on: **http://localhost:8000**

### 4️⃣ Set Up Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend will run on: **http://localhost:3000**

---

## 🎯 Default Configuration

The project works **out-of-the-box** with these defaults:

- **PostgreSQL**: `localhost:5432`
- **Backend API**: `localhost:8000`
- **Frontend**: `localhost:3000`
- **Database credentials**:
  - User: `movie_admin`
  - Password: `movie_password`
  - Database: `movie_booking_db`

---

## ⚙️ Custom Configuration (For Port Conflicts)

If you have a **local PostgreSQL service** running on port 5432, follow these steps:

### Option 1: Using Docker Override (Recommended)

1. **Copy the example override file:**
   ```bash
   cp docker-compose.override.example.yml docker-compose.override.yml
   ```

2. **Edit `docker-compose.override.yml`** if needed:
   ```yaml
   services:
     db:
       ports:
         - "5433:5432"  # Change 5433 to any available port
   ```

3. **Create backend environment override:**
   ```bash
   cd backend
   cp .env.local.example .env.local
   ```

4. **Edit `backend/.env.local`** to match your port:
   ```bash
   DATABASE_URL=postgresql://movie_admin:movie_password@localhost:5433/movie_booking_db
   ```

5. **Restart Docker:**
   ```bash
   docker compose down
   docker compose up -d
   ```

6. **Run migrations and start backend** as usual (Step 3 above)

### Option 2: Stop Local PostgreSQL Service

**Windows:**
```powershell
# Run as Administrator
Stop-Service postgresql-x64-XX  # Replace XX with your version
```

**macOS/Linux:**
```bash
sudo systemctl stop postgresql
# or
brew services stop postgresql
```

---

## 🗂️ Project Structure

```
movie-ticket-booking/
├── backend/
│   ├── app/
│   │   ├── core/          # Configuration
│   │   ├── db/            # Database setup
│   │   ├── models/        # SQLAlchemy models
│   │   ├── routers/       # API routes
│   │   ├── schemas/       # Pydantic schemas
│   │   └── main.py        # FastAPI app
│   ├── alembic/           # Database migrations
│   ├── .env               # Environment variables (committed)
│   ├── .env.local         # Local overrides (git-ignored)
│   └── requirements.txt   # Python dependencies
├── frontend/
│   ├── app/               # Next.js pages
│   ├── components/        # React components
│   ├── lib/               # API utilities
│   └── package.json       # Node dependencies
├── docker-compose.yml     # Docker configuration
└── docker-compose.override.yml  # Local Docker overrides (git-ignored)
```

---

## 🐛 Troubleshooting

### ❌ Database Connection Error

**Error:** `password authentication failed for user "movie_admin"`

**Cause:** Port conflict with local PostgreSQL service

**Solution:** Follow "Custom Configuration" steps above

---

### ❌ CORS Error in Browser

**Error:** `Access to fetch at 'http://localhost:8000' blocked by CORS`

**Cause:** Frontend not running on port 3000

**Solution:** Make sure frontend runs on `http://localhost:3000`

---

### ❌ Alembic Command Not Found

**Error:** `alembic: command not found`

**Solution:**
```bash
pip install alembic
# or use Python module directly:
python -m alembic upgrade head
```

---

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

---

## 🔧 Development

### Run Backend Tests
```bash
cd backend
pytest
```

### Run Frontend Linter
```bash
cd frontend
npm run lint
```

### Create New Migration
```bash
cd backend
alembic revision --autogenerate -m "description"
alembic upgrade head
```

---

## 📝 Environment Variables

### Backend (.env)

| Variable      | Default Value                                                  | Description           |
|---------------|----------------------------------------------------------------|-----------------------|
| DATABASE_URL  | `postgresql://movie_admin:movie_password@localhost:5432/...` | PostgreSQL connection |

### Frontend (.env.local)

| Variable              | Default Value            | Description          |
|-----------------------|--------------------------|----------------------|
| NEXT_PUBLIC_API_URL   | `http://localhost:8000` | Backend API endpoint |

---

## 🌐 Deployment

### Backend (Production)
- Use environment variables for sensitive data
- Set `DATABASE_URL` to production PostgreSQL
- Run with gunicorn: `gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app`

### Frontend (Production)
```bash
cd frontend
npm run build
npm start
```

---

## 📄 License

MIT License

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

---

## 💡 Tips

- **Never commit `.env.local` or `docker-compose.override.yml`** - they're for local customization only
- The project is designed to work on **any device** with default settings
- Only create local overrides if you have port conflicts

---

## 🆘 Need Help?

If you encounter issues:
1. Check the Troubleshooting section
2. Ensure Docker is running: `docker ps`
3. Check backend logs: `docker logs movie_booking_db`
4. Verify ports are not in use: `netstat -an | findstr 5432` (Windows) or `lsof -i :5432` (Mac/Linux)
