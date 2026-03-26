# PhishGuard Backend

Real-Time AI/ML-Based Phishing Detection and Prevention System — unified backend service.

## Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript (via `tsx`, no compile step needed)
- **Framework**: Express + Socket.IO
- **Database**: SQLite via `better-sqlite3` (stored at `/tmp/phishguard.sqlite` on Render)

---

## Local Development

```bash
# Install dependencies
npm install

# Start the server
npm start
# or
npx tsx server.ts
```

Server runs at `http://localhost:3000`.

---

## Deploy to Render

### Step 1 — Create a New Web Service

1. Go to [https://render.com](https://render.com) and click **New → Web Service**
2. Connect your GitHub/GitLab repository
3. Set the **Root Directory** to `phishguard-backend`

### Step 2 — Build & Start Settings

| Setting | Value |
|---|---|
| **Build Command** | `npm install` |
| **Start Command** | `npx tsx server.ts` |
| **Runtime** | Node |

### Step 3 — Environment Variables

Add these in Render's **Environment** tab:

| Key | Value |
|---|---|
| `PORT` | `3000` |
| `NODE_ENV` | `production` |

> **Note**: Render automatically sets `PORT` — you can leave it at 3000 or remove it entirely. `NODE_ENV=production` tells the server to skip the Vite dev middleware and serve SQLite at `/tmp/phishguard.sqlite`.

### Step 4 — Deploy

Click **Create Web Service**. Render will run `npm install` then start the server.

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Health check → `{ "status": "ok" }` |
| GET | `/api/v1/detections` | List recent detections |
| GET | `/api/v1/remediations` | List recent remediations |
| GET | `/api/v1/audit_logs` | List audit logs |
| POST | `/api/v1/remediation/quarantine` | Quarantine a threat |
| GET | `/api/v1/correlation/active` | Active threat correlations |
| GET | `/api/v1/siem/configs` | SIEM integration configs |
| POST | `/api/v1/siem/config` | Save a SIEM config |
| POST | `/api/v1/detect` | Detect phishing in URL/email/text |
| POST | `/api/v1/analyze` | Deep threat analysis |

## WebSocket Events

Connect with Socket.IO to receive real-time events:

| Event | Description |
|---|---|
| `threat.detected` | Fired when a new threat is blocked |
| `threat.remediated` | Fired when a remediation action completes |
| `correlation.new` | Fired when a new cross-channel correlation is found |

---

## Database Tables

All tables are auto-created on first run:

- `detections` — blocked phishing attempts
- `remediations` — remediation actions taken
- `audit_logs` — admin/system audit trail
- `correlations` — cross-channel threat correlations
- `siem_configs` — SIEM/SOAR integration settings

> ⚠️ Render's free tier uses an ephemeral filesystem. Data in `/tmp/phishguard.sqlite` is reset on each deploy/restart. Upgrade to a paid plan and use Render Disk or an external database (e.g. Supabase/PlanetScale) for persistence.
