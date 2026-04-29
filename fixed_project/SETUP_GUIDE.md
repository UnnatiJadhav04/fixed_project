# InboxGuardian — Full Setup Guide

## Prerequisites

Before you begin, install the following on your machine:

### 1. Python 3.9+
- Download: https://www.python.org/downloads/
- Verify: `python --version`

### 2. Node.js 18+ & npm
- Download: https://nodejs.org/en/download
- Verify: `node --version && npm --version`

### 3. PostgreSQL 14+
- Windows: https://www.postgresql.org/download/windows/
- Mac: `brew install postgresql`
- Verify: `psql --version`

### 4. Redis
- Windows: Use Redis via WSL2 or download https://github.com/microsoftproject/redis/releases
- Mac: `brew install redis`
- Linux: `sudo apt install redis-server`
- Verify: `redis-cli ping` → should return `PONG`

### 5. VS Code Extensions (recommended)
Install these from the VS Code Extensions panel (`Ctrl+Shift+X`):
- **Python** (ms-python.python)
- **Pylance** (ms-python.vscode-pylance)
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **Thunder Client** (REST client for testing APIs)
- **GitLens**

---

## Project Structure

```
claude_review/
├── backend/          ← FastAPI + PostgreSQL + Redis
│   ├── .env          ← Environment config (DO NOT commit)
│   ├── requirements.txt
│   └── app/
│       ├── main.py
│       ├── core/      config.py, security.py
│       ├── db/        session.py, redis_client.py
│       ├── models/    models.py
│       ├── routers/   auth, user, email_account, keyword, alerts_config
│       ├── schemas/   schema.py
│       ├── services/  business logic
│       └── utils/     otp.py, email.py
└── frontend/         ← React + Vite + Tailwind
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── api.js     ← All API calls
        ├── App.jsx    ← Routes
        ├── AuthContext.jsx
        ├── components/
        └── pages/
```

---

## Step 1 — PostgreSQL Setup

Open pgAdmin or `psql` and run:

```sql
CREATE DATABASE inboxguardian;
```

Then confirm your credentials match the `.env` file:
```
DB_USER=postgres
DB_PASSWORD=newpassword123
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inboxguardian
```

> Change `DB_PASSWORD` in `.env` to match your actual postgres password.

---

## Step 2 — Redis Setup

Start Redis (keep this running in a terminal):

```bash
# Mac/Linux
redis-server

# Windows (WSL2)
sudo service redis-server start

# Verify it's up
redis-cli ping   # → PONG
```

---

## Step 3 — Backend Setup (VS Code Terminal 1)

```bash
# 1. Open the backend folder in VS Code or terminal
cd backend

# 2. Create a virtual environment
python -m venv venv

# 3. Activate it
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Verify .env is present (already included in project)
# Edit DB_PASSWORD if needed

# 6. Start the backend
uvicorn app.main:app --reload --port 8100
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8100
INFO:     ✅ Database tables created successfully!
```

**API Docs:** http://127.0.0.1:8100/docs

---

## Step 4 — Frontend Setup (VS Code Terminal 2)

```bash
# 1. Open a new terminal and go to the frontend folder
cd frontend

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

Open **http://localhost:5173** in your browser.

---

## Step 5 — Configure SMTP (Email OTP)

The `.env` already has SMTP credentials for `inboxguardian.app@gmail.com`.

If you want to use your own Gmail:
1. Go to Google Account → Security → 2-Step Verification → App Passwords
2. Generate an App Password for "Mail"
3. Update `.env`:
   ```
   SMTP_USER=your@gmail.com
   SMTP_PASS=xxxx xxxx xxxx xxxx
   ```

---

## User Flow (Correct Order)

```
1. /register       → Enter email → "Send OTP" button
2. Check email     → Get 6-digit OTP
3. /register       → Enter OTP → "Verify OTP" button
4. /register       → Fill full_name, password, mobile → "Register"
5. /login          → Enter email + password → lands on /add-mail
6. /add-mail       → Add Gmail addresses to monitor
7. /add-passkey    → Enter App Password for each added Gmail
8. /add-keywords   → Set subject/sender/body keywords
9. /alert-config   → Choose notification preferences
10. /setup-complete → Done!
```

---

## Bugs Fixed in This Version

| # | File | Bug | Fix |
|---|------|-----|-----|
| 1 | `backend/.env` | `redis = Redis(host=...)` is not a valid env var — `REDIS_HOST` was never set, causing `redis_client` to connect to `None:None` and crash on startup | Changed to `REDIS_HOST=127.0.0.1` and `REDIS_PORT=6379` |
| 2 | `routers/auth.py` | Had `prefix="/auth"` inside the router AND main.py also added `prefix="/auth"` → routes became `/auth/auth/send-otp` (404) | Removed prefix from router file; only main.py sets it |
| 3 | `routers/user.py` | Same double-prefix bug: `/users/user/register` (404) | Removed prefix from router file |
| 4 | `routers/email_account.py` | Same double-prefix: `/email-accounts/email-accounts/add` (404) | Removed prefix from router file |
| 5 | `routers/keyword.py` | Same double-prefix: `/keywords/keywords/bulk-add` (404) | Removed prefix from router file |
| 6 | `routers/alerts_config.py` | Same double-prefix: `/alerts/alerts/config` (404) | Removed prefix from router file |
| 7 | `frontend/vite.config.js` | Proxy pointed to port `8101` but backend runs on `8100` → all API calls failed with connection refused | Changed all proxy targets to `http://127.0.0.1:8100` |
| 8 | `frontend/src/api.js` | `/user/register` and `/user/login` don't match any backend route (backend exposes `/users/...`) | Changed to `/users/register` and `/users/login` |
| 9 | All routers | Errors returned HTTP 200 with `{"message": "error..."}` — frontend `if (!res.ok)` never triggered, so errors appeared as successes | Added proper HTTP 400/401 status codes on all error responses |

---

## VS Code Tips

- **Run backend & frontend simultaneously:** Use the Split Terminal feature (`Ctrl+Shift+5`)
- **Select Python interpreter:** `Ctrl+Shift+P` → "Python: Select Interpreter" → choose `venv`
- **Port already in use?** `lsof -i :8100` (Mac/Linux) or `netstat -ano | findstr :8100` (Windows)
- **View Redis keys:** `redis-cli keys "*"` to inspect stored OTPs

---

## Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `could not connect to server` (PostgreSQL) | Postgres not running | Start PostgreSQL service |
| `Connection refused 6379` (Redis) | Redis not running | Run `redis-server` |
| `Email not verified via OTP` on register | OTP not verified before registering | Complete the OTP step first |
| `CORS error` in browser | Backend not running or wrong port | Ensure backend is on port 8100 |
| `NoneType has no attribute` on startup | `.env` not loaded correctly | Ensure you're running uvicorn from inside the `backend/` folder |
